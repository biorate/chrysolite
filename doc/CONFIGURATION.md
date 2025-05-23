# Конфигурирование

Для конфигурирования приложения используется пакет
[@biorate/config](https://www.npmjs.com/package/@biorate/config).
Библиотека представляет собой JSON-хранилище с методами get, set, has, merge,
а так же поддерживает шаблонизацию и подстановку значений.

## Примеры:

### get / set:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.set('a', 1);

console.log(config.get<number>('a')); // 1
```

### has:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.set('a', 1);

console.log(config.has('a')); // true
console.log(config.has('b')); // false
```

### merge:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  a: { b: { c: 1 } },
});

config.merge({
  a: { b: { d: 2 } },
});

console.log(config.has('a')); // true
console.log(config.has('a.b')); // true
console.log(config.get<{ c: number; d: number }>('a.b')); // { c: 1, d: 2 }
console.log(config.get<number>('a.b.c')); // 1
console.log(config.get<number>('a.b.d')); // 2
```

Данные можно хранить в иерархическом JSON-е,
а значения получать по JSON-path ([lodash](https://lodash.com/docs)).
Метод get принимает 2 аргумента - JSON-path строку и
значение по умолчанию. Если значение по умолчанию отсутствует и данных по такому
JSON-path не существует (равно undefined), то будет выброшена ошибка с указанием
отсутствия данных по данному пути, в остальных случаях будет либо использовано
значение по умолчанию, либо данные из хранилища, если они присутствуют.

## Примеры вызова метода get со значением по умолчанию:

### Выброс ошибки:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.get<string>('a'); // throw - UndefinedConfigPathError: Undefined config path [a]
```

### Использование значения по умолчанию:

```ts
import { Config } from '@biorate/config';

const config = new Config();

console.log(config.get<string>('a', 'bar')); // bar

config.set('a', 'foo');

console.log(config.get<string>('a', 'bar')); // foo
```

Существуют специальные макросы для шаблонизации **${...}** и подстановки (замены) **#{...}**
значений для уменьшения дублирования данных. Шаблонизация используется для конкатенации
строк (например составление URL из протокола, домена, параметров запроса и т.д.),
подстановка используется для замещения одного значения другим, причём тип данных
может быть любым поддерживаемым JSON, например - объектом или массивом.

### Шаблонизация:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  data: {
    a: 'foo',
    b: 'bar',
  },
  c: '${data.a}_${data.b}',
});

console.log(config.get('c')); // foo_bar
```

### Подстановка:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  data: {
    a: 'foo',
    b: 'bar',
  },
  c: '#{data}',
});

console.log(config.get('c')); // { a: 'foo', b: 'bar' }
```

Пакет [@biorate/config](https://www.npmjs.com/package/@biorate/config)
встраивается в общую архитектуру приложения в виде обычного сервиса.
После чего может быть встроен в любой класс приложения через декоратор
**@inject**.

```ts
import { Types, container, Core } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
}

container.bind<IDog>(Types.Config).to(Config).inSingletonScope();
```

Пакет [@biorate/config](https://www.npmjs.com/package/@biorate/config)
является интерфейсом для конфигурирования приложения, при этом хранилище данных
в нём наполняется при помощи загрузчиков. Абстракция для загрузчиков реализована
в пакете [@biorate/config-loader](https://www.npmjs.com/package/@biorate/config-loader).
При помощи этого пакета можно реализовать обогащение конфига из любого источника.

### Реализованные варианты конфигурирования:

- [Конфигурирование переменными окружения](./ENV_LOADER.md)
- [Конфигурирование фалами](./FILE_LOADER.md)
- [Конфигурирование с помощью VAULT](./VAULT_LOADER.md)
