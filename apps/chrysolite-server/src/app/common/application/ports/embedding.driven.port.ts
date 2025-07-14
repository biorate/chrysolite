export interface EmbeddingDrivenPort {
  embed(text: string): Promise<string>;
}
