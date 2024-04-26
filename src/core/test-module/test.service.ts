import { injectable } from "inversify";
import { TestAService } from "./test-a.service";

@injectable()
export class TestService {
  constructor(private readonly testServiceA: TestAService) {
    this.testServiceA.make();
  }

  private test = () => {
    this.testServiceA.make();
  };
}
