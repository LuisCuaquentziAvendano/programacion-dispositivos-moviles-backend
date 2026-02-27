export function someFieldContainsQuery(
  fields: string[],
  query: string,
): Record<string, Record<string, Record<string, string>>[]> {
  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: query,
        mode: 'insensitive',
      },
    })),
  };
}
