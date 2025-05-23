# Коннектор MongoDB

Коннектор [@biorate/mongodb](https://www.npmjs.com/package/@biorate/mongodb) является
ORM для работы с базой данных MongoDB. В основе данного коннектора используются пакеты
[mongoose](https://www.npmjs.com/mongoose) и 
[@typegoose/typegoose](https://www.npmjs.com/package/@typegoose/typegoose),
документация по работе с соединением совпадает с API пакетов.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  Severity,
  modelOptions,
  Prop,
  MongoDBConnector,
  IMongoDBConnector,
  model,
  ReturnModelType,
} from '@biorate/mongodb';
```

#### Создаём модель:

```ts
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: { collection: 'test', versionKey: false },
})
export class TestModel {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  age: number;
}
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.MongoDBConnector) public connector: IMongoDBConnector;
  
  @model(TestModel) public test: ReturnModelType<typeof TestModel>;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IMongoDBConnector>(Types.MongoDBConnector).to(MongoDBConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к mongodb в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  MongoDB: [
    {
      name: 'my-connection',
      host: 'mongodb://localhost:27017/',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'test',
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

#### Работаем с ORM при помощи API [mongoose](https://www.npmjs.com/mongoose):

```ts
  await new root.test({
    firstName: 'Vasya',
    lastName: 'Pupkin',
    age: 36,
  }).save();

  const data = await root.test.find({ firstName: 'Vasya' }, { _id: 0 });
  console.log(data); // {
                     //   firstName: 'Vasya',
                     //   lastName: 'Pupkin',
                     //   age: 36,
                     // }
```

#### Получаем доступ к соединению, и выполняем запросы без ORM:

```ts
  const result = await root.connector
    .connection('my-connection')
    .collection('test')
    .findOne({ firstName: 'Vasya' }, { projection: { _id: 0 } });
  console.log(result); // {
                       //   firstName: 'Vasya',
                       //   lastName: 'Pupkin',
                       //   age: 36,
                       // }
```

Так же пример подключения можно посмотреть тут -
[@biorate/mongodb](https://www.npmjs.com/package/@biorate/mongodb)
