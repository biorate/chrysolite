# Коннектор kafkajs

Коннектор [@biorate/kafkajs](https://www.npmjs.com/package/@biorate/kafkajs) предоставляет API 
для работы с распределённым логом kafka.
В основе данного коннектора используется пакет [kafkajs](https://www.npmjs.com/package/kafkajs).
В коннекторе реализованы хелпер-методы и обёртки для работы с kafkajs. По опыту использования
данная библиотека показывает худшую стабильность и скорость работы 
нежели библиотека [rdkafka](https://www.npmjs.com/package/@biorate/rdkafka).

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { 
  KafkaJSAdminConnector,
  KafkaJSProducerConnector,
  KafkaJSConsumerConnector,
} from '@biorate/kafkajs';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(KafkaJSAdminConnector) public admin: KafkaJSAdminConnector;
  
  @inject(KafkaJSProducerConnector) public producer: KafkaJSProducerConnector;
  
  @inject(KafkaJSConsumerConnector) public consumer: KafkaJSConsumerConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<KafkaJSAdminConnector>(KafkaJSAdminConnector).toSelf().inSingletonScope();
container
  .bind<KafkaJSProducerConnector>(KafkaJSProducerConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<KafkaJSConsumerConnector>(KafkaJSConsumerConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к kafkajs в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  KafkaJSGlobal: {
    brokers: ['localhost:9092'],
    clientId: 'test-app',
    logLevel: 1,
  },
  KafkaJSAdmin: [
    {
      name: 'admin',
      global: '#{KafkaJSGlobal}',
    },
  ],
  KafkaJSProducer: [
    {
      name: 'producer',
      global: '#{KafkaJSGlobal}',
      options: {
        transactionalId: 'my-transactional-producer',
        maxInFlightRequests: 1,
        idempotent: true,
      },
    },
  ],
  KafkaJSConsumer: [
    {
      name: 'consumer',
      global: '#{KafkaJSGlobal}',
      subscribe: { topics: ['test'], fromBeginning: true },
      options: {
        groupId: 'kafkajs',
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

#### Пример работы с admin-коннектором:

```ts
  await root.admin!.current!.createTopics({
    topics: [{ topic: 'test', numPartitions: 1 }],
  });

  await root.admin!.current!.createPartitions({
    topicPartitions: [
      {
        topic: 'test',
        count: 3,
       },
    ],
  });

  const data = await root.admin!.current!.fetchTopicMetadata({ topics: ['test'] });
  
  console.log(data); 
```

#### Пример работы с producer-коннектором:

```ts
  await root.producer!.send('producer', {
    topic: 'test',
    messages: [{
      key: `key`,
      value: `hello world`,
    }],
  });
```

#### Пример работы с consumer-коннектором:

```ts
  root.consumer!.subscribe('consumer', async (messages) => {
    console.log(messages);
  });
```
