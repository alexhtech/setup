import { ContainerModule } from "inversify";
import { createIOC } from "./ioc/ioc";
import { TestAService } from "./test-module/test-a.service";
import { TestService } from "./test-module/test.service";

export const coreModule = createIOC({
  module: new ContainerModule((bind) => {
    bind(TestService).toSelf();
    bind(TestAService).toSelf();
  }),
});
