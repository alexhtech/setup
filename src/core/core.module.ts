import { ContainerModule } from 'inversify';

import { createIOC } from './ioc/ioc';

export const coreModule = createIOC({
  module: new ContainerModule((bind) => {}),
});
