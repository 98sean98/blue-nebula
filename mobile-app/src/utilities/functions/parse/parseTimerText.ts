export const parseTimerText = (value: number): string => {
  const roundedValue = Math.round(value);
  return roundedValue < 10 ? `0${roundedValue}` : roundedValue.toString();
};
