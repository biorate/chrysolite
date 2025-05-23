# Коннектор minio (S3)

Коннектор [@biorate/minio](https://www.npmjs.com/package/@biorate/minio) предоставляет API 
для работы с хранилищем S3 (или аналогов с совместимым с S3 API).
В основе данного коннектора используется пакет [minio](https://www.npmjs.com/package/minio), 
документация по работе с соединением совпадает с API пакета.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IMinioConnector, MinioConnector } from '@biorate/minio';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.MinioConnector) public connector: IMinioConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IMinioConnector>(Types.MinioConnector).to(MinioConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к minio в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Minio: [
    {
      name: 'my-connection',
      options: {
        endPoint: 'localhost',
        port: 9000,
        accessKey: 'admin',
        secretKey: 'minioadmin',
        useSSL: false,
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

#### Работаем с базой данных при помощи API [minio](https://www.npmjs.com/package/minio):

```ts
  await connection.makeBucket('test', 'test'); // Создаем бакет

  await connection.putObject(
    'test',
    'test.file',
    Buffer.from('Hello world!'),
  )); // Кладём объект в бакет

  connection.getObject('test', 'test.file', (e, stream) => {
    let data = '';
    stream
      .on('data', (chunk) => (data += chunk.toString('utf8')))
      .on('end', () => console.log(data)); // 'Hello world!'
   }); // Достаём объект из бакета
})();
```

Так же пример подключения можно посмотреть тут -
[@biorate/minio](https://www.npmjs.com/package/@biorate/minio).
