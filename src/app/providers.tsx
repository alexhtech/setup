"use client";

import { Context } from "@redtea/react-inversify";

import * as React from "react";
import { useState } from "react";

import { getContainer, getIOCBag } from "@/core/app.container";

import { IOCProvider } from "@/core/ioc/ioc.context";
import { QueryCacheProvider } from "@/core/query/query-cache.provider";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers(props: ProvidersProps) {
  const [container] = useState(() => getContainer());

  const [IOCBag] = useState(() => getIOCBag());

  return (
    <IOCProvider IOCBag={IOCBag}>
      <QueryCacheProvider container={container}>
        <Context.Provider value={container}>{props.children}</Context.Provider>
      </QueryCacheProvider>
    </IOCProvider>
  );
}
