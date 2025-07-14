import { SequelizeConnector as BaseSequelizeConnector } from '@biorate/sequelize';
import * as models from './app/common/infrastructure/persistant';

export class SequelizeConnector extends BaseSequelizeConnector {
  protected readonly models = {
    postgres: Object.values(models),
  };
}
