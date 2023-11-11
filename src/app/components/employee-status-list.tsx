'use client';

import { useState } from 'react';
import { PersonelData } from '../models/personel-data';
import { EmployeeStatusListItem } from './employee-status-list-item';

export default function PersonelStatusList({
  activeList,
  currentTime,
  startIndex,
}: {
  activeList: PersonelData[];
  currentTime: Date;
  startIndex: number;
}) {
  const [stopTimes, setStoppedTimes] = useState<Map<number, Date>>(new Map());

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100 ">
        {activeList.map((personel, index) => (
          <EmployeeStatusListItem
            key={personel.A}
            personelData={personel}
            currentTime={stopTimes.get(startIndex + index) ?? currentTime}
            isStopped={stopTimes.has(startIndex + index)}
            stopTimer={() => {
              const updatedSet = stopTimes.set(startIndex + index, new Date());
              setStoppedTimes(updatedSet);
            }}
          ></EmployeeStatusListItem>
        ))}
      </ul>
    </>
  );
}
