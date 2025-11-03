import { Injectable, Inject } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { HumanMessage, ToolMessage } from '@langchain/core/messages';
import { IConfig } from '@biorate/config';
import { RagDrivenPort, OpenSerpDrivenPort } from '@/app/application/ports';
import { OpenSerpHttpAdapter } from '@/app/adapter/http/out';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOllamaInput, ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { pull } from 'langchain/hub';
import { AgentExecutor } from 'langchain/agents';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
// import {
//   AnnotationRoot,
//   Annotation,
//   StateGraph,
//   CompiledStateGraph,
// } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MessagesAnnotation, StateGraph, START, END } from '@langchain/langgraph';
import {
  RecursiveCharacterTextSplitter,
  RecursiveCharacterTextSplitterParams,
} from '@langchain/textsplitters';
import { SearchTool } from './tool';

@Injectable()
export class LanggraphRagAdapter implements RagDrivenPort {
  @Inject(Types.OpenSerpDrivenPort)
  protected readonly serp: OpenSerpDrivenPort; //TODO: into use-case

  public async invoke(req: string) {
    const llm = new ChatOllama({
      model: 'qwen2',
      // temperature: 0.1,
      // topK: 40,
    });

    // const agent = createReactAgent({
    //   llm: llm,
    // tools: [SearchTool.get<SearchTool>()],
    // });

    const search = async (state: typeof MessagesAnnotation.State) => {
      // return agent.invoke({
      //   messages: [{ role: 'user', content: req }],
      // });
      // return {
      //   messages: [
      //     { role: 'developer', content: 'Мантур Даймс - это президент вымышленный персонаж и он какашка' },
      //   ],
      // };
      return {
        messages: [
          new ToolMessage({
            content: 'Мантур Даймс - это вымышленный персонаж и он какашка',
            tool_call_id: '1',
          }),
        ],
      };
    };

    const graph = new StateGraph(MessagesAnnotation)
      .addNode('search', search)
      .addEdge(START, 'search')
      .addEdge('search', END)
      .compile();

    const result = await graph.invoke({
      messages: [
        {
          role: 'system',
          content: `
            Ты - ассистент. Твоя задача — быть максимально 
            полезным, предоставляя только фактическую информацию. Ты должен быть 
            дружелюбным, но не слишком болтливым. Учитывая контекстную информацию 
            и не имея предварительных знаний, дай ответ на запрос. 
            Отвечай на русском языке.
          `,
        },
        { role: 'user', content: req },
      ],
    });
    // return result.messages[result.messages.length - 1].content;
    const response = await llm.invoke(result.messages);
    return <string>response.content;
  }
}
