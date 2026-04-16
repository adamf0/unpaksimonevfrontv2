import { DateTimeVO } from "../Domain/DateTimeVO";
import { isEmpty } from "../Service/utility";

export type RangeStatus =
  | "TIME_RANGE_INVALID"
  | "SCHEDULED"
  | "ACTIVE"
  | "EXPIRED";

export class DateRangeService {
  constructor(
    private readonly start: DateTimeVO,
    private readonly end: DateTimeVO,
  ) {}

  getStatus(now: DateTimeVO): RangeStatus {
    const start = this.start.toDate();
    const end = this.end.toDate();
    const current = now.toDate();

    if (!start || !end || !current || end < start) {
      return "TIME_RANGE_INVALID";
    }

    if (current < start) {
      return "SCHEDULED";
    }

    if (current <= end) {
      return "ACTIVE";
    }

    return "EXPIRED";
  }
}
