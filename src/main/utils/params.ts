export function pickFirstQueryParam(
  queryParam: string | string[] | undefined | null
): string | number {
  if (Array.isArray(queryParam)) {
    return queryParam[0] || "";
  }
  return queryParam || "";
}

export function paramsToObject(params?: URLSearchParams) {
  if (!params) return {};

  const entries = params.entries();
  const result: Record<string, string | number> = {};
  for (const [key, value] of entries) {
    result[key] = pickFirstQueryParam(value);
  }
  return result;
}

export function cleanParams(
  params?: Record<string, string | string[] | undefined | null>
): Record<string, string | undefined> {
  if (!params) return {};

  return Object.entries(params).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: pickFirstQueryParam(value),
    }),
    {}
  );
}
