import { Injectable } from '@nestjs/common';
import { OpenSerpDrivenPort } from '@/app/application/ports';
import { GETOpenSerpSearch } from './request';

@Injectable()
export class OpenSerpHttpAdapter implements OpenSerpDrivenPort {
  public async search(text: string) {
    const { data } = await GETOpenSerpSearch.fetch({ text });
    return data;
  }
}
