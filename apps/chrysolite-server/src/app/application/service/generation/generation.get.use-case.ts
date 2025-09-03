import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { DocumentDrivenPort, EmbeddingDrivenPort } from '@/app/application/ports';
import { GETOllamaGenerate } from '@/app/adapter/http/out/request'; //TODO: into adapter
import { Document } from '@/app/domain';

@Injectable()
export class GenerationGetUseCase {
  @Inject(Types.EmbeddingDrivenPort)
  protected readonly embedding: EmbeddingDrivenPort;

  @Inject(Types.DocumentDrivenPort)
  protected readonly document: DocumentDrivenPort;

  public async execute(text: string, threshold: number, limit: number) {
    const embedding = await this.embedding.embed(text);
    const documents = await this.document.findMany({ embedding, threshold, limit });
    if (!documents.length)
      return `"Нет информации по данной задаче или вопросу": ${text}`;
    const { data } = await GETOllamaGenerate.fetch({
      model: 'deepseek-r1:8b',
      prompt: [
        'На основании полученных данных: ',
        documents
          .map((item, index) => `\n __START__ \n` + item.text + `\n __END__ \n`)
          .join(),
        'Сделай обработку данных на основании поставленной задачи или вопроса, ',
        'ответь чётко и без рассуждений, не указывай в каком документе была найдена информация, ',
        'Eсли входных данных нет, то ответь, что - "Нет информации по данной задаче или вопросу": ',
        text,
      ].join('\n'),
      stream: false,
      think: false,
    });
    return data.response;
  }
}
