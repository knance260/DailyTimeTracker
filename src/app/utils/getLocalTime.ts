export default function excelTimeToTimeString(excelDate: number) {
  const jsDate = new Date(
    1970,
    0,
    1,
    0,
    0,
    (excelDate - (25567 + 1)) * 86400 * 1000
  );
  console.log(excelDate, jsDate);

  // Format the JavaScript Date as a time string with AM/PM
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
  };
  console.log();
  return jsDate.toLocaleTimeString('en-US', options);
}
