# Архитектура

В основе архитектуры как клиентской, так и серверной части 
лежит пакет [@biorate/inversion](https://www.npmjs.com/package/@biorate/inversion)
построенный на базе пакетов [InversifyJS](https://inversify.io/) и 
[inversify-inject-decorators](https://www.npmjs.com/package/inversify-inject-decorators),
который реализует шаблон "инверсия управления" (IoC) для уменьшения связанности компонентов
(далее - сервисов) в коде.

В большинстве случаев сервис можно реализовать как singleton-класс, реализующий 
некую бизнес-логику, и отвечающий требованью определённому интерфейсу 
(или нескольким интерфейсам). Каждый сервис может обладать жизненным
циклом, при помощи декораторов __init__ и __kill__ можно выполнять необходимые
действия с сервисом на этапах инициализации и деструкторизации приложения.

## Состав пакета @biorate/inversion:
```ts
import { container, injectable, inject, init, kill, Types, Core } from '@biorate/inversion';

container // - контейнер зависимостей
injectable // - декоратор определяющий класс как зависимость
inject // - декоратор внедряющий зависимость в класс
init // - декоратор помечающий метод класса как - инициализирующий, метод будет вызван при старте приложения
kill // - декоратор помечающий метод класса как - деструкторизирующий, метод будет вызван при завершении работы приложения
Types // - Фабрика символов, генерирует уникальный символ в зависимости от свойства по которому к этому объекту обратиться
Core // - Класс от которого наследуется root-config класс, для реализации логики жизненного цикла зависимостей 
```

## Пример создания сервиса:

### Определим интерфейсы сервисов в файле _./interface.ts_:
```ts
export interface IAnimal {
  name: string;
}

export interface IDog extends IAnimal {
  run(): void;
}

export interface IFish extends IAnimal {
  swim(): void;
}

export interface IZoo {
  dog: IDog;
  fish: IFish;
}
```

### Определим сервисы в файле _./services.ts_:
```ts
import { injectable, inject, init, kill, Types } from '@biorate/inversion';
import { IDog, IFish, IZoo } from './interface.ts';

@injectable()
export class Dog implements IDog {
  public name = 'Sharik';

  public run() {
    console.log(`${this.name} run!`);
  }
}

@injectable()
export class Fish implements IFish {
  public name = 'Dori';

  public swim() {
    console.log(`${this.name} swim!`);
  }
}

@injectable()
export class Zoo implements IZoo {
  @inject(Types.Dog) public dog: IDog;

  @inject(Types.Fish) public fish: IFish;

  @init() protected init() {
    console.log(`Zoo is opened!`);
  }

  @kill() protected kill() {
    console.log(`Zoo is closed!`);
  }
}
```

### Определим root-config файл, в котором разрешим все существующие зависимости _./config.ts_:
```ts
import { Types, container, Core } from '@biorate/inversion';
import { IDog, IFish, IZoo } from './interfaces.ts';
import { Dog, Fish, Zoo } from './services.ts';

class Root extends Core() {
  @inject(Types.Dog) public dog: IDog;

  @inject(Types.Fish) public fish: IFish;

  @inject(Types.Zoo) public Zoo: IZoo;
}

container.bind<IDog>(Types.Dog).to(Dog).inSingletonScope();
container.bind<IFish>(Types.Fish).to(Fish).inSingletonScope();
container.bind<IZoo>(Types.Zoo).to(Zoo).inSingletonScope();
```

### Определим точку входа и запустим инициализацию сервисов _./index.ts_:
```ts
import { container } from '@biorate/inversion';
import { Root } from './config';

(async () => {
  await <Root>container.get(Root).$run();
})();
```

 - После разрешения зависимостей, зависимости, будут доступны как свойства
классов (продикорированные через __@inject__), а так же могут быть доступны
при помощи метода __container.get__
- Методы __init__ будут вызваны в порядке иерархии зависимостей и сверху-вниз, 
так как они определены в Root классе в root-config-е, после вызова метода __run__
у root-класса.
- Методы __kill__ будут вызваны параллельно при получении сигнала о 
закрытия приложения

### Метод _container.get_:
```ts
import { container, Types } from '@biorate/inversion';
import { IDog } from './interfaces.ts';

const dog = <IDog>container.get(Types.Dog);
```

Более подробно про IoC контейнер можно прочитать в документации [InversifyJS](https://inversify.io/)


