import { renderToStaticMarkup } from "preact-render-to-string";
import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest, NextResponse } from "next/server";

import { hardConfig, Config } from "../config/index.js";
import { vanilla } from "../utils/vanilla.js";

import { LnAuthLogin } from "../../react/components/LnAuthLogin.js";
import { Loading } from "../../react/components/Loading.js";
import { formatRouter } from "../utils/router.js";

function AuthPage({ config }: { config: Config }) {
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

        {/* login component is rendered with display: none, after window.onload is triggered */}
        <LnAuthLogin
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

async function logic(
  query: Record<string, any>,
  req: NextApiRequest | NextRequest,
  config: Config
) {
  const title = config.title || config.siteUrl;
  const errorUrl = config.siteUrl + config.pages.error;

  const html = renderToStaticMarkup(<AuthPage config={config} />);

  if (!query.redirectUri || !query.state) {
    throw new Error("Missing required query param");
  }

  return `<!DOCTYPE html><html lang="en">
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
    </html>`;
}

async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  if (req.cookies["next-auth.session-token"]) {
    throw new Error("You are already logged in");
  }

  const query = {
    redirectUri: req.query.redirect_uri,
    state: req.query.state,
  };
  const result = await logic(query, req, config);

  res.setHeader("content-type", "text/html");
  res.send(result);
}

async function appHandler(req: NextRequest, config: Config) {
  if (req.cookies.get("next-auth.session-token")?.value) {
    throw new Error("You are already logged in");
  }

  const query = {
    redirectUri: req.nextUrl.searchParams.get("redirect_uri"),
    state: req.nextUrl.searchParams.get("state"),
  };
  const result = await logic(query, req, config);

  return new Response(result, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}

export default async function handler(
  request: NextApiRequest | NextRequest,
  response: NextApiResponse | NextResponse,
  config: Config
) {
  const { req, res, routerType } = formatRouter(request, response);

  if (routerType === "APP") {
    return await appHandler(req, config);
  }
  return await pagesHandler(req, res, config);
}
