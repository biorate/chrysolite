import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { DocumentDrivenPort, EmbeddingDrivenPort } from '@/app/application/ports';
import { Document } from '@/app/domain';

@Injectable()
export class EmbeddingCreateUseCase {
  @Inject(Types.EmbeddingDrivenPort)
  protected readonly embedding: EmbeddingDrivenPort;

  @Inject(Types.DocumentDrivenPort)
  protected readonly document: DocumentDrivenPort;

  public async execute(text: string) {
    const embedding = await this.embedding.embed(text);
    return this.document.create(new Document({ text, embedding }));
  }
}
