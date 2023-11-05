export default function excelTimeToTimeString(timeDecimal: number) {
  const timeInMilliseconds = timeDecimal * 24 * 60 * 60 * 1000;
  const jsDate = new Date(1970, 0, 1, 0, 0, 0, timeInMilliseconds);

  // Format the JavaScript Date as a time string with AM/PM
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
  };

  return jsDate.toLocaleTimeString('en-US', options);
}
