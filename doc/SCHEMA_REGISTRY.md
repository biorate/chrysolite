# Коннектор schema-registry

Коннектор [@biorate/schema-registry](https://www.npmjs.com/package/@biorate/schema-registry) предоставляет API 
для взаимодействия со [Schema Registry](https://docs.confluent.io/platform/current/schema-registry/index.html). 
Библиотека построена на [@biorate/axios-prometheus](https://www.npmjs.com/package/@biorate/axios-prometheus).

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  SchemaRegistryConnector,
  ISchemaRegistryConnector,
} from '@biorate/schema-registry';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(SchemaRegistryConnector) public connector: ISchemaRegistryConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ISchemaRegistryConnector>(SchemaRegistryConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к Schema Registry в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  SchemaRegistry: [{ name: 'my-connection', baseURL: 'http://localhost:8085' }],
});
```

#### Инициализируем приложение: 

```ts
  const root = container.get<Root>(Root);
  await root.$run();
```

#### Получаем доступ к соединению:

#### Пример работы с API:

```ts
  const { PostSubjectsVersions } = root.connector.get('my-connection');
  const { data } = await PostSubjectsVersions.fetch({
    subject: 'test',
    schema: {
      type: 'record',
      name: 'Test',
      namespace: 'test',
      fields: [
        {
          name: 'firstName',
          type: 'string',
        },
        {
          name: 'lastName',
          type: 'string',
        },
        {
          name: 'age',
          type: 'int',
        },
      ],
    },
  });
  console.log(data); // { id: 1 }
```
