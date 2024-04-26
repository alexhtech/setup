import { ContainerModule } from 'inversify';

import { createIOC } from '../ioc/ioc';
import { SipsStore } from './sips.store';

export const sipsModule = createIOC({
  module: new ContainerModule((bind) => {
    bind(SipsStore).toSelf();
  }),
});
