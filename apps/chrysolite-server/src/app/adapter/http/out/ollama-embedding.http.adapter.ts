import { PorterStemmerRu } from 'natural';
import { removeStopwords, rus } from 'stopword';
import { Injectable } from '@nestjs/common';
import { EmbeddingDrivenPort } from '@/app/application/ports';
import { GETOllamaEmbeddings } from './request';

@Injectable()
export class OllamaEmbeddingHttpAdapter implements EmbeddingDrivenPort {
  public async embed(text: string) {
    const {
      data: { embedding },
    } = await GETOllamaEmbeddings.fetch({
      model: 'nomic-embed-text',
      prompt: removeStopwords(PorterStemmerRu.tokenizeAndStem(text), rus).join(' '),
    });
    return JSON.stringify(embedding);
  }
}
