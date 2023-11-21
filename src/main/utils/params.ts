export function pickFirstQueryParam(queryParam: string | string[] | undefined) {
  if (Array.isArray(queryParam)) {
    return queryParam[0];
  }
  return queryParam;
}

export function paramsToObject(params?: URLSearchParams) {
  if (!params) return {};

  const entries = params.entries();
  const result: Record<string, any> = {};
  for (const [key, value] of entries) {
    result[key] = pickFirstQueryParam(value);
  }
  return result;
}

export function cleanParams(
  params?: Record<string, any>
): Record<string, string | boolean | number | undefined | null> {
  if (!params) return {};

  return Object.entries(params).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: pickFirstQueryParam(value),
    }),
    {}
  );
}
