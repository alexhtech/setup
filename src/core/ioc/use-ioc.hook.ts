/* eslint-disable react-hooks/exhaustive-deps */
import { useContainer } from '@redtea/react-inversify';
import { useEffect } from 'react';

import { IOCDescriptor } from './init-ioc';
import { useIOCContext } from './ioc.context';

export const useIOC = (...descriptors: IOCDescriptor[]): void => {
  const { loadDescriptors, IOCTimers, unloadDescriptors } = useIOCContext();

  const container = useContainer();

  loadDescriptors(descriptors, container);

  useEffect(() => {
    descriptors.forEach(({ module }) => clearTimeout(IOCTimers.get(module.id)));

    return () => {
      unloadDescriptors(descriptors, container);
    };
  }, []);
};
