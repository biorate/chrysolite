---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/api/errors/base-error.ts`) %>
unless_exists: true
---
import { IError } from '../../interfaces';

export abstract class BaseError {
  public abstract process(e: IError): any;
}
