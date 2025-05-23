# Конфигурирование переменными окружения

Конфигурирование переменными окружения производится при помощи пакета
[@biorate/config-loader-env](https://www.npmjs.com/package/@biorate/config-loader-env).
После инициализации сервиса в хранилище [@biorate/config](https://www.npmjs.com/package/@biorate/config)
будут добавлены все переменные окружения доступные для запустившего процесс пользователя.
Данные (**process.env**) добавляются в хранилище при помощи метода **merge**.

### Пример:

```shell
# Запускаем сервер, указав переменную окружения NODE_ENV (пример для unix систем)
NODE_ENV=development pnpm run start:debug
```

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(Types.ConfigLoaderEnv) public configLoaderEnv: IConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<IConfigLoader>(Types.ConfigLoaderEnv)
  .to(ConfigLoaderEnv)
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = <Root>container.get(Root);
  await root.$run();
  console.log(root.config.get('NODE_ENV')); // development
})();
```
