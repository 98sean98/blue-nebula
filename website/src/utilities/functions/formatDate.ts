import moment from 'moment';

export const formatDate = (date: Date | string): string => {
  if (moment(date).isValid())
    return moment(date).format('DD/MM/YYYY h:mm:ss a');
  return '';
};
