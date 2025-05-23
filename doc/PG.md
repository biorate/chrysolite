# Коннектор pg (PostgreSQL)

Коннектор [@biorate/pg](https://www.npmjs.com/package/@biorate/pg) предоставляет API 
для работы с базой данных PostgreSQL.
В основе данного коннектора используются пакеты [pg](https://www.npmjs.com/package/pg),
[pg-cursor](https://www.npmjs.com/package/pg-cursor) и [pg-query-stream](https://www.npmjs.com/package/pg-query-stream)
документация по работе с соединением совпадает с API пакетов. Так же в коннекторе реализованы 
хелпер-методы для работы с курсором и потоками. Sequalize не предоставляет функционала
для потоковой обработки запросов, именно по этому был написан этот коннектор.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { PgConnector, IPgConnector } from '@biorate/pg';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.PgConnector) public connector: IPgConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IPgConnector>(Types.PgConnector).to(PgConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к pg в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Pg: [
    {
      name: 'my-connection',
      options: {
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432,
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

#### Получаем доступ к соединению:

```ts
  const connection = root.connector.get('my-connection');
```

#### Работаем с базой данных при помощи API [pg](https://www.npmjs.com/package/pg):

```ts
  await connection.query(
    `CREATE TABLE test (
         count int,
         text varchar(20)
      );`,
  );

  await connection.query(
    `INSERT INTO test (count, text) VALUES (1, 'test1'), (2, 'test2'), (3, 'test3');`,
  );

  const result = (await connection.query(`SELECT * FROM test;`))!.rows;
  
  console.log(result); // [{"count":1,"text":"test1"},{"count":2,"text":"test2"},{"count":3,"text":"test3"}]
  
```

#### Работа с курсором:

```ts
  const cursor = root.connector!.cursor('my-connection', `SELECT * FROM test;`);
  cursor.read(3, (err, rows) => {
    console.log(rows); // [{"count":1,"text":"test1"},{"count":2,"text":"test2"},{"count":3,"text":"test3"}]
    cursor.close(() => {});
  });
```

#### Работа с потоком:

```ts
  const stream = root.connector!.stream('my-connection', `SELECT * FROM test;`);
  stream.on('data', (row) => console.log(row)); // {"count": 1,"text":"test1"}
  stream.on('end', () => done());
```

Так же пример подключения можно посмотреть тут -
[@biorate/pg](https://www.npmjs.com/package/@biorate/pg).
