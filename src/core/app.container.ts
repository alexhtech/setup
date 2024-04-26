import { Container } from "inversify";

import { apiModule } from "@/core/api/api.module";

import { initIOC } from "./ioc/init-ioc";
import { isServer } from "./query/is-server";
import { queryModule } from "./query/query.module";
import { coreModule } from "./core.module";

export const createContainer = () => {
  const container = new Container({
    defaultScope: "Singleton",
    skipBaseClassChecks: true,
  });

  initIOC(container, [apiModule, queryModule, coreModule]);

  return container;
};

let container: Container;

export const getContainer = () => {
  if (isServer) {
    const container = createContainer();

    return container;
  }

  if (!container) {
    container = createContainer();
  }

  return container;
};

let IOCBag: number[];

export const getIOCBag = () => {
  if (isServer) {
    return [];
  }

  if (!IOCBag) {
    IOCBag = [];
  }

  return IOCBag;
};
