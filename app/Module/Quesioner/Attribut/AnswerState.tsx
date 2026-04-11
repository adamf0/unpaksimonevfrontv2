import { Option } from "./Option";

export type AnswerState = {
  [questionId: string]: {
    value: Option | Option[] | number | null;
    extra?: Record<string, string>;
  };
};