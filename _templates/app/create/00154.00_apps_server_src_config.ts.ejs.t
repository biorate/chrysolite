---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/config.ts`) %>
unless_exists: true
---
import { container, inject, Core, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';
import { ConfigLoaderFs } from '@biorate/config-loader-fs';
import { ConfigLoaderVault } from '@biorate/config-loader-vault';
import { Prometheus, IPrometheus } from '@biorate/prometheus';
import { VaultConnector, IVaultConnector } from '@biorate/vault';
import { Application } from './application';
import { IApplication } from './common/interfaces';
<% if (!CUT_EXAMPLES) { -%>
import { Test } from './test';
<% } -%>

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(Types.ConfigLoaderEnv) public configLoaderEnv: ConfigLoader;

  @inject(Types.ConfigLoaderFs) public configLoaderFs: ConfigLoader;

  @inject(Types.ConfigLoaderVault) public configLoaderVault: ConfigLoader;

  @inject(Types.Vault) public vault: IVaultConnector;

  @inject(Types.Prometheus) public prometheus: IPrometheus;

  @inject(Types.Application) public application: IApplication;
  <% if (!CUT_EXAMPLES) { -%>
  @inject(Types.Test) public test: Test;
  <% } -%>
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ConfigLoader>(Types.ConfigLoaderEnv)
  .to(ConfigLoaderEnv)
  .inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderFs).to(ConfigLoaderFs).inSingletonScope();
container
  .bind<ConfigLoader>(Types.ConfigLoaderVault)
  .to(ConfigLoaderVault)
  .inSingletonScope();
container.bind<IVaultConnector>(Types.Vault).to(VaultConnector).inSingletonScope();
container.bind<IPrometheus>(Types.Prometheus).to(Prometheus).inSingletonScope();
container.bind<IApplication>(Types.Application).to(Application).inSingletonScope();
<% if (!CUT_EXAMPLES) { -%>
container.bind<Test>(Types.Test).to(Test).inSingletonScope();
<% } -%>
container.bind<Root>(Root).toSelf().inSingletonScope();
