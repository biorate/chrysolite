# Архитектура клиентского приложения

Клиентское приложение поддерживает следующие технологии:

- [`React`](https://ru.react.js.org/)
- [`Mobx`](https://mobx.js.org/README.html)
- [`react-router-dom`](https://reactrouter.com/start/framework/installation)
- [`i18next`](https://www.i18next.com/)
- [`styled-components`](https://styled-components.com/)

Помимо [`styled-components`](https://styled-components.com/) работу со стилями
можно организовать при помощи любого способа который удобен для проекта или команды,
клиентское приложение поддерживает `css`, `less`, `scss`, а так же модули для всех трёх
препроцессоров стилей.

Архитектура клиентского приложения, так же как и серверного, основана на пакете [@biorate/inversion](https://www.npmjs.com/package/@biorate/inversion),
реализующего принцип инверсии зависимостей. Такой подход позволяет реализовать каскад различных действий
до фактической загрузки view-составляющей приложения, если это необходимо. Так же при помощи принципа
инверсии зависимостей построено mobx-хранилище состояния, что позволяет дробить его на более мелкие модули
и разрешать зависимости между ними.

### Пример mobx-store:

```ts
@injectable()
export class Store {
  protected static StoreContext: React.Context<Store>;

  /* Хук для доступа к хранилищу в реакт компонентах */
  public static useStore: () => Store;

  /* Модуль конфигурации */
  @inject(Types.Config) public config: Config;

  /* Модуль интернационализации */
  @inject(Types.I18n) public i18n: I18n;

  /* Модуль управления спиннером */
  @inject(Types.Spinner) public spinner: Spinner;

  /* Hello world пример */
  @inject(Types.Hello) public hello: Hello;

  /* Модуль предзагрузчика */
  @inject(Types.Preloader) public preloader: Preloader;

  protected constructor() {
    Store.StoreContext = createContext<Store>(this);
    Store.useStore = () => useContext(Store.StoreContext);
  }

  @init() protected async initialize() {}

  @kill() protected destruct() {}
}
```

В клиентское и серверное приложения по умолчанию встроены механизмы конфигурирования
и интернационализации. За это отвечают серверные api:

- `GET /config`
- `GET /locales/{lang}/{namespace}`
- `POST /locales/{lang}/{namespace}`

Конфигурация приходит во время инициализации Config модуля хранилища, с помощью этого
класса можно передать с сервера зависимые от среды исполнения параметры. Интернализация
достигается при помощи I18n модуля и синхронизирует файлы переводов с сервером в автоматическом
режиме в debug среде разработки, в результате чего получается json-файл интернационализации,
который можно перевести на другие языки.

### Пример интернационализации текста:

```tsx
import { t } from '@biorate/i18n';

export const Foo: FC = () => {
  return <div className="center">{t`Привет мир`}</div>;
};
```

### Пример json-файлов интернационализации:

`ru.json`

```json
{
  "Привет мир": "Привет мир"
}
```

`kz.json`

```json
{
  "Привет мир": "Сәлем Әлем"
}
```

Само представление содержится в папке `view`, которая в свою очередь содержит под-папки:

- `components`
- `containers`
- `pages`

В папке `components` содержатся "глупые" компоненты - это компоненты не имеющие
связи с глобальным состоянием, реализующие общие интерфейсы для дальнейшего
переиспользования. (Button, List, Table, и т.д.)

В папке `containers` содержатся "умные" компоненты - это компоненты
связанные с глобальным состоянием, также реализующие общие интерфейсы для
переиспользования. (Layout, AppRoot, и т.д.)

В папке `pages` могут содержаться как "умные", так и "глупые" компоненты. Цель этой
папки - связь компонентов, характеризующихся как - страницы приложения, с роутером.

### Пример "глупого" компонента:

```tsx
import React, { FC } from 'react';
import { Loader } from './loader';
import styles from './index.module.less';

export const Spinner: FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className={styles.spinner}>
      <Loader size="m" className={styles.spinner__spin} />
    </div>
  );
};
```

### Пример "умного" компонента:

```tsx
import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from '@biorate/i18n';
import { routes } from '../../../router';
import { Store } from '../../../store';

export const Bar: FC = observer(() => {
  const { hello, i18n } = Store.useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="center">
      <button onClick={() => void navigate(routes.foo)}>
        {t`Привет мир` + ' ' + id}
      </button>
    </div>
  );
});
```

Роутинг описывается в файле `router.tsx`, с документацией по роутеру можно ознакомиться
на официальном сайте пакета - [`react-router-dom`](https://reactrouter.com/start/framework/installation)

### Пример файла `router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom';
import * as React from 'react';
import * as Pages from './view/pages';

export const routes = {
  root: '/',
  foo: '/foo',
  bar: (id: string | number) => `/bar/${id}`,
};

export const router = createBrowserRouter([
  {
    path: routes.root,
    element: <Pages.Foo />,
  },
  {
    path: routes.foo,
    element: <Pages.Foo />,
  },
  {
    path: routes.bar(':id'),
    element: <Pages.Bar />,
  },
]);
```

Для работы с ошибками рекомендуется использовать пакет [@biorate/errors](https://www.npmjs.com/package/@biorate/erros),
так же как и в серверном приложении, располагая ошибки в папке `errors`.
Подробнее про работу с ошибками описано [тут](./ERRORS.md).

Для реализации http-запросов рекомендуется использовать пакет [@biorate/axios](https://www.npmjs.com/package/@biorate/axios),
располагая api-классы в папке `api` и наследуясь от предложенного класса `BaseApi`.
`BaseApi` реализует автоматическую блокировку страницы спиннером в течении исполнения
запроса, а также реализует фабрику реакций на ошибки при вызове api, которая располагается
в папке `api/errors`. Подробнее про работу с http-запросами описано [тут](./AXIOS.md).

Тестирование приложения производится при помощи фреймворка [`playwright`](https://playwright.dev/).
Для тестов написана своя обёртка в ООП-стиле, которая реализует
связь с [`allure`](https://allurereport.org/) при помощи декораторов.

### Пример playwright-теста:

```ts
import { Severity, ContentType } from 'allure-js-commons';
import {
  suite,
  test,
  issue,
  severity,
  epic,
  feature,
  story,
  owner,
  tag,
  Page,
  description,
  expect,
  allure,
  Context,
} from '@biorate/playwright';
import { Spec } from './common/spec';

@suite('Test')
class Test extends Spec {
  protected static async after() {
    allure.attachment('Test attachment', 'test attachment content', ContentType.TEXT);
  }

  @issue('1')
  @severity(Severity.MINOR)
  @epic('Epic allure test1')
  @feature('Feature allure test1')
  @story('Story allure test1')
  @description('Playwright page test')
  @owner('60000000')
  @tag('tag1')
  @test('test1')
  protected async test1({ page }: { page: Page }) {
    allure.logStep('test1 starts');
    await page.goto('https://playwright.dev/');
    allure.attachment('Playwright test', 'Playwright test content', ContentType.TEXT);
    const screenshot = await page.screenshot();
    allure.attachment('Screenshot', screenshot, ContentType.PNG);
    await expect(page).toHaveTitle(/Playwright/);
    allure.logStep('test1 finished');
  }
}
```
