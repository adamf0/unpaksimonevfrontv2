import { SelectOption } from "../Attribut/SelectOption";

export function adaptSelectOptionsMerge<T>(
  data: T[],
  config: {
    valueKey: keyof T;
    labelKeys: (keyof T)[];
    template?: string;
  }
): SelectOption[] {
  const map = new Map<string, SelectOption>();

  data.forEach((item) => {
    const value = String(item[config.valueKey] ?? "");

    if (!value) return;

    const labels = config.labelKeys.map((key) =>
      String(item[key] ?? "")
    );

    let label = "";

    // default join
    if (!config.template) {
      label = labels.join(" ");
    } else {
      // replace %s sequentially
      let i = 0;
      label = config.template.replace(/%s/g, () => labels[i++] ?? "");
    }

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