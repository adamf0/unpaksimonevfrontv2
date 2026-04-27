import { SelectOption } from "../Attribut/SelectOption";

export function adaptSelectOptions<T>(
  data: T[],
  config: {
    valueKey: keyof T;
    labelKey: keyof T;
  }
): SelectOption[] {
  const map = new Map<string, SelectOption>();

  data.forEach((item) => {
    const value = String(item[config.valueKey] ?? "");
    const label = String(item[config.labelKey] ?? "");

    if (!value) return;

    if (!map.has(value)) {
      map.set(value, {
        value,
        label,
        payload: item,
      });
    }
  });

  return Array.from(map.values());
}