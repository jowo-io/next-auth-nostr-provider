import { HardConfig } from "../config/index.js";

export const vanilla = function ({
  hardConfig,
  query,
}: {
  hardConfig: HardConfig;
  query: { redirectUri: string; state: string };
}) {
  let data: any;

  function poll() {
    if (!data || !data.k1) return;

    return fetch(hardConfig.apis.poll, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ k1: data.k1 }),
      cache: "default",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (d) {
        if (d.success) {
          let url = new URL(query.redirectUri);
          url.searchParams.append("state", query.state);
          url.searchParams.append("code", data.k1);
          window.location.replace(url);
        }
      });
  }

  function create() {
    const params = new URLSearchParams({
      state: query.state,
    });

    return fetch(`${hardConfig.apis.create}?${params.toString()}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (d) {
        data = d;

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
        }

        // inject button href
        var button = document.getElementById(
          hardConfig.ids.button
        ) as HTMLAnchorElement;
        if (button) {
          button.href = `lightning:${data.lnurl}`;
        }
      });
  }

  setInterval(poll, hardConfig.intervals.poll);
  setInterval(create, hardConfig.intervals.create);
  create(); // immediately invoke it so the QR gets created
};
