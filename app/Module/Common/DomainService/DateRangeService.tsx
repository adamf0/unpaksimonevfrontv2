import { DateTimeVO } from "../Domain/DateTimeVO";
import { isEmpty } from "../Service/utility";

export type RangeStatus =
  | "TIME_RANGE_INVALID"
  | "SCHEDULED"
  | "ACTIVE"
  | "EXPIRED"
  | null;

export class DateRangeService {
  constructor(
    private readonly start: DateTimeVO,
    private readonly end: DateTimeVO,
    private readonly listext: any[],
  ) {}

  getStatus(now: DateTimeVO): RangeStatus {
    const start = this.start.toDate();
    const end = this.end.toDate();
    const current = now.toDate();

    if(isEmpty(start?.toISOString()) || isEmpty(end?.toISOString())){
      return null;
    }

    if (!start || !end || !current || end < start) {
      return "TIME_RANGE_INVALID";
    }

    if (current < start) {
      return "SCHEDULED";
    }

    if (current <= end || this.listext.length>0) {
      return "ACTIVE";
    }

    return "EXPIRED";
  }
}
