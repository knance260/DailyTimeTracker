'use client';

import { useEffect, useMemo, useState } from 'react';
import { PersonelData } from '../models/personel-data';
import excelTimeToTimeString from '../utils/getLocalTime';
import { EmployeeStatus, statusColorMap } from '../models/status';
import { getElapsedTime, getTimeWorked } from '../utils/getElapsedTime';
import { duration } from 'moment';

export function EmployeeStatusListItem({
  personelData,
  currentTime,
}: {
  personelData: PersonelData;

  currentTime: Date;
}) {
  const inTime: string = excelTimeToTimeString(personelData.K);
  const outTime: string | undefined = personelData.L
    ? excelTimeToTimeString(personelData.L)
    : undefined;
  console.log(inTime);
  const today = useMemo(
    () => new Date((personelData.C - (25567 + 1)) * 86400 * 1000),
    [personelData.C]
  );
  const [timeElapsed, setTimeElapsed] = useState<string>();
  const [status, setStatus] = useState<EmployeeStatus | undefined>();
  const isClockedOut = outTime !== undefined;

  useEffect(() => {
    if (!isClockedOut) {
      const { duration, elapsedTimeString } = getElapsedTime(
        inTime,
        today,
        currentTime
      );
      const hours = duration.hours ?? 0;

      if (hours <= 8) {
        setStatus(EmployeeStatus.GOOD);
      } else if (hours >= 8 && hours <= 11) {
        setStatus(EmployeeStatus.WARNING);
      } else if (hours > 11) {
        setStatus(EmployeeStatus.RISK);
      }
      setTimeElapsed(elapsedTimeString);
    }
  }, [currentTime, inTime, today, isClockedOut]);

  useEffect(() => {
    if (isClockedOut) {
      const { duration, elapsedTimeString } = getTimeWorked(
        inTime,
        today,
        outTime
      );
      const hours = duration.hours ?? 0;

      if (hours < 8) {
        setStatus(EmployeeStatus.GOOD);
      } else if (hours >= 8 && hours <= 11) {
        setStatus(EmployeeStatus.WARNING);
      } else if (hours > 11) {
        setStatus(EmployeeStatus.RISK);
      }
      setTimeElapsed(elapsedTimeString);
    }
  }, [today, isClockedOut, inTime, outTime]);

  return (
    <>
      <li
        className={`flex justify-between gap-x-6 py-5 ${
          isClockedOut ? 'bg-gray-100' : ''
        }`}
      >
        <div className="flex min-w-0 gap-x-4">
          <div className="mt-1 flex items-center gap-x-6">
            <div
              className={`flex-none rounded-full ${
                status != null ? statusColorMap[status].light : ''
              } p-1`}
            >
              <div
                className={`h-6 w-6 rounded-full  ${
                  status != null ? statusColorMap[status].dark : ''
                }
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
          <p className="text-sm leading-6 text-gray-900">
            Time-in: <time className="font-bold">{inTime} </time>
          </p>
          {outTime != null && (
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Time-out: <time className="font-bold">{outTime} </time>
            </p>
          )}
        </div>
      </li>
    </>
  );
}
