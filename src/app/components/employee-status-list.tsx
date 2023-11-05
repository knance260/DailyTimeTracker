'use client';

import { useEffect, useState } from 'react';
import { PersonelData } from '../models/personel-data';
import { EmployeeStatusListItem } from './employee-status-list-item';

export default function PersonelStatusList({
  activeList,
  currentTime,
}: {
  activeList: PersonelData[];
  currentTime: Date;
}) {
  return (
    <>
      <ul role="list" className="divide-y divide-gray-100 ">
        {activeList.map((personel, index: number) => (
          <EmployeeStatusListItem
            key={index}
            personelData={personel}
            currentTime={currentTime}
          ></EmployeeStatusListItem>
        ))}
      </ul>
    </>
  );
}
