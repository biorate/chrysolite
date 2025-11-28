import { z } from 'zod';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import {
  type BaseMessage,
  HumanMessage,
  isAIMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { END, MessagesZodMeta, START, StateGraph } from '@langchain/langgraph';
import { registry } from '@langchain/langgraph/zod';
import { OpenSerpDrivenPort, RagDrivenPort } from '@/app/application/ports';
// import {
//   AnnotationRoot,
//   Annotation,
//   StateGraph,
//   CompiledStateGraph,
// } from '@langchain/langgraph';
import { tool } from '@langchain/core/tools';
import { ChatOllama } from '@langchain/ollama';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { SearchTool, SqlQueryTool, SendEmailTool } from './tool';

interface GraphState {
  value: number;
  history: string[];
}

@Injectable()
export class LanggraphRagAdapter implements RagDrivenPort, OnModuleInit {
  @Inject(Types.OpenSerpDrivenPort)
  protected readonly serp: OpenSerpDrivenPort; //TODO: into use-case

  protected agent: ReturnType<typeof createReactAgent>;

  public async onModuleInit() {
    this.agent = createReactAgent({
      llm: new ChatOllama({
        baseUrl: 'http://192.168.2.123:11434',
        model: 'qwen3:8b',
        think: false,
      }),
      tools: [
        SendEmailTool.get<SendEmailTool>(),
        SqlQueryTool.get<SqlQueryTool>(),
        SearchTool.get<SearchTool>(),
      ],
    });
  }

  public async invoke(req: string) {
    const response = await this.agent.invoke({
      messages: [
        {
          role: 'system',
          content: `
            Ты - ИСПОЛНИТЕЛЬ ЗАДАЧ. Твоя единственная функция - ВЫЗЫВАТЬ ИНСТРУМЕНТЫ для выполнения задач пользователя.

            ДОСТУПНЫЕ ИНСТРУМЕНТЫ:
            1. SqlQueryTool - для любых операций с базой данных
            2. SendEmailTool - для отправки писем  
            3. SearchTool - для поиска информации
            
            ПРАВИЛА:
            - НИКОГДА не объясняй что ты делаешь или собираешься делать
            - НИКОГДА не рассуждай вслух о выборе инструментов
            - СРАЗУ вызывай инструменты когда понимаешь задачу
            - КОМБИНИРУЙ инструменты последовательно для сложных задач
            - ВСЕГДА используй инструменты вместо предположений
            - ОТВЕЧАЙ ТОЛЬКО результатами выполнения инструментов
            
            ЯЗЫК: русский.
            
            ЕСЛИ НЕ УДАЛОСЬ ВЫЗВАТЬ ИНСТРУМЕНТЫ НАПИШИ ОТВЕТЬ: Не удалось выполнить запрос попробуйте ещё 
          `.trim(),
        },
        { role: 'user', content: req },
      ],
    });
    return (
      <string>response.messages.at(-1).content ||
      'Не удалось выполнить запрос попробуйте ещё'
    );
  }
}
