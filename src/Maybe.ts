export function isNull<T>(value: T | null): value is null {
  return value === null;
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined;
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
