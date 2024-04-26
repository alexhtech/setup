export namespace Collection {
  export const takeFirst = <T>(array?: T[]): T | undefined => {
    if (!array) return undefined;

    return array[0];
  };

  export const takeLast = <T>(array: T[]): T | undefined => {
    return array[array.length - 1];
  };

  export const unflatten = <T>(array: T[], size: number): T[][] => {
    const result = [];

    for (let index = 0; index < array.length / size; index++) {
      result.push(array.slice(index * size, index * size + size));
    }

    return result;
  };
}
