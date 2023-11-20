export function paramsToObject(params: URLSearchParams) {
  const entries = params.entries();
  const result: Record<string, any> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}
