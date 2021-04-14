import * as moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

export const getDurationMoment = (): typeof moment => {
  momentDurationFormatSetup(moment);
  return moment;
};
