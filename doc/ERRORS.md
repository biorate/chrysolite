# Работа с ошибками

Для работы с ошибками существует специальный пакет 
[@biorate/errors](https://www.npmjs.com/package/@biorate/erros).
Данный пакет экспортирует класс **BaseError**.

### Особенности BaseError:

#### Проверка на принадлежность к классу или подклассу ошибок:

```ts
import { BaseError } from '@biorate/errors';

class MyError extends BaseError {
  public constructor(message = 'This is my error!') {
    super(message);
  }
}

console.log(new MyError() instanceof Error); // true
console.log(new MyError() instanceof MyError); // true

class MySecondError extends MyError {
  public constructor() {
    super('This is my second error!');
  }
}

console.log(new MySecondError() instanceof MyError); // true
console.log(new MySecondError() instanceof MySecondError); // true
```

Таким образом можно определять логику обработки исключений в
зависимости от класса ошибки.

#### Форматирование ошибок:

```ts
import { BaseError } from '@biorate/errors';

class FooBarError extends BaseError {
  public constructor(foo: string, bar: number) {
    super('foo: [%s], bar: [%d]', [foo, bar]);
  }
}

const e = new FooBarError('test', 100);

console.log(e.message); // foo: [test], bar: [100]
```

Форматирование производится через [util.format](https://nodejs.org/docs/latest/api/util.html#utilformatformat-args)

#### Проброс метаданных:

```ts
import { BaseError } from '@biorate/errors';

class StatusError extends BaseError {
  public constructor(status: number) {
    super('Status error!', undefined, { status });
  }
}

try {
   new StatusError(404); 
} catch (e) {
    console.log(e.meta.status); // 404
}
```

Полезно для более гибкой обработки исключений,
например - можно автоматически формировать коды ошибок http
в зависимости от выброшенного исключения.

#### Код ошибки:

```ts
import { BaseError } from '@biorate/errors';

class SomeError extends BaseError {
  public constructor() {
    super('Some error!');
  }
}

const e = new SomeError();

console.log(e.code); // SomeError
```

По умолчанию является именем класса, чем создаёт
уникальность для приложения.
