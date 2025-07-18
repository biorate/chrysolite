import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { DocumentDrivenPort, EmbeddingDrivenPort } from '../../ports';
import { GETOllamaGenerate } from '../../../infrastructure/request';
import { Document } from '../../../domain';

@Injectable()
export class GenerationGetUseCase {
  @Inject(Types.EmbeddingDrivenPort)
  protected readonly embedding: EmbeddingDrivenPort;

  @Inject(Types.DocumentDrivenPort)
  protected readonly document: DocumentDrivenPort;

  public async execute(text: string, threshold: number, limit: number) {
    const embedding = await this.embedding.embed(text);
    const documents = await this.document.findMany({ embedding, threshold, limit });
    const { data } = await GETOllamaGenerate.fetch({
      model: 'deepseek-r1',
      prompt: [
        'На основании полученных данных: ',
        documents.map((item) => item.text).join(', '),
        'Сделай обработку данных на основании поставленной задачи или вопроса, ',
        'ответь чётко и без рассуждений. ',
        'Eсли входных данных нет, то ответь, что - "Нет информации по данной задаче или вопросу": ',
        text,
      ].join(' '),
      stream: false,
      think: false,
    });
    return data.response;
  }
}
