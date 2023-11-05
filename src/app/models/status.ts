export enum EmployeeStatus {
  GOOD,
  WARNING,
  RISK,
}

export const statusColorMap: Record<
  EmployeeStatus,
  { light: string; dark: string }
> = {
  [EmployeeStatus.GOOD]: { light: 'bg-green-500/20', dark: 'bg-green-500' },
  [EmployeeStatus.WARNING]: {
    light: 'bg-yellow-300/20',
    dark: 'bg-yellow-300',
  },
  [EmployeeStatus.RISK]: { light: 'bg-red-600/20', dark: 'bg-red-600' },
};
