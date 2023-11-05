import { ChangeEventHandler, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SelectMenu<
  T extends string | number | readonly string[] | undefined
>({
  selectedValue,
  options,
  label,
  onSelect,
}: {
  selectedValue: T;
  options: T[];
  onSelect: ChangeEventHandler<HTMLSelectElement>;
  label: string;
}) {
  return (
    <>
      <div className="flex flex-col items-center mr-5">
        <label htmlFor={label} className="text-center font-bold">
          {label}
        </label>
        <select
          id={label}
          defaultValue={selectedValue}
          className="py-3 px-4 block  border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 light:bg-slate-900 dark:border-gray-700 light:text-gray-400"
          onChange={onSelect}
        >
          {options.map((option: T, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
      </div>
    </>
  );
}
