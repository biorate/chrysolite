import '@tensorflow/tfjs-node';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  load,
  UniversalSentenceEncoder,
} from '@tensorflow-models/universal-sentence-encoder';
import { EmbeddingDrivenPort } from '../../application/ports';

@Injectable()
export class EmbeddingTensorflowAdapter implements EmbeddingDrivenPort, OnModuleInit {
  protected model: UniversalSentenceEncoder;

  public async embed(text: string) {
    const embeddings = await this.model.embed(text);
    return JSON.stringify((await embeddings.array())[0]);
  }

  public async onModuleInit() {
    this.model = await load();
  }
}
