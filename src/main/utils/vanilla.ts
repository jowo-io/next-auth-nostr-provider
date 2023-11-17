import { HardConfig } from "../config/index.js";

export const vanilla = function ({
  hardConfig,
  query,
  errorUrl,
}: {
  hardConfig: HardConfig;
  query: { redirectUri: string; state: string };
  errorUrl: string;
}) {
  var data: { k1?: string; lnurl?: string } | null;
  var pollTimeoutId: NodeJS.Timeout | undefined;
  var createIntervalId: NodeJS.Timeout | undefined;
  var networkRequestCount: number = 0;

  // cleanup when the hook unmounts of polling is successful
  function cleanup() {
    clearTimeout(pollTimeoutId);
    clearInterval(createIntervalId);
  }

  // redirect user to error page if something goes wrong
  function error(e: any) {
    const url = new URL(errorUrl);
    url.searchParams.append("error", "OAuthSignin");
    if (e && e.message) url.searchParams.append("message", e.message);
    window.location.replace(url);
  }

  // poll the api to see if successful login has occurred
  function poll() {
    if (!data || !data.k1) return;
    const k1 = data.k1;

    return fetch(hardConfig.apis.poll, {
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
      .catch(function (e: any) {
        networkRequestCount++;
        if (networkRequestCount >= 3) {
          pollTimeoutId = setTimeout(poll, hardConfig.intervals.poll);
          throw e;
        }
      })
      .then(function (d) {
        if (d) networkRequestCount = 0;
        if (d && d.message) throw new Error(d.message);
        pollTimeoutId = setTimeout(poll, hardConfig.intervals.poll);

        if (d && d.success) {
          cleanup();
          let url = new URL(query.redirectUri);
          url.searchParams.append("state", query.state);
          url.searchParams.append("code", k1);
          window.location.replace(url);
        }
      })
      .catch(error);
  }

  // create a new lnurl and inject content into dom
  function create() {
    const params = new URLSearchParams({
      state: query.state,
    });

    return fetch(`http://localhost:3000/api/lnauth/create?${params.toString()}`)
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d && d.message) throw new Error(d.message);
        data = d;
        if (!data || !data.lnurl) return;

        // show wrapper
        var wrapper = document.getElementById(hardConfig.ids.wrapper);
        if (wrapper) {
          wrapper.style.display = "block";
        }

        // hide loader
        var loading = document.getElementById(hardConfig.ids.loading);
        if (loading) {
          loading.style.display = "none";
        }

        // inject copy text
        var copy = document.getElementById(hardConfig.ids.copy);
        if (copy) {
          copy.innerHTML = data.lnurl;
        }

        // inject qr src
        var qr = document.getElementById(hardConfig.ids.qr) as HTMLImageElement;
        if (qr) {
          qr.src = hardConfig.apis.qr + "/" + data.lnurl + ".svg";
          qr.onerror = error.bind(
            undefined,
            new Error("Failed to load QR code")
          );
        }

        // inject button href
        var button = document.getElementById(
          hardConfig.ids.button
        ) as HTMLAnchorElement;
        if (button) {
          button.href = `lightning:${data.lnurl}`;
        }
      })
      .catch(error);
  }

  // setup intervals and create first qr code
  pollTimeoutId = setTimeout(poll, hardConfig.intervals.poll);
  createIntervalId = setInterval(create, hardConfig.intervals.create);
  create();
};
