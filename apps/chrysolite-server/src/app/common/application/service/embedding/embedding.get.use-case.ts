import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { DocumentDrivenPort, EmbeddingDrivenPort } from '../../ports';
import { QGetDocuments } from '../../../infrastructure/query';
import { Document } from '../../../domain';

@Injectable()
export class EmbeddingGetUseCase {
  @Inject(Types.EmbeddingDrivenPort)
  protected readonly embedding: EmbeddingDrivenPort;

  @Inject(Types.DocumentDrivenPort)
  protected readonly document: DocumentDrivenPort;

  public async execute(text: string, threshold: number, limit: number) {
    const embedding = await this.embedding.embed(text);
    return QGetDocuments.execute({
      embedding,
      threshold,
      limit,
    });
  }
}
