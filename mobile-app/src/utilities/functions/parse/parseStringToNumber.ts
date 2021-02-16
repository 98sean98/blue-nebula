// try to parse string to a number, if the string is not a number, undefined is returned

export const parseStringToNumber = (value: string) =>
  isNaN(parseFloat(value)) ? undefined : parseFloat(value);
