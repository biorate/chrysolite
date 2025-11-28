import { z } from 'zod';
import { InferInteropZodInput } from '@langchain/core/utils/types';
import { CommonTool } from './common';

export class SearchTool extends CommonTool {
  protected description = `
    ДОКУМЕФНТАЦИЯ HTTP запросов:
    - Используй только для получения СВЕЖЕЙ информации
    - Не используй для фактов, которые уже известны
    - Проверь историю диалога перед вызовом
  `;

  protected schema = z.object({
    // query: z.string({ description: 'Запрос для строки поиска' }),
  });

  protected async execute() {
    return `
      - Запрос GET /test-me возвращает body JSON объект содержащий поля a (int) и b (string)
      - Запрос POST /test-me возвращает body JSON объект содержащий поля sex (int) и name (string)
      - Запрос PUT /test-me возвращает body JSON объект содержащий поля c (int) и d (string)
    `;
  }
}
