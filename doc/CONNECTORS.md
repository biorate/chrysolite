# Коннекторы

Пространство [biorate](https://www.npmjs.com/search?q=biorate) предоставляет
большое количество коннекторов для разнообразных задач.

### Коннекторы:

- [minio](https://www.npmjs.com/package/@biorate/minio)
- [sequelize](https://www.npmjs.com/package/@biorate/sequelize)
- [mongodb](https://www.npmjs.com/package/@biorate/mongodb)
- [vault](https://www.npmjs.com/package/@biorate/vault)
- [amqp](https://www.npmjs.com/package/@biorate/amqp)
- [pg](https://www.npmjs.com/package/@biorate/pg)
- [mssql](https://www.npmjs.com/package/@biorate/mssql)
- [clickhouse](https://www.npmjs.com/package/@biorate/clickhouse)
- [redis](https://www.npmjs.com/package/@biorate/redis)
- [rdkafka](https://www.npmjs.com/package/@biorate/rdkafka)
- [kafkajs](https://www.npmjs.com/package/@biorate/kafkajs)
- [proxy](https://www.npmjs.com/package/@biorate/proxy)
- [schema-registry](https://www.npmjs.com/package/@biorate/schema-registry)

Все коннекторы реализуют общий интерфейс [@biorate/connector](https://www.npmjs.com/package/@biorate/connector).

## Для создания нового коннектора необходимо:

### 1. Определить интерфейс конфигурации, соединения и коннектора ./interfaces.ts:

```ts
import { IConnectorConfig, IConnector } from '@biorate/connector';

export interface IMyConnectorConfigOptions {
  foo: string;

  bar: string;
}

export interface IMyConnectorConfig extends IConnectorConfig {
  options: IMyConnectorConfigOptions;
}

export interface IMyConnection {
  options: IMyConnectorConfigOptions;

  ready(): boolean;
}

export type IMyConnector = IConnector<IMyConfig, IMyConnection>;
```

Интерфейс должен иметь обязательное поле **name** (наследуется от **IConnectorConfig**).
Конфигурация зависит от потребностей коннектора. При декорировании уже реализованных
драйверов соединения с БД и т.п. (mongodb, sequelize, pg, и т.д.) удобно выводить
родные настройки для них в отдельное поле, например - **options**, как в примере выше.

### 2. Определить класс соединения ./connection.ts:

```ts
import { IConnectorConfig } from '@biorate/connector';
import { IMyConnectorConfigOptions } from './interfaces.ts';

export class MyConnection implements IMyConnection {
  public options: IMyConnectorConfigOptions;

  public constructor(options: IMyConnectorConfigOptions) {
    this.options = options;
  }

  public ready(ok: boolean) {
    if (!ok) throw new Error('MyConnection not ready!');
  }
}
```

Обычно класс соединения это класс драйвера подключения к ресурсу.
Пример интерфейсов для существующих коннекторов:

```ts
/* Пример для Minio: */
import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Client, ClientOptions } from 'minio';

export type IMinioConnection = Client;

export interface IMinioConfig extends IConnectorConfig {
  host: string;
  options: ClientOptions;
}

export type IMinioConnector = IConnector<IMinioConfig, IMinioConnection>;
```

```ts
/* Пример для mongodb / mongoose: */
import { IConnectorConfig, IConnector } from '@biorate/connector';
import { ConnectOptions, Connection } from 'mongoose';

export type IMongoDBConnection = Connection;

export interface IMongoDBConfig extends IConnectorConfig {
  host: string;
  options: ConnectOptions;
}

export type IMongoDBConnector = IConnector<IMongoDBConfig, IMongoDBConnection>;
```

### 3. Определить коннектор ./connector.ts:

```ts
import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { MyConnection } from './connection';
import { MyCantConnectError } from './errors';
import { IMyConfig, IMyConnection } from './interfaces';

@injectable()
export class MyConnector extends Connector<IMyConnectorConfig, IMyConnection> {
  protected readonly namespace = 'My';

  protected async connect(config: IMyConfig) {
    let connection: IMyConnection;
    try {
      connection = new MyConnection(config.options);
      await connection.ready(true);
    } catch (e: unknown) {
      throw new MyCantConnectError(<Error>e);
    }
    return connection;
  }
}
```

По свойству **namespace** будет определено из какого свойства в
[@biorate/config](https://www.npmjs.com/package/@biorate/config)
будут вычитываться настройки для конфигурирования коннектора.

Для примера выше - это массив данных соответствующий интерфейсу **IMyConnectorConfig**.

Коннектор встраивается в общую архитектуру приложения в виде обычного сервиса.

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { MyConnector, MyConfig, IMyConnector } from './';

class Root extends Core() {
  @inject(Types.MyConnector) public connector: IMyConnector;
}

container.bind<IMyConnector>(Types.MyConnector).to(MyConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

Все коннекторы имеют общие свойства:
```ts
import { container, Types } from '@biorate/inversion';

const my = <IMyConnector>container.get(Types.MyConnector);
```

```
my.connections;               // Геттер, Map<имя, соединение>
my.current;                   // Геттер, соединение по умолчанию - первое установленное или изменённое при помощи use
my.use(name: string);         // Функция, изменить соединение по умолчанию
my.connection(name?: string); // Функция, получить соединение по умолчанию, или по имени соединения
my.get(name?: string);        // Функция, сокращение, для обратной совместимости - тоже самое что и my.connection(name?: string)
```
