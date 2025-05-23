# Конфигурирование с помощью VAULT

Конфигурирование с помощью Vault производится при помощи пакета
[@biorate/config-loader-vault](https://www.npmjs.com/package/@biorate/config-loader-vault).
После инициализации сервиса в хранилище [@biorate/config](https://www.npmjs.com/package/@biorate/config)
будут добавлены данные из Vault, согласно заданному в конфиг хранилище свойству - ConfigLoaderVault.

Vault загрузчик может работать в 2-х режимах - обогащать конфиг хранилище и загружать
содержимое из свойств объектов в файлы. Загрузка данных в файлы полезна в случае,
когда необходимо получить из хранилища сертификат для соединения с БД.
Типы операций определяются в ConfigLoaderVault.

Также для соединения с Vault необходимо подключить и описать в конфиг хранилище
параметры для Vault-коннектора [@biorate/vault](https://www.npmjs.com/package/@biorate/vault).

[//]: # 'ссылка на vault connector статью'

### Пример:

#### Пример файла config.json (написан в стиле JSON5 для возможности оставления комментариев):

```json5
{
  Vault: [
    {
      name: 'connection-name', // Имя коннектора
      options: {
        /* Конфигурация для node-vault пакета */
        apiVersion: 'v1',
        endpoint: 'http://localhost:8200',
        namespace: 'some-team-namespace',
        pathPrefix: '/applications/data',
      },
      auth: {
        /* Способ аутентификации node-value пакета */
        type: 'approleLogin', // метод
        responseTokenPath: 'auth.client_token', // ссылка на токен из ответа
        args: [ // аргументы функции аутентификации
          {
            role_id: '#{VAULT_ROLE_ID}',
            secret_id: '#{VAULT_SECRET_ID}',
          },
        ],
      },
    },
  ],
  ConfigLoaderVault: [
    {
      action: 'merge', // Тип операции - слияние данных из Vault с конфиг хранилищем
      path: 'secret/data/config.json',
      connection: 'connection-name', // ссылка на коннектор
      cache: false, // нужно ли кешировать файл после первой загрузки
    },
    {
      action: 'download', // Тип операции - загрузка файлов из Vault
      directory: 'certs', // Имя папки - certs (в CWD), не обязательное, по умолчанию - downloads
      path: 'secret/data/files.json',
      connection: 'connection-name',
      cache: false,
    },
  ],
}
```

#### Пример содержимого Vault secret/data/config.json:

```json
{
  "hello": "world"
}
```

#### Пример содержимого Vault secret/data/files.json:

```json
{
  "client-all-2023.pem": "-----BEGIN CERTIFICATE-----\nSOME_SECRET_VALUE\n-----END RSA PRIVATE KEY-----",
  "client-all.pem": "-----BEGIN CERTIFICATE-----\nSOME_SECRET_VALUE\n-----END RSA PRIVATE KEY-----",
  "kafka.pem": "-----BEGIN CERTIFICATE-----\nSOME_SECRET_VALUE\n-----END CERTIFICATE-----\n",
  "lmru-ca.pem": "-----BEGIN CERTIFICATE-----\nSOME_SECRET_VALUE\n-----END CERTIFICATE-----",
  "hello.txt": "world!"
}
```

#### Root-config ./config.ts:

```ts
import { promises as fs } from 'fs';
import { path } from '@biorate/tools';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IVaultConnector, VaultConnector } from '@biorate/vault';
import { IConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderVault } from '@biorate/config-loader-vault';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(Types.Vault) public vault: IVaultConnector;

  @inject(Types.ConfigLoaderVault) public configLoaderVault: IConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IVaultConnector>(Types.Vault).to(VaultConnector).inSingletonScope();
container
  .bind<IConfigLoader>(Types.ConfigLoaderVault)
  .to(ConfigLoaderVault)
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(root.config.get('hello')); // world! (merge)
  const file = await fs.readFile(
    path.create(process.cwd(), 'certs', 'hello.txt'),
    'utf-8',
  );
  console.log(file); // world! (download)
})();
```
