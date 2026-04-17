export type BaseResultState<T = any> = {
  data: T[];
  total: number;
  loading: boolean;
  selected: T | null;
  flag: string|null;
};