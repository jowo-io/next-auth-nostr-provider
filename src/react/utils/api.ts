import { hardConfig } from "../../main/config/hard.js";

export const pollApiRequest = (function () {
  var networkRequestCount: number = 0;

  return async function (k1: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(hardConfig.apis.poll, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ k1 }),
        cache: "default",
      })
        .then(function (r) {
          return r.json();
        })
        .catch((e: any) => {
          networkRequestCount++;
          if (networkRequestCount >= 3) {
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

export async function createApiRequest(state: string): Promise<any> {
  const searchParams = new URLSearchParams({ state });
  return new Promise((resolve, reject) => {
    fetch(`${hardConfig.apis.create}?${searchParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "default",
    })
      .then(function (r) {
        return r.json();
      })
      .then((d) => {
        if (d.message) throw new Error(d.message);
        resolve(d);
      })
      .catch(function (e) {
        reject(e);
      });
  });
}
