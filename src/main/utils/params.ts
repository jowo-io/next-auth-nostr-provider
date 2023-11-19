export function paramsToObject(searchParams: URLSearchParams) {
  const entries = searchParams.entries();
  const result: Record<string, any> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}
