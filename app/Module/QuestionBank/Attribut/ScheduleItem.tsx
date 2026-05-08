export type ScheduleItem = {
  id: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdByRef?: string;
  NamaFakultas: string;
  NamaProdi: string;
  Role: string;
  canDelete: boolean;
  isExtend: boolean;
};