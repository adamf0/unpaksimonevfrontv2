export const isEmpty = (value: string| any[] | number | null | undefined) => {
  if (value === null || value === undefined) return true;

  if (value === "00000000-0000-0000-0000-000000000000") {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (typeof value === "number") {
    return value <= 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
};