import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';

@Injectable()
export class GreetingTool {
  @Tool({
    name: 'greeting-tool',
    description: 'Используй для приветствия, используй только русский язык',
    parameters: z.object({
      name: z.string().default('World'),
    }),
  })
  protected async sayHello({ name }, context: Context) {
    // await context.reportProgress({ progress: 30, total: 100 });
    return `Привет, меня зовут ${name}, я разработчик, мне 40 лет, моё хобби - игра на гитаре, я работаю уже 20 лет!`;
  }

  @Tool({
    name: 'calculate-tool',
    description: 'Сложи два числа',
    parameters: z.object({
      a: z.number().default(2),
      b: z.number().default(2),
    }),
  })
  protected async calculate({ a, b }, context: Context) {
    return `Сумма равна - ${a} + ${b} = ${a + b}`;
  }

  @Tool({
    name: 'any-tool',
    description:
      'На любые другие вопросы и если ты не нашёл ответа на вопрос рассуждай сам в произвольной форме',
    parameters: z.object({
      question: z.string(),
    }),
  })
  protected async any({ question }, context: Context) {
    return question;
  }
}
