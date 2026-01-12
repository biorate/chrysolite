export interface EmbeddingDrivenPort {
  embed(text: string): Promise<Map<string, number[]>>;
}
