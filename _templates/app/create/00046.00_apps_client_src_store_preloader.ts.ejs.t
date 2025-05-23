---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/store/preloader.ts`) %>
unless_exists: true
---
import { injectable, init } from '@biorate/inversion';
import { observable, action, makeObservable } from 'mobx';

@injectable()
export class Preloader {
  @observable public loaded = false;

  public constructor() {
    makeObservable(this);
  }

  @init() @action protected async initialize() {
    this.loaded = true;
  }
}
