export const checkIfObjectValuesAreDefined = (
  object: Record<string, any>,
): boolean =>
  Object.values(object).every((value) => typeof value !== 'undefined');
