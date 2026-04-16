import { isEmpty } from "../Service/utility";

export class FilterBuilder<T extends Record<string, any>> {
  private rules: {
    key: keyof T;
    field: string;
    op?: string;
    transform?: (val: any) => any;
    skip?: boolean;
  }[] = [];

  add(
    key: keyof T,
    field: string,
    op: string = "eq",
    transform?: (val: any) => any,
    skip: boolean = false
  ) {
    this.rules.push({ key, field, op, transform, skip });
    return this;
  }

  isFilled(value: any): boolean {
    return !isEmpty(value);
  }

  build(query: T): string {
    return this.rules
      .filter((r) => this.isFilled(query[r.key]))
      .map((r) => {
        const raw = query[r.key];
        const value = r.transform ? r.transform(raw) : raw;
        return `${r.field}:${r.op}:${value}`;
      })
      .join(";");
  }

  countFilled(query: T): number {
    return this.rules.filter(
      (r) => !r.skip && this.isFilled(query[r.key])
    ).length;
  }
}
