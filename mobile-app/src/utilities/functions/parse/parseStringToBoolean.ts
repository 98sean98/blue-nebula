// try to parse string to boolean, if the string is neither a '1' (true) or a '0' (false), undefined is returned

export const parseStringToBoolean = (value: string): boolean | undefined =>
  ['1', '0'].includes(value) ? value === '1' : undefined;
