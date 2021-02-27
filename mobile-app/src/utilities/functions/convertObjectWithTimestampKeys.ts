import moment from 'moment';

export const convertObjectWithTimestampKeys = (
  object: Record<string, any>,
  keys: Array<string>,
): Record<string, any> => {
  const convertedObject = object;
  keys.forEach((key) => {
    if (
      typeof convertedObject[key] !== 'undefined' &&
      typeof convertedObject[key] === 'string' &&
      moment(convertedObject[key]).isValid()
    )
      convertedObject[key] = moment(convertedObject[key]).toDate();
  });
  return convertedObject;
};
