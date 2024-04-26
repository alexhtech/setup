import { Container } from 'inversify';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

import { isSomething } from '@/utils/is-something';

import { IOCDescriptor } from './init-ioc';

type IOCProviderState = {
  IOCBag: number[];
  IOCTimers: Map<number, NodeJS.Timeout>;
  loadDescriptors: (descriptors: IOCDescriptor[], container: Container) => void;
  unloadDescriptors: (descriptors: IOCDescriptor[], container: Container) => void;
  unloadDescriptor: (descriptor: IOCDescriptor, container: Container) => void;
};

const IOCContext = createContext<IOCProviderState | null>(null);

export const IOCProvider = (props: PropsWithChildren<{ IOCBag: number[] }>) => {
  const { children, IOCBag } = props;

  const [state] = useState(() => {
    const IOCTimers = new Map<number, NodeJS.Timeout>();

    const loadDescriptors = (descriptors: IOCDescriptor[], container: Container) => {
      for (const descriptor of descriptors) {
        if (!IOCBag.includes(descriptor.module.id)) {
          IOCBag.push(descriptor.module.id);
          container.load(descriptor.module);
          descriptor.autoInstantiate?.filter(isSomething).forEach((identifier) => {
            container.get(identifier);
          });
        }
      }
    };

    const unloadDescriptors = (descriptors: IOCDescriptor[], container: Container) => {
      descriptors.forEach((descriptor) => {
        const timer = setTimeout(() => {
          unloadDescriptor(descriptor, container);
        }, 500);

        IOCTimers.set(
          descriptor.module.id,
          // delayed module unmount, to smooth out remount cases
          timer,
        );
      });
    };

    const unloadDescriptor = (descriptor: IOCDescriptor, container: Container) => {
      IOCTimers.delete(descriptor.module.id);
      if (IOCBag.includes(descriptor.module.id)) {
        container.unload(descriptor.module);
        const idx = IOCBag.findIndex((id) => id === descriptor.module.id);
        if (idx !== -1) {
          IOCBag.splice(idx, 1);
        }
      }
    };

    return { IOCBag, IOCTimers, loadDescriptors, unloadDescriptors, unloadDescriptor };
  });

  return <IOCContext.Provider value={state}>{children}</IOCContext.Provider>;
};

export const useIOCContext = () => {
  return useContext(IOCContext) as IOCProviderState;
};
