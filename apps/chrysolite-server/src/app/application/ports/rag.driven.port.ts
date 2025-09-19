export interface RagDrivenPort {
  invoke(req: string): Promise<string>;
}
