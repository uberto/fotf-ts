// calls the predicate function for each element of the array until the predicate returns a "truthy" value.
export function some<T, R>(pred: (value: T) => R | undefined, coll: T[]): R | undefined {
  for (let value of coll) {
  const newValue = pred(value);
  if (newValue) return newValue;
  }
}