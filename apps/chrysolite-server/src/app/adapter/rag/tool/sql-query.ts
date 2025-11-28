import { z } from 'zod';
import { InferInteropZodInput } from '@langchain/core/utils/types';
import { CommonTool } from './common';

export class SqlQueryTool extends CommonTool {
  protected description = `
    ИНСТРУМЕНТ ПОИСКА В БАЗЕ ДАННЫХ PostgreSQL:
      - Используй только для получения информации из внутренней базы данных
      - Не используй для фактов, которые уже известны
      - Проверь историю диалога перед вызовом
  `;

  protected schema = z.object({
    table: z.string({
      description:
        'SQL таблица в базе данных, возможные варианты [product, employee, migrations]',
    }),
  });

  protected async execute({ table }: InferInteropZodInput<typeof this.schema>) {
    // return `SELECT * FROM ${table} WHERE active = true`;
    if (table === 'employee')
      return `[
        {"id":"1","name":"Иванов","department":"продажи","salary":50000,"active":true},
        {"id":"2","name":"Сидоров","department":"кассы","salary":40000,"active":true}
      ]`;
    if (table === 'product')
      return `[
        {"id":"1","name":"Тумба","price":5000,"active":true},
        {"id":"2","name":"Табуретка","price":4000,"active":true}
      ]`;
    return 'Данные не найдены';
  }
}
