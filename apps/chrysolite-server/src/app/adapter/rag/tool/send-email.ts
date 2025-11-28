import { z } from 'zod';
import { InferInteropZodInput } from '@langchain/core/utils/types';
import { CommonTool } from './common';

export class SendEmailTool extends CommonTool {
  protected description = `
    ИНСТРУМЕНТ ДЛЯ ОТПРАВКИ email СООБЩЕНИЯ
      - используй для отправки сообщения на определённый email
      - Используй только для получения команды или просьбы отправить
  `;

  protected schema = z.object({
    email: z.string({
      description: 'адрес электронной почты',
    }),
    text: z.string({
      description: 'текст письма с данными',
    }),
  });

  protected async execute({ email, text }: InferInteropZodInput<typeof this.schema>) {
    return `Данные отправлены на ${email}`;
  }
}
