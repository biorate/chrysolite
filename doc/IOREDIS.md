# Коннектор `ioredis`

Коннектор [@biorate/ioredis](https://www.npmjs.com/package/@biorate/ioredis) предоставляет API
для работы `redis`.
В основе данного коннектора используется пакет [ioredis](https://www.npmjs.com/package/ioredis),
документация по работе с соединением совпадает с API пакета.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IORedisConnector } from '@biorate/redis';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(Types.IORedisConnector) public connector: IORedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<IORedisConnector>(Types.IORedisConnector)
  .to(IORedisConnector)
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к `redis` в конфиге:

Используем для этого Loader-ы, смотри:

- [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
- [Конфигурирование фалами](./doc/FILE_LOADER.md)
- [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Redis: [
    {
      name: 'my-connection',
      options: {
        url: 'redis://localhost:6379',
      },
    },
  ],
});
```

```ts
container.get<IConfig>(Types.Config).merge({
  Redis: [
    {
      name: 'my-connection',
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  ],
});
```

#### Поддержка sentinel-подключения

Данный пакет позволяет подключаться к sentinel-кластеру `redis` следующим образом:

```json5
{
  IORedis: [
    {
      name: 'connection',
      options: {
        name: 'mymaster', // имя sentinel-кластера
        password: 'password',
        sentinelPassword: 'password', // совпадает с основным паролем
        sentinels: [
          {
            host: 'server01',
            port: 26379,
          },
          {
            host: 'server02',
            port: 26379,
          },
          {
            host: 'server03',
            port: 26379,
          },
        ],
      },
    },
  ],
}
```

Так же пример подключения можно посмотреть тут -
[@biorate/ioredis](https://www.npmjs.com/package/@biorate/ioredis).

#### Инициализируем приложение:

```ts
const root = container.get<Root>(Root);
await root.$run();
```

#### Получаем доступ к соединению:

```ts
const connection = root.connector.get('my-connection');
```

#### Работаем с базой данных при помощи API [ioredis](https://www.npmjs.com/package/ioredis):

```ts
await connection.set('key', 'value');

console.log(await connection.get('key')); // value
```

#### Поддержка `redis`-параметров

При записи ключа можно передавать любые параметры, которые поддерживает `redis`, например:

```ts
await connection.set('key', 'value', 'NX', 'EX', 300);
```

В данном случае у ключа будет выставлен TTL в 300 секунд и активирован параметр, предотвращающий перезапись ключа, если он уже существует.
