'use client';

import React, { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { utils, read } from 'xlsx';

import PersonelStatusList from './components/employee-status-list';
import FileInput from './components/file-input';
import SelectMenu from './components/drop-down';
import { itemsPerPage } from './constants/itemsPerPage';
import { SortOptions, sortOptions } from './constants/sortOptions';
import { PersonelData } from './models/personel-data';

export default function Home() {
  const [personelList, setPersonelData] = useState<PersonelData[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date(Date.now()));
  new Set<number>();

  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pages, setPages] = useState<number[]>([]);
  const [perPage, setResultsPerPage] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(perPage * (activePage - 1));
  const [activeList, setCurrentList] = useState(personelList);
  const [sort, setSort] = useState<string>(sortOptions['time-In']);

  const process = (ab: ArrayBuffer) => {
    try {
      const data = read(ab, { type: 'array', cellDates: true });
      const firstSheet = data.Sheets[data.SheetNames[0]];

      let dataList = utils
        .sheet_to_json<PersonelData>(firstSheet, {
          header: 'A',
        })
        .slice(5)
        .map((item): PersonelData => {
          return {
            A: item.A,
            D: item.D,
            F: item.F,
            J: item.J,
            L: item.L,
          };
        })
        .filter((entry: PersonelData) => {
          return (
            entry.D != 'Exempt' &&
            entry.D != 'exempt' &&
            (entry.F == '0000-210' || entry.F == '0000-220')
          );
        })
        .sort(
          (a: PersonelData, b: PersonelData) => a.J.getTime() - b.J.getTime()
        );

      setPersonelData(dataList);
    } catch (error) {
      alert(
        'There was a problem importing the file. The data should start on line 5 and have the following data. Employee name in column A, the Date in column C, ActualIn time (or desired time to track) in column J, and the ActualOut (or desired out time to track) in column L.'
      );
    }
  };

  useEffect(() => {
    const sortedList = personelList.sort((a: PersonelData, b: PersonelData) => {
      if (sort == sortOptions['time-In']) {
        return a.J.getTime() - b.J.getTime();
      } else {
        return a.A.localeCompare(b.A);
      }
    });

    setPersonelData(sortedList);
  }, [sort, personelList]);

  useEffect(() => {
    const startIndex = perPage * (activePage - 1);
    const calculatedEnd = startIndex + perPage;
    const lastItemIndex =
      calculatedEnd <= personelList.length - 1 ? calculatedEnd : undefined;
    const newList = personelList.slice(startIndex, lastItemIndex);
    setCurrentList(newList);
    setStartIndex(startIndex);
    setEndIndex(lastItemIndex ?? personelList.length);
  }, [activePage, perPage, personelList, sort]);

  useEffect(() => {
    const maxPages = Math.ceil(personelList.length / perPage);
    const pageList = new Array(maxPages).fill(0).map((_, index) => index + 1);
    setTotalPages(maxPages);
    setPages(pageList);
  }, [personelList, perPage]);

  useEffect(() => {
    function setTime() {
      setCurrentTime(new Date(Date.now()));
      return setTime;
    }

    const interval = setInterval(setTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center text-3xl mt-12" suppressHydrationWarning>
        {currentTime.toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })}
      </div>
      <FileInput process={process} />
      {activeList.length ? (
        <>
          <div className="flex justify-end">
            <SelectMenu
              label="Sort by"
              selectedValue={sort}
              options={[sortOptions.name, sortOptions['time-In']]}
              onSelect={(event: ChangeEvent<HTMLSelectElement>) => {
                setSort(sortOptions[event.target.value as keyof SortOptions]);
              }}
            />
            <SelectMenu
              label="Items per page"
              selectedValue={perPage}
              options={itemsPerPage}
              onSelect={(event: ChangeEvent<HTMLSelectElement>) => {
                setResultsPerPage(parseInt(event.target.value));
              }}
            />
          </div>
          <PersonelStatusList
            activeList={activeList}
            currentTime={currentTime}
            startIndex={startIndex}
          ></PersonelStatusList>

          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{' '}
                  to <span className="font-medium">{endIndex}</span> of{' '}
                  <span className="font-medium">{personelList.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    disabled={activePage == 1}
                    onClick={() => setPage(activePage - 1)}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                  {pages.map((value) => (
                    <button
                      aria-current={activePage == value}
                      type="button"
                      key={value}
                      onClick={() => setPage(value)}
                      className={
                        activePage == value
                          ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }
                    >
                      {value}
                    </button>
                  ))}

                  <button
                    disabled={activePage == totalPages}
                    onClick={() => setPage(activePage + 1)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
