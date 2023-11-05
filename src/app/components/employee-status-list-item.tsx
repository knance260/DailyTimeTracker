'use client';

import { useEffect, useMemo, useState } from 'react';
import { PersonelData } from '../models/personel-data';
import excelTimeToTimeString from '../utils/getLocalTime';
import { statusColorMap } from '../models/status';
import { getElapsedTime } from '../utils/getElapsedTime';

export function EmployeeStatusListItem({
  personelData,
  currentTime,
}: {
  personelData: PersonelData;

  currentTime: Date;
}) {
  const inTime: string = excelTimeToTimeString(personelData.J);
  const outTime: string =
    personelData.L != undefined ? excelTimeToTimeString(personelData.L) : '--';

  const today = useMemo(
    () => new Date((personelData.C - (25567 + 1)) * 86400 * 1000),
    [personelData.C]
  );
  const [timeElapsed, setTimeElapsed] = useState<string>();
  const [statusColor, setStatusColor] = useState<string>();

  useEffect(() => {
    const { duration, elapsedTimeString } = getElapsedTime(
      inTime,
      today,
      currentTime
    );
    const { hours } = duration;
    if (hours == null || hours < 8) {
      setStatusColor(statusColorMap['GOOD']);
    } else if (hours >= 8 && hours <= 11) {
      setStatusColor(statusColorMap['WARNING']);
    } else if (hours > 11) {
      setStatusColor(statusColorMap['RISK']);
    }
    setTimeElapsed(elapsedTimeString);
  }, [inTime, personelData.C, timeElapsed, today, currentTime]);

  return (
    <>
      <li className="flex justify-between gap-x-6 py-5">
        <div className="flex min-w-0 gap-x-4">
          <div className="mt-1 flex items-center gap-x-1.5">
            <div className={`flex-none rounded-full ${statusColor}/20 p-1`}>
              <div
                className={`h-6 w-6 rounded-full  ${statusColor}
                `}
              ></div>
            </div>
          </div>
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              {personelData.A}
            </p>
            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
              {timeElapsed}
            </p>
          </div>
        </div>
        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-900">{inTime}</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">{outTime}</p>
        </div>
      </li>
    </>
  );
}
