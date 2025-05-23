# Коннектор `redis`

> [!WARNING]
> Данный коннектор считается устаревшим. Рекомендуется использовать [IORedis](./IOREDIS.md)

Коннектор [@biorate/resis](https://www.npmjs.com/package/@biorate/redis) предоставляет API
для работы `redis`.
В основе данного коннектора используется пакет [redis](https://www.npmjs.com/package/redis),
документация по работе с соединением совпадает с API пакета.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IRedisConnector, RedisConnector } from '@biorate/redis';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(Types.RedisConnector) public connector: IRedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<IRedisConnector>(Types.RedisConnector)
  .to(RedisConnector)
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

#### Инициализируем приложение:

```ts
const root = container.get<Root>(Root);
await root.$run();
```

#### Получаем доступ к соединению:

```ts
const connection = root.connector.get('my-connection');
```

#### Работаем с базой данных при помощи API [redis](https://www.npmjs.com/package/redis):

```ts
await connection.set('key', 'value');

console.log(await connection.get('key')); // value
```

Так же пример подключения можно посмотреть тут -
[@biorate/redis](https://www.npmjs.com/package/@biorate/redis).
