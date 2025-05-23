# Коннектор vault

Коннектор [vault](https://www.npmjs.com/package/@biorate/vault) 
предоставляет API для работы с vault.
В основе данного коннектора используется пакет [node-vault](https://www.npmjs.com/package/node-vault), 
документация по работе с соединением совпадает с API пакета.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { VaultConnector, IVaultConnector } from '@biorate/vault';
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
    
  @inject(Types.VaultConnector) public connector: IVaultConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IVaultConnector>(Types.VaultConnector).to(VaultConnector).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к vault в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Vault: [
    {
      name: 'my-connection',
      options: {
        apiVersion: 'v1',
        endpoint: 'http://localhost:8200',
        token: 'admin',
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

#### Работаем с базой данных при помощи API [node-vault](https://www.npmjs.com/package/node-vault):

```ts
  await connection.write('secret/data/test.json', {
    data: { hello: 'world' },
  });

  const result = await connection.read('secret/data/test.json');
  
  console.log(result.data.data); // { hello: 'world' }
```

Так же пример подключения можно посмотреть тут -
[@biorate/vault](https://www.npmjs.com/package/@biorate/vault).
