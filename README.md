# Fullstack typescript шаблон приложения (Nestjs + React + Inversify.JS)

## Пример создания приложения:

- `pnpm i`
- `npx hygen app help`
- `npx hygen app create --client --server --hygen --app-name=name-of-the-app --app-description='My app name' --add-web-socket`

## Запуск приложения:

- `pnpm i`
- `pnpm run build:debug` - запуск клиента в режиме разработки
- `pnpm run start:debug` - запуск сервера в режиме разработки

## Правила создания коммитов:

Мы используем [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) для
формирования автоматического CHANGELOG-а и версионирования приложений.

Используйте `fix:` префикс для изменения patch-составляющей версии.

Используйте `feat:` префикс для изменения minor-составляющей версии.

Используйте `BREAKING CHANGE:` в футере для изменения major-составляющей версии.

### Подробности по ссылке [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Правила именования:

- Используйте kebab-case для именования папок и файлов
- Используйте camelCase для именования переменных и функций
- Используйте PascalCase для именования классов

## Документация:

- [Архитектура](./doc/ARCHITECTURE.md)
- [Конфигурирование](./doc/CONFIGURATION.md)
  - [Конфигурирование переменными окружения](./doc/ENV_LOADER.md)
  - [Конфигурирование фалами](./doc/FILE_LOADER.md)
  - [Конфигурирование с помощью VAULT](./doc/VAULT_LOADER.md)
  - [Запуск приложения на другом порту](./doc/APP_STARTUP_CONFIG.md)
- [Коннекторы](./doc/CONNECTORS.md)
  - [Minio](./doc/MINIO.md)
  - [Sequelize](./doc/SEQUELIZE.md)
  - [MongoDB](./doc/MONGO_DB.md)
  - [Vault](./doc/VAULT.md)
  - [Amqp](./doc/AMQP.md)
  - [Pg](./doc/PG.md)
  - [Mssql](./doc/MSSQL.md)
  - [Clickhouse](./doc/CLICKHOUSE.md)
  - [Redis](./doc/REDIS.md)
  - [IORedis](./doc/IOREDIS.md)
  - [RDkafka](./doc/RDKAFKA.md)
  - [KafkaJS](./doc/KAFKAJS.md)
  - [Proxy](./doc/PROXY.md)
  - [SchemaRegistry](./doc/SCHEMA_REGISTRY.md)
- [Работа с ошибками](./doc/ERRORS.md)
- [HTTP клиент](./doc/AXIOS.md)
- [Миграции](./doc/MIGRATIONS.md)
- [Структура приложения](./doc/APP_STRUCTURE.md)
- [Архитектура клиентского приложения](./doc/CLIENT_APP_ARCH.md)
