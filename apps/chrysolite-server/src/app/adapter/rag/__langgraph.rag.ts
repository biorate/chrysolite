import { Injectable, Inject } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { HumanMessage, ToolMessage } from '@langchain/core/messages';
import { IConfig } from '@biorate/config';
import { RagDrivenPort, OpenSerpDrivenPort } from '@/app/application/ports';
import { ToolNode, createReactAgent } from '@langchain/langgraph/prebuilt';
import { OpenSerpHttpAdapter } from '@/app/adapter/http/out';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
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
      baseUrl: 'http://192.168.2.123:11434',
      model: 'qwen3:8b',
      // model: 'deepseek-r1:latest',
      // model: 'deepseek-r1:8b',
      // model: 'llama3-groq-tool-use:8b',
      // model: 'vanilj/llama-3.1-instruct-bellman-8b-swedish:q5_k_m',
      // model: 'hengwen/watt-tool-8B:latest',
      // think: true,
      // temperature: 0.1,
      // topK: 40,
    });

    const agent = createReactAgent({
      llm: llm,
      tools: [SearchTool.get<SearchTool>()],
    });

    const search1 = async (state: typeof MessagesAnnotation.State) => {
      // return {
      //   messages: [
      //     {
      //       role: 'user',
      //       content:
      //         'Запрос GET /test-me возвращает body JSON объект содержащий поля a (int) и b (string)',
      //     },
      //   ],
      // };
      return new HumanMessage(
        'Запрос GET /test-me возвращает body JSON объект содержащий поля a (int) и b (string)',
      );
    };

    const search2 = async (state: typeof MessagesAnnotation.State) => {
      return {
        messages: [
          {
            role: 'user',
            content:
              'Запрос POST /test-me возвращает body JSON объект содержащий поля sex (int) и name (string)',
          },
        ],
      };
    };

    const search3 = async (state: typeof MessagesAnnotation.State) => {
      return {
        messages: [
          {
            role: 'user',
            content:
              'Запрос PUT /test-me возвращает body JSON объект содержащий поля c (int) и b (string)',
          },
        ],
      };
    };

    const graph = new StateGraph(MessagesAnnotation)
      .addNode('search1', search1)
      .addNode('search2', search2)
      .addNode('search3', search3)
      .addEdge(START, 'search1')
      .addEdge('search1', 'search2')
      .addEdge('search2', 'search3')
      .addEdge('search3', END)
      .compile();

    const response = await agent.invoke({
      messages: [
        {
          role: 'system',
          content: `
            Ты - ассистент. Твоя задача — быть максимально
            полезным, предоставляя только фактическую информацию. Ты должен быть
            дружелюбным, но не слишком болтливым, отвечай максимально кратко.
            Учитывая контекстную информацию, дай ответ на вопрос, будь конкретен.
            Не фантазируй и не ищи ответов в своих знаниях.
            Отвечай на русском языке.
          `.trim(),
        },
        { role: 'user', content: req },
      ],
    });
    return <string>response.messages[response.messages.length - 1].content;

    // const result = await graph.invoke({
    //   messages: [
    //     {
    //       role: 'system',
    //       content: `
    //         Ты - ассистент. Твоя задача — быть максимально
    //         полезным, предоставляя только фактическую информацию. Ты должен быть
    //         дружелюбным, но не слишком болтливым. Учитывая контекстную информацию,
    //         дай ответ на вопрос, будь конкретен.
    //         Не фантазируй и не ищи ответов в своих знаниях.
    //         Отвечай на русском языке.
    //       `,
    //     },
    //     { role: 'user', content: req },
    //   ],
    // });
    // const response = await llm.invoke(result.messages);
    // console.log(response);
    // return <string>response.content;
  }
}
