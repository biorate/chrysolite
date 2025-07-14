import { inject, Types } from '@biorate/inversion';
import { Singleton } from '@biorate/singleton';
import {
  ISequelizeConnector,
  QueryOptions,
  QueryOptionsWithType,
  QueryTypes,
} from '@biorate/sequelize';

export type ISequelizeOptions = QueryOptions | QueryOptionsWithType<QueryTypes.RAW>;

export abstract class QCommon extends Singleton {
  protected static readonly cache = new WeakMap<typeof QCommon, QCommon>();

  protected static exec<T = unknown>(options?: ISequelizeOptions) {
    return this.instance<QCommon>().exec<T>(options);
  }

  @inject(Types.Sequelize) protected readonly sequelize: ISequelizeConnector;

  protected abstract readonly query: string;

  protected connection = 'postgres';

  protected template(options?: ISequelizeOptions) {
    return this.query;
  }

  protected async exec<T = unknown>(options?: ISequelizeOptions) {
    const result = <[T[], unknown]>(
      ((await this.sequelize
        .get(this.connection)
        .query(this.template(options), options)) as unknown)
    );
    return result[0];
  }
}
