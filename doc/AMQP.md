# Коннектор AMQP

Коннектор [@biorate/amqp](https://www.npmjs.com/package/@biorate/amqp) предоставляет API 
для работы с AMQP очередями (RabbitMQ).
В основе данного коннектора используются пакеты [amqplib](https://www.npmjs.com/package/amqplib)
и [amqp-connection-manager](https://www.npmjs.com/package/amqp-connection-manager), 
документация по работе с соединением совпадает с API пакетов.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IAmqpConnector, AmqpConnector } from '@biorate/amqp';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.AmqpConnector) public connector: IAmqpConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IAmqpConnector>(Types.AmqpConnector).to(AmqpConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к amqp в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Amqp: [
    {
      name: 'my-connection',
      urls: ['amqp://localhost:5672'],
    },
  ],
});
```

#### Инициализируем приложение: 

```ts
  const root = container.get<Root>(Root);
  await root.$run();
```

#### Коннектор предоставляет метод createChannel и channel для работы с очередями:

```ts
  root.connector.createChannel('my-connection', {
    name: 'my-channel',
    json: true,
    setup: async (channel: Channel) => {
      await channel.assertExchange('test-exchange', 'topic');
      await channel.assertQueue('test-queue', { exclusive: true, autoDelete: true });
      await channel.bindQueue('test-queue', 'test-exchange', '#send');
      await channel.consume('test-queue', (data: ConsumeMessage | null) => {
        console.log(data?.content?.toString?.()); // {"test": 1}
      });
    },
  });

  root.connector.channel('my-channel')!.publish('test-exchange', '#send', { test: 1 });
```

Так же пример подключения можно посмотреть тут -
[@biorate/amqp](https://www.npmjs.com/package/@biorate/amqp).
