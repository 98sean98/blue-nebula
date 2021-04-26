export const combineClassNames = (
  className1: string,
  className2?: string,
): string => `${className1} ${className2 ?? ''}`;
