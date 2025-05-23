# Коннектор Sequelize

Коннектор [@biorate/sequelize](https://www.npmjs.com/package/@biorate/sequelize) является
ORM для работы с SQL базами данных. В основе данного коннектора используется пакет 
[sequelize](https://www.npmjs.com/package/sequelize), документация по работе с соединением 
совпадает с API пакета.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { join } from 'path'; // нужен только для примера соединения с sqlite ниже
import { tmpdir } from 'os'; // нужен только для примера соединения с sqlite ниже
import { container, Core, inject, Types } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';
import {
  ISequelizeConnector,
  SequelizeConnector as BaseSequelizeConnector, 
  Table, 
  Column, 
  Model, 
  DataType
} from '@biorate/sequelize';
```

#### Создаём модель:

```ts
@Table({
  tableName: 'test',
  timestamps: false,
})
export class TestModel extends Model {
  @Column({ type: DataType.CHAR, primaryKey: true })
  title: string;

  @Column(DataType.INTEGER)
  value: number;
}
```

#### Определяем какому соединению какие модели принадлежат:

```ts
class SequelizeConnector extends BaseSequelizeConnector {
  protected readonly models = { ['my-connection']: [TestModel] };
}
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.SequelizeConnector) public connector: ISequelizeConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ISequelizeConnector>(Types.SequelizeConnector).to(SequelizeConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к sequelize в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Sequelize: [
    {
      name: 'my-connection',
      options: {
        logging: false,
        dialect: 'sqlite',
        storage: join(tmpdir(), 'sqlite-test.db'),
      },
    },
  ],
});
```

#### Инициализируем приложение: 

```ts
  const root = container.get<Root>(Root);
  await root.$run();
```

#### Работаем с ORM при помощи API [sequelize](https://www.npmjs.com/package/sequelize):

```ts
  await TestModel.sync();
  await TestModel.create({ title: 'test', value: 1 });
  await TestModel.findOne({ where: { title: 'test' } })
```

#### Получаем доступ к соединению, и выполняем запросы без ORM:

```ts
  const connection = root.connector.get('my-connection');
  const result = await connection.query('SELECT :first + :second AS result', { replacements: { first: 2, second: 2 } });
  console.log(result); // [ [ { result: 4 } ], Statement {} ]
```

Так же пример подключения можно посмотреть тут -
[@biorate/sequelize](https://www.npmjs.com/package/@biorate/sequelize).
