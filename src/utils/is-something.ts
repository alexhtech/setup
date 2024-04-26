export const isSomething = <T>(x: T): x is NonNullable<T> => typeof x !== 'undefined' && x !== null;
