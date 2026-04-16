export class DateTimeVO {
  private readonly value: Date | null;

  constructor(input?: string | Date | null) {
    if (!input) {
      this.value = null;
      return;
    }

    const parsed = new Date(input);

    // invalid date guard
    if (isNaN(parsed.getTime())) {
      this.value = null;
      return;
    }

    this.value = parsed;
  }

  static create(input?: string | Date | null) {
    return new DateTimeVO(input);
  }
  
  // helper: is valid
  isValid(): boolean {
    return this.value !== null;
  }

  // raw JS Date
  toDate(): Date | null {
    return this.value;
  }

  // ISO string
  toISOString(): string | null {
    return this.value ? this.value.toISOString() : null;
  }

  // format sederhana (Indonesia style)
  toDateString(): string {
    if (!this.value) return "-";

    return this.value.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }

  // format full datetime
  toDateTimeString(): string {
    if (!this.value) return "-";

    return this.value.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // helper: is past
  isPast(): boolean {
    if (!this.value) return false;
    return this.value.getTime() < Date.now();
  }

  // helper: is future
  isFuture(): boolean {
    if (!this.value) return false;
    return this.value.getTime() > Date.now();
  }

  // raw value
  valueOf(): number | null {
    return this.value ? this.value.getTime() : null;
  }
}