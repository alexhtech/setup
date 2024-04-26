import { injectable } from "inversify";

@injectable()
export class TestAService {
  make = () => "hello world";
}
