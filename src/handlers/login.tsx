import { renderToStaticMarkup } from "react-dom/server";
import { NextApiRequest, NextApiResponse } from "next/types";

import LnAuthLogin from "../components/LnAuthLogin.js";
import { hardConfig, Config } from "../config/index.js";
import { vanilla } from "../utils/vanilla.js";
import { extractQuery } from "../utils/query.js";
import Loading from "../components/Loading.js";

function AuthPage({ config }: { config: Config }) {
  return (
    <body
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        margin: 0,
        padding: 0,

        fontFamily: `ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji`,

        background: config.theme.background,
        color: config.theme.text,
      }}
    >
      {/* loading component is rendered and shown initially, before window.onload is triggered */}
      <Loading />

      {/* login component is rendered with display: none, after window.onload is triggered */}
      <LnAuthLogin
        title={config.title}
        lnurl=""
        theme={{
          wrapper: {
            display: "none", // initially hidden
            textAlign: "center",
            maxWidth: 500,
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
          input: {
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
            transition: "all .1s ease-in-out",
          },
        }}
      />
    </body>
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  if (req.cookies["next-auth.session-token"]) {
    throw new Error("You are already logged in");
  }

  const title = config.title || config.siteUrl;

  const query = extractQuery(req.query);

  const html = renderToStaticMarkup(<AuthPage config={config} />);

  if (!query.clientId || !query.redirectUri || !query.state) {
    throw new Error("Missing required query param");
  }

  res.setHeader("Content-Type", "text/html");
  res.send(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    ${html}

    <script>
      var init = ${vanilla.toString()};
      window.onload = function(){
        init(${JSON.stringify({ hardConfig, query })})
      };
    </script>
    </html>`
  );
}
