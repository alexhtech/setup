import { Container, ContainerModule, injectable } from "inversify";

@injectable()
class Dog {
  say = () => "gav";
}

@injectable()
class Cat {
  say = () => "meow";
}

const container = new Container();

const coreModule = new ContainerModule((bind) => {
  bind(Dog).toSelf();
});

container.load(coreModule);

// loads on demand
const featureModule = new ContainerModule((bind) => {
  //..
});

// useIoc(featureModule);

const catModule = new ContainerModule((bind) => {
  bind(Cat).toSelf();
  bind(Dog).toService(Cat);
});

const catContainer = container.createChild();

catContainer.load(catModule);

const dog = catContainer.get(Dog);

dog.say();
