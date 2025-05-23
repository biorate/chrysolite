# Коннектор rdkafka

Коннектор [@biorate/rdkafka](https://www.npmjs.com/package/@biorate/rdkafka) предоставляет API 
для работы с распределённым логом kafka.
В основе данного коннектора используется пакет [node-rdkafka](https://www.npmjs.com/package/node-rdkafka).
В коннекторе реализованы хелпер-методы и обёртки для работы с rdkafka.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { timer } from '@biorate/tools'; // необходимо только для примеров ниже
import {
  RDKafkaAdminConnector,
  RDKafkaProducerConnector,
  RDKafkaConsumerConnector,
  RDKafkaConsumerStreamConnector,
  RDKafkaHighLevelProducerConnector, 
} from '@biorate/rdkafka';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(RDKafkaAdminConnector) public admin: RDKafkaAdminConnector;
  
  @inject(RDKafkaProducerConnector) public producer: RDKafkaProducerConnector;
  
  @inject(RDKafkaConsumerConnector) public consumer: RDKafkaConsumerConnector;
  
  @inject(RDKafkaConsumerStreamConnector)
  public consumerStream: RDKafkaConsumerStreamConnector;
  
  @inject(RDKafkaHighLevelProducerConnector)
  public highLevelProducer: RDKafkaHighLevelProducerConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<RDKafkaAdminConnector>(RDKafkaAdminConnector).toSelf().inSingletonScope();
container
  .bind<RDKafkaProducerConnector>(RDKafkaProducerConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<RDKafkaConsumerConnector>(RDKafkaConsumerConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<RDKafkaConsumerStreamConnector>(RDKafkaConsumerStreamConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<RDKafkaHighLevelProducerConnector>(RDKafkaHighLevelProducerConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к rdkafka в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  RDKafkaGlobal: {
    'metadata.broker.list': 'localhost:9092',
    'group.id': 'kafka',
    'socket.keepalive.enable': true,
    'queue.buffering.max.ms': 5,
    'allow.auto.create.topics': false,
  },
  RDKafkaTopic: {
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': false,
  },
  RDKafkaAdmin: [
    {
      name: 'admin',
      global: '#{RDKafkaGlobal}',
    },
  ],
  RDKafkaProducer: [
    {
      name: 'producer',
      global: '#{RDKafkaGlobal}',
      pollInterval: 0,
    },
  ],
  RDKafkaHighLevelProducer: [
    {
      name: 'highLevelProducer',
      global: '#{RDKafkaGlobal}',
      pollInterval: 0,
    },
  ],
  RDKafkaConsumer: [
    {
      name: 'consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
    },
  ],
  RDKafkaConsumerStream: [
    {
      name: 'consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
      stream: { topics: ['test'] },
      batch: false,
      concurrency: 1,
      buffer: 100,
      delay: 0,
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

**Внимание**: При работе с admin-коннектором были выявлены аномалии 
в виде разрешения промиса раньше завершения операции создания / удаления топика.
Рекомендуется использовать admin-коннектор [kafkajs](https://www.npmjs.com/package/@biorate/kafkajs),
как более стабильный. В остальных случаях [kafkajs](https://www.npmjs.com/package/@biorate/kafkajs)
показывает худшую стабильность и скорость работы.

```ts
  await root.admin!.current!.createTopic(
    {
      topic: 'test',
      num_partitions: 1,
      replication_factor: 1,
    }
  );

  await root.admin!.current!.deleteTopic('test');
  
  await root.admin!.current!.createPartitions(topic, 3);
```

#### Пример работы с producer и consumer коннекторами:

```ts
  root.producer!.current!.produce('test', null, Buffer.from('hello world!'));
  root.consumer!.current!.subscribe(['test']);
  while (true) {
      await timer.wait();
      const messages = await root.consumer!.current!.consumePromise(1);
      if (!messages.length) continue;
      root.consumer!.current!.commitMessageSync(messages[0]);
      root.consumer!.current!.unsubscribe();
      break;
  }
```

#### Пример работы с high level producer и consumer коннекторами:

```ts
  await root.highLevelProducer!.current!.producePromise(
    'test',
    null,
    Buffer.from('hello world!'),
    null,
    Date.now(),
  );

  root.consumerStream!.current!.subscribe(async (message: Message | Message[]) => {
    console.log(message);
  });
```

#### Особенности конфигурации коннекторов:

- Все конфиги имеют секцию **global** в которое передаются общие глобальные настройки подключения, см. документацию [node-rdkafka](https://www.npmjs.com/package/node-rdkafka).
- Все consumer-ы имеют секцию **topic** для управления поведением чтения топика, см. документацию [node-rdkafka](https://www.npmjs.com/package/node-rdkafka).
- Все producer-ы имеют настройку **pollInterval** (default: **100**), это значение автоматически выставляется при помощи метода **setPollInterval** при создании коннектора см. документацию [node-rdkafka](https://www.npmjs.com/package/node-rdkafka).
- Consumer stream имеет 4 дополнительные настройки:
  - **batch** (default: **false**) - вызывать ли callback пробрасывая сообщения по одному или массивом, по умолчанию.
  - **concurrency** (default: **10**) - максимальное количество сообщений в массиве которое может быть передано в callback (актуально только для **batch** = **true**)
  - **buffer** (default: **100**) - количество сообщений которое предварительно загружается в память и кладётся в очередь обработки. Обычно стоит установить в - 2 (или 3) * **concurency**. 
  - **delay** (deafult: **0**) - Время задержки обработки цикла обработки очереди сообщений. Актуально завышать что бы получать большие чанки сообщений, если поток сообщений очень медленный, а обработка пачки в большее количество сообщений имеет значение (реже дёргаем базу, но большими пачками). Актуально только при **batch** = **true**.

