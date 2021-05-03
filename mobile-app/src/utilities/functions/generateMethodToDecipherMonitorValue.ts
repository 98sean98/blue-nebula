export const generateMethodToDecipherMonitorValue = (
  entityName: string,
  stringCount: number,
) => (rawValue: string): string => {
  const stringArray = rawValue.split(', ');
  const entityNameIndex = stringArray.findIndex((e) => e === entityName);
  return stringArray
    .slice(entityNameIndex, entityNameIndex + stringCount)
    .join(', ');
};
