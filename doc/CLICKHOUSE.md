# Коннектор clickhouse

Коннектор [@biorate/clickhouse](https://www.npmjs.com/package/@biorate/clickhouse) предоставляет API 
для работы с базой данных clickhouse.
В основе данного коннектора используется пакет [@clickhouse/client](https://www.npmjs.com/package/@clickhouse/client), 
документация по работе с соединением совпадает с API пакета.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IClickhouseConnector, ClickhouseConnector } from '@biorate/clickhouse';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.ClickhouseConnector) public connector: IClickhouseConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IClickhouseConnector>(Types.ClickhouseConnector).to(ClickhouseConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к clickhouse в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Clickhouse: [
    {
      name: 'my-connection',
      options: {},
    },
  ],
});
```

#### Инициализируем приложение: 

```ts
  const root = container.get<Root>(Root);
  await root.$run();
```

#### Получаем доступ к соединению:

```ts
  const connection = root.connector.get('my-connection');
```

#### Работаем с базой данных при помощи API [@clickhouse/client](https://www.npmjs.com/package/@clickhouse/client):

```ts
  const cursor = await connection.query({ query: 'SELECT 1 AS result;', format: 'JSON' });

  const { data } = await cursor.json<{ result: number }>();
  
  console.log(data); // [{ result: 1 }]
```

Так же пример подключения можно посмотреть тут -
[@biorate/clickhouse](https://www.npmjs.com/package/@biorate/clickhouse).
