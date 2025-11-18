export type Validator<T> = (value: unknown) => T;

export function requiredString(name: string): Validator<string> {
  return (value) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`${name} is required`);
    }
    return value;
  };
}

export function optionalNumber(defaultValue?: number): Validator<number | undefined> {
  return (value) => {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      throw new Error(`Value ${value} is not a valid number`);
    }
    return parsed;
  };
}

export function assertEnv(keys: Record<string, Validator<unknown>>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [name, validator] of Object.entries(keys)) {
    const raw = process.env[name];
    result[name] = validator(raw);
  }
  return result;
}
