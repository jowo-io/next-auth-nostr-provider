import { renderToStaticMarkup } from "preact-render-to-string";

import { hardConfig, Config } from "../config/index.js";
import { vanilla } from "../utils/vanilla.js";

import { LightningAuth } from "../../react/components/LightningAuth.js";
import { Loading } from "../../react/components/Loading.js";
import { HandlerArguments, HandlerReturn } from "../utils/handlers.js";
import {
  signInValidation,
  errorMap,
  formatErrorMessage,
} from "../validation/lnauth.js";

function LightningAuthPage({ config }: { config: Config }) {
  return (
    <body
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        boxSizing: "border-box",
        margin: 0,
        padding: 20,

        fontFamily: `ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji`,

        background: config.theme.background,
        color: config.theme.text,
      }}
    >
      <div>
        {/* loading component is rendered and shown initially, before window.onload is triggered */}
        <Loading
          style={{
            width: "36px",
            height: "36px",
            border: `4px solid ${config.theme.backgroundCard}`,
            borderBottomColor: config.theme.text,
            borderRadius: "50%",
            display: "inline-block",
            boxSizing: "border-box",
            animation: `${hardConfig.ids.loading}-rotation 1s linear infinite`,
            // NOTE: further styles are defined below within the <style> tag
          }}
        />

        {/* auth component is rendered with display: none, after window.onload is triggered */}
        <LightningAuth
          title={config.title}
          lnurl=""
          theme={{
            wrapper: {
              display: "none", // initially hidden
              textAlign: "center",
              maxWidth: 400,
              background: config.theme.backgroundCard,
              color: config.theme.text,
              padding: "20px 30px",
              borderRadius: 20,
            },
            title: {
              fontSize: 25,
              color: config.theme.text,
              marginTop: 0,
              marginBottom: 15,
            },
            qr: {
              display: "block",
              overflow: "hidden",
              borderRadius: 5,
              width: "100%",
              height: "auto",
            },
            copy: {
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              userSelect: "all",
              marginTop: 10,
              marginBottom: 10,
            },
            button: {
              alignItems: "center",
              backgroundColor: config.theme.background,
              textDecoration: "none",
              border: `2px solid rgba(110, 110, 110, 0.3)`,
              borderRadius: 10,
              color: config.theme.text,
              display: "flex",
              fontSize: "1.1rem",
              fontWeight: "500",
              justifyContent: "center",
              minHeight: "30px",
              padding: ".75rem 1rem",
              position: "relative",
            },
          }}
        />
      </div>
    </body>
  );
}

export default async function handler({
  query,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  try {
    try {
      signInValidation.parse(query, { errorMap });
    } catch (e: any) {
      return { error: formatErrorMessage(e), isRedirect: true };
    }

    if (cookies.sessionToken) {
      return { error: "You are already logged in", isRedirect: true };
    }

    // if a custom auth page is specified, send them there if they try and access this API
    if (config.pages.signIn !== config.apis.signIn) {
      const params = url.searchParams.toString();
      return {
        redirect: new URL(`${config.siteUrl}${config.pages.signIn}?${params}`),
      };
    }

    const title = config.title || config.siteUrl;
    const errorUrl = config.siteUrl + config.pages.error;
    const html = renderToStaticMarkup(<LightningAuthPage config={config} />);

    return {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
      response: `<!DOCTYPE html><html lang="en">
    <head>
      <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        #${hardConfig.ids.loading} span {
          display: none;
        }
        @keyframes ${hardConfig.ids.loading}-rotation {
          0% {
              transform: rotate(0deg);
          }
          100% {
              transform: rotate(360deg);
          }
        } 
      </style>
    </head>
    ${html}

    <script>
      var init = ${vanilla.toString()};
      window.onload = function(){
        init(${JSON.stringify({ hardConfig, query, errorUrl })})
      };
    </script>
    </html>`,
    };
  } catch (e: any) {
    return { error: e.message || "Something went wrong", isRedirect: true };
  }
}
