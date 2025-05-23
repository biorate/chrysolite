# Конфигурирование фалами

Конфигурирование фалами производится при помощи пакета
[@biorate/config-loader-file](https://www.npmjs.com/package/@biorate/config-loader-file).
После инициализации сервиса в хранилище [@biorate/config](https://www.npmjs.com/package/@biorate/config)
будут добавлены файлы config.json и config.[NODE_ENV].json, где [NODE_ENV]
переменная окружения, определяющая среду исполнения приложения.
Если [NODE_ENV] не определена, по умолчанию будет использовано значение - debug.
Если какого-либо файла не существует, будет выброшено
предупреждение, при этом процесс не будет остановлен. Так же есть возможность подгружать
произвольное количество файлов с произвольными именами.

##### ./config.json и ./config.debug.json

```sh
# Записываем в config.json / config.debug.json данные, в папке серверного приложения (пример для unix систем)
echo '{"hello": "world"}' > config.json
echo '{"foo": "bar"}' > config.debug.json
```

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderFs } from '@biorate/config-loader-fs';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(Types.ConfigLoaderFs) public configLoaderFs: IConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderFs).to(ConfigLoaderFs).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = <Root>container.get(Root);
  await root.$run();
  console.log(root.config.get('hello')); // world
  console.log(root.config.get('foo')); // bar
})();
```

Можно дополнительно определить список файлов, путём указания в
config.json или config.[NODE_ENV].json следующей структуры:

```json
{
  "ConfigLoaderFs": [
    {
      "directory": "/configmap",
      "file": "config.configmap.json"
    }
  ]
}
```

Пример выше загрузит файл из директории **/configmap**, если 
директорию не указывать, то файл будет искаться в рабочей директории (**cwd**).

Файлы обогащают конфиг хранилище при помощи команды **merge**. 
Совпадения свойств приведёт к переопределению в соответствии
с порядком загрузки.

Порядок загрузки:

- config.json
- config.[NODE_ENV].json
- кастомные файлы, прописанные в ConfigLoaderFs свойстве 
конфиг хранилища в порядке расположения в массиве.
