'use client';

import { useState } from 'react';
import { PersonelData } from '../models/personel-data';
import { EmployeeStatusListItem } from './employee-status-list-item';

export default function PersonelStatusList({
  activeList,
  currentTime,
}: {
  activeList: PersonelData[];
  currentTime: Date;
}) {
  const [stopTimes, setStoppedTimes] = useState<Map<string, Date>>(new Map());

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100 ">
        {activeList.map((personel) => (
          <EmployeeStatusListItem
            key={personel.A}
            personelData={personel}
            currentTime={stopTimes.get(personel.B) ?? currentTime}
            isStopped={stopTimes.has(personel.B)}
            stopTimer={() => {
              const updatedSet = stopTimes.set(personel.B, new Date());
              setStoppedTimes(updatedSet);
            }}
          ></EmployeeStatusListItem>
        ))}
      </ul>
    </>
  );
}
