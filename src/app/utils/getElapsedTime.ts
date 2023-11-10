import { Duration } from 'date-fns';

export function getElapsedTime(
  starTime: Date,
  currentTime: Date
): { elapsedTimeString: string; duration: Duration } {
  const inDateTime = new Date(starTime);

  const secondsDiff = (currentTime.getTime() - inDateTime.getTime()) / 1000;
  const hoursDiff = Math.floor(secondsDiff / 3600);
  const minutesDiff = Math.floor(secondsDiff / 60) % 60;

  return {
    duration: { hours: hoursDiff, minutes: minutesDiff, seconds: secondsDiff },
    elapsedTimeString: `${hoursDiff == null ? 0 : hoursDiff} hour${
      hoursDiff != 1 ? 's' : ''
    } ${minutesDiff == null ? 0 : minutesDiff % 60} minute${
      minutesDiff != 1 ? 's' : ''
    } ${secondsDiff == null ? 0 : Math.floor(secondsDiff % 60)} second${
      secondsDiff != 1 ? 's' : ''
    }`,
  };
}

export function getTimeWorked(
  starTime: string,
  today: Date,
  endTime: string
): { elapsedTimeString: string; duration: Duration } {
  const inYear = today.getFullYear();
  const inMonth = today.getMonth();
  const inDay = today.getDate();
  const [hourIn, minuteIn] = starTime.split(':');
  const inDateTime = new Date(
    inYear,
    inMonth,
    inDay,
    parseInt(hourIn),
    parseInt(minuteIn)
  );

  const [hourOut, minuteOut] = endTime.split(':');
  const outDateTime = new Date(
    inYear,
    inMonth,
    inDay,
    parseInt(hourOut),
    parseInt(minuteOut)
  );

  const secondsDiff = (outDateTime.getTime() - inDateTime.getTime()) / 1000;
  const hoursDiff = Math.floor(secondsDiff / 3600);
  const minutesDiff = Math.floor(secondsDiff / 60);

  return {
    duration: { hours: hoursDiff, minutes: minutesDiff, seconds: secondsDiff },
    elapsedTimeString: `${hoursDiff == null ? 0 : hoursDiff} hour${
      hoursDiff != 1 ? 's' : ''
    } ${minutesDiff == null ? 0 : minutesDiff % 60} minute${
      minutesDiff != 1 ? 's' : ''
    } ${secondsDiff == null ? 0 : Math.floor(secondsDiff % 60)} second${
      secondsDiff != 1 ? 's' : ''
    }`,
  };
}
