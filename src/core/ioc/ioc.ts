import { IOCDescriptor } from './init-ioc';

export const createIOC = ({ module, autoInstantiate }: Omit<IOCDescriptor, 'identifier'>): IOCDescriptor => {
  const identifier = Symbol('descriptor');

  return { module, autoInstantiate, identifier };
};
