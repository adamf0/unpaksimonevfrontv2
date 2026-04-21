export type ScheduleItem = {
  id: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdByRef?: string;
  canDelete: boolean;
  isExtend: boolean;
};