# Коннектор proxy

Коннектор [@biorate/proxy](https://www.npmjs.com/package/@biorate/proxy) предоставляет API 
для проксирования tcp соединений. Имеет настройку для определения liveness пробы через http
протокол. Может быть использован для соединения кластера PostgreSQL с использованием [patroni](https://patroni.readthedocs.io/en/latest/).
В пакете присутствует мониторинг статистики подключений через встроенный http интерфейс.

### Пример подключения коннектора:

#### Импортируем зависимости:

```ts
import { Server as HTTPServer } from 'http';
import { Server as TCPServer } from 'net';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ProxyConnector } from '@biorate/proxy';
```

#### Определим константы для портов соединений:

```ts
const httpPort = 8001;
const clientPort = 7001;
const serverPort = 7002;
```

#### Создаём root-конфиг и разрешаем зависимости:

```ts
class Root extends Core() {
  /* Helper-метод для подключения к прокси */
  public static connect() {
    const socket = new TCPSocket();
    socket.connect(serverPort);
    return socket;
  }

  @inject(Types.Config) public config: IConfig;
  
  @inject(ProxyConnector) public connector: ProxyConnector;
  
  /* http-сервер liveness пробы */
  public http: HTTPServer;

  /* tcp-прокси сервер */
  public tcp: TCPServer;

  protected constructor() {
    super();
    this.http = new HTTPServer();
    this.http.listen(httpPort);
    this.http.on('request', (req, res) => {
      res.writeHead(200);
      res.end('1');
    });
    this.tcp = new TCPServer();
    this.tcp.listen(clientPort);
    this.tcp.on('connection', (socket) =>
      socket.on('data', (data) => socket.write(`${data} world!`)),
    );
  }
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ProxyConnector>(ProxyConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
```

#### Описываем настройки для подключения к proxy в конфиге:

Используем для этого Loader-ы, смотри:
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)

В примере ниже конфигурируем прямо в приложении, через метод [config.merge](./doc/CONFIGURATION.md)
(просто для примера, в реальном приложении так делать не надо, т.к. сенситивные данные
попадут в код):

```ts
container.get<IConfig>(Types.Config).merge({
  Proxy: [
    {
      name: 'my-connection',
      retry: 10,
      server: {
        address: {
          host: 'localhost',
          port: serverPort,
        },
      },
      clients: [
        {
          liveness: `http://localhost:${httpPort}`,
          address: {
            host: 'localhost',
            port: clientPort,
          },
        },
      ],
    },
  ],
});
```

#### Инициализируем приложение: 

```ts
  const root = container.get<Root>(Root);
  await root.$run();
```

#### Проверяем работу прокси:

```ts
  const socket = Root.connect();
  socket.write('Hello');
  socket.on('data', (data) => {
    console.log(data.toString()); // Hello world!
  });
```

#### Конфигурация:
- **checkInterval?** (default: **undefined**) - (Number) интервал проверки liveness-пробы. По умолчанию - выключено, подключение к прокси только на инециализации.
- **retry?** (default: **10**) - Количество попыток проверки liveness-пробы при отсутствии "живого" инстанса для прокси.
- **timeout?** (default: **1000**) - Таймаут между переподключениями при при отсутствии "живого" инстанса для прокси.
- **server** - Настройки прокси сервера.
  - **options?** - Объект настроек сервера [ServerOpts](https://nodejs.org/docs/latest/api/net.html#netcreateserveroptions-connectionlistener).
  - **address** - Объект [ListenOptions](https://nodejs.org/docs/latest/api/net.html#serverlistenoptions-callback).
- **[clients]** - Массив клиентов для подключения (инстансы для прокси).
  - **liveness?** - Http адрес проверки liveness-пробы.
  - **address** - Объект [TcpSocketConnectOpts](https://nodejs.org/docs/latest/api/net.html#socketconnectoptions-connectlistener)
  - **options?** - Объект [SocketConstructorOpts](https://nodejs.org/docs/latest/api/net.html#new-netsocketoptions)

#### Статистика:

Для включения статистики необходимо определить в конфиге свойство ProxyStats:

- **ProxyStats**
  - **enabled** (default: false) - включена ли статистика.
  - **port** (default: 0) - порт сервера статистики.
  - **host** (default: localhost) - хост сервера статистики.
