import { ContainerModule } from 'inversify';

import { createIOC } from '../ioc/ioc';
import { QueryLoader } from './query.loader';

export const queryModule = createIOC({
  module: new ContainerModule((bind) => {
    bind(QueryLoader).toSelf();
  }),
});
