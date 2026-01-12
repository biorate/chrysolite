import { PorterStemmerRu } from 'natural';
import { removeStopwords, rus } from 'stopword';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EmbeddingDrivenPort } from '@/app/application/ports';
import {
  RecursiveCharacterTextSplitter,
  RecursiveCharacterTextSplitterParams,
} from '@langchain/textsplitters';
import { GETOllamaEmbeddings } from './request';

@Injectable()
export class OllamaEmbeddingHttpAdapter implements EmbeddingDrivenPort, OnModuleInit {
  @inject(Types.Config) public readonly config: IConfig;

  public splitter: RecursiveCharacterTextSplitter;

  public async embed(text: string) {
    const texts = await this.splitter.splitText(text);
    const result = new Map<string, number[]>();
    const tasks: ReturnType<typeof GETOllamaEmbeddings.fetch>[] = [];
    for (const text of texts) {
      tasks.push(
        GETOllamaEmbeddings.fetch({
          model: 'nomic-embed-text',
          prompt: removeStopwords(PorterStemmerRu.tokenizeAndStem(text), rus).join(' '),
        }),
      );
    }
    const embeddings = (await Promise.all(tasks)).map(({ data }) => data.embedding);
    for (let i = texts.length; i--; ) result.set(texts[i], embeddings[i]);
    return result;
  }

  public onModuleInit() {
    this.splitter = new RecursiveCharacterTextSplitter(
      this.config.get<Partial<RecursiveCharacterTextSplitterParams>>('TextSplitter', {
        chunkSize: 768,
        chunkOverlap: 200,
      }),
    );
  }
}
