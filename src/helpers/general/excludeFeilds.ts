export function excludeFields<T extends Record<string, any>>(
  data: T | T[],
  fields: string[]
): T | T[] {
  if (Array.isArray(data)) {
    return data.map((item) => {
      fields.forEach((field) => {
        delete item[field];
      });
      return item;
    });
  } else {
    fields.forEach((field) => {
      delete data[field];
    });
    return data;
  }
}
