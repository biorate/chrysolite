import { z } from 'zod';
import { InferInteropZodInput } from '@langchain/core/utils/types';
import { CommonTool } from './common';

export class SearchTool extends CommonTool {
  protected description = `
    ИНСТРУМЕНТ ПОИСКА:
    - Используй только для получения СВЕЖЕЙ информации
    - Не используй для фактов, которые уже известны
    - Проверь историю диалога перед вызовом
    - Если поиск не дал результатов - попробуй изменить запрос, а не повторять тот же
    - МАКСИМУМ 2 вызова подряд с разными параметрами
  `;

  protected schema = z.object({
    query: z.string({ description: 'Запрос для строки поиска' }),
  });

  protected async execute({ query }: InferInteropZodInput<typeof this.schema>) {
    return `Это тестовое сообщение из интернета на запрос: ${query}`;
  }
}
