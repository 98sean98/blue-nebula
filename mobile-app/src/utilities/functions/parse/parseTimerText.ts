export const parseTimerText = (value: number): string => {
  const roundedValue = Math.floor(value);
  return roundedValue < 10 ? `0${roundedValue}` : roundedValue.toString();
};
