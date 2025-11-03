import { Injectable, OnModuleInit } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { RagDrivenPort } from '@/app/application/ports';
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

@Injectable()
export class LangchainRagAdapter implements RagDrivenPort {
  public async invoke(req: string) {
    const mockLlm1 = (state: typeof MessagesAnnotation.State) => {
      return { messages: [{ role: 'ai', content: 'hello world' }] };
    };
    const mockLlm2 = (state: typeof MessagesAnnotation.State) => {
      return { messages: [{ role: 'ai', content: 'test' }] };
    };
    const graph = new StateGraph(MessagesAnnotation)
      .addNode('mock_llm1', mockLlm1)
      .addNode('mock_llm2', mockLlm2)
      .addEdge(START, 'mock_llm1')
      .addEdge('mock_llm1', 'mock_llm2')
      .addEdge('mock_llm1', END)
      .compile();
    const result = await graph.invoke({ messages: [{ role: 'user', content: 'hi!' }] });
    return '';
  }
}
