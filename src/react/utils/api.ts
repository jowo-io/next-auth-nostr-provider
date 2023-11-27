import { hardConfig } from "../../main/config/hard";

const maxNetworkRequestsFailures = 3;

export const pollApiRequest = (function () {
  var networkRequestCount: number = 0;

  return async function (
    { k1 }: { k1: string },
    signal?: AbortSignal
  ): Promise<any> {
    const params = new URLSearchParams({ k1 });

    return new Promise((resolve, reject) => {
      fetch(hardConfig.apis.poll, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: params,
        cache: "default",
        signal,
      })
        .then(function (r) {
          if (r.status === 404) {
            // if resource not found throw error immediately
            networkRequestCount = maxNetworkRequestsFailures;
          }
          return r.json();
        })
        .catch((e: any) => {
          networkRequestCount++;
          if (networkRequestCount >= maxNetworkRequestsFailures) {
            throw e;
          }
        })
        .then(function (d) {
          if (d) {
            if (d.message) throw new Error(d.message);
            networkRequestCount = 0;
            resolve(d);
          } else {
            resolve({ success: false });
          }
        })
        .catch(function (e) {
          reject(e);
        });
    });
  };
})();

export async function createApiRequest(
  { state, k1 }: { state: string; k1?: string },
  signal?: AbortSignal
): Promise<any> {
  const params = new URLSearchParams({ state });
  if (k1) {
    params.append("k1", k1);
  }

  return new Promise((resolve, reject) => {
    fetch(hardConfig.apis.create, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params,
      cache: "default",
      signal,
    })
      .then(function (r) {
        return r.json();
      })
      .then((data) => {
        if (data.message) throw new Error(data.message);
        resolve(data);
      })
      .catch(function (e) {
        reject(e);
      });
  });
}
