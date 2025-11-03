import { GETOpenSerpSearchRES } from '@/app/adapter/http/out/dto';

export interface OpenSerpDrivenPort {
  search(text: string): Promise<GETOpenSerpSearchRES>;
}
