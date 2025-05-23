# Коннектор mssql

Коннектор [@biorate/mssql](https://www.npmjs.com/package/@biorate/mssql) предоставляет API 
для работы с базой данных SQL Server (MSSQL).
В основе данного коннектора используется пакет [mssql](https://www.npmjs.com/package/mssql),
документация по работе с соединением совпадает с API пакетов. Sequalize не предоставляет функционала
для потоковой обработки запросов, именно по этому был написан этот коннектор.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IMssqlConnector, MssqlConnector } from '@biorate/mssql';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.MssqlConnector) public connector: IMssqlConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IMssqlConnector>(Types.MssqlConnector).to(MssqlConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к mssql в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Mssql: [
    {
      name: 'my-connection',
      options: {
        server: 'localhost',
        user: 'sa',
        password: 'admin_007',
        database: 'master',
        options: {
          trustServerCertificate: true,
        },
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

#### Работаем с базой данных при помощи API [mssql](https://www.npmjs.com/package/mssql):

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
  
  const result = await root.connector!.current?.query(`SELECT * FROM test;`);
  
  console.log(result);
  // {
  //    recordsets: [ [ [Object], [Object], [Object] ] ],
  //    recordset: [
  //      { count: 1, text: 'test1' },
  //      { count: 2, text: 'test2' },
  //      { count: 3, text: 'test3' }
  //    ],
  //    output: {},
  //    rowsAffected: [ 3 ]
  //  }
```

Пример работы с потоком можно посмотреть в официальной документации, в разделе 
Streaming - [mssql](https://www.npmjs.com/package/mssql).

Так же пример подключения можно посмотреть тут -
[@biorate/mssql](https://www.npmjs.com/package/@biorate/mssql).
