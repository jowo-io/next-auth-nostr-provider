import { NextApiRequest, NextApiResponse } from "next/types";
import { OAuthConfig } from "next-auth/providers/oauth";

// auth apis
import createHandler from "./handlers/create.js";
import pingHandler from "./handlers/ping.js";
import callbackHandler from "./handlers/callback.js";
import tokenHandler from "./handlers/token.js";

// pages
import loginHandler from "./handlers/login.js";

// misc
import imageHandler from "./handlers/image.js";
import qrHandler from "./handlers/qr.js";

import { formatConfig, LnurlAuthConfig } from "./config.js";

export type { LnurlAuthConfig };

const base64EncodedLightningSvg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgyIiBoZWlnaHQ9IjI4MiIgdmlld0JveD0iMCAwIDI4MiAyODIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPgo8Y2lyY2xlIGN4PSIxNDAuOTgzIiBjeT0iMTQxLjAwMyIgcj0iMTQxIiBmaWxsPSIjN0IxQUY3Ii8+CjxwYXRoIGQ9Ik03OS43NjA5IDE0NC4wNDdMMTczLjc2MSA2My4wNDY2QzE3Ny44NTcgNjAuNDIzNSAxODEuNzYxIDYzLjA0NjYgMTc5LjI2MSA2Ny41NDY2TDE0OS4yNjEgMTI2LjU0N0gyMDIuNzYxQzIwMi43NjEgMTI2LjU0NyAyMTEuMjYxIDEyNi41NDcgMjAyLjc2MSAxMzMuNTQ3TDExMC4yNjEgMjE1LjA0N0MxMDMuNzYxIDIyMC41NDcgOTkuMjYxIDIxNy41NDcgMTAzLjc2MSAyMDkuMDQ3TDEzMi43NjEgMTUxLjU0N0g3OS43NjA5Qzc5Ljc2MDkgMTUxLjU0NyA3MS4yNjA5IDE1MS41NDcgNzkuNzYwOSAxNDQuMDQ3WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMCI+CjxyZWN0IHdpZHRoPSIyODIiIGhlaWdodD0iMjgyIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";

export default function LnurlAuth(lnurlAuthConfig: LnurlAuthConfig) {
  const config = formatConfig(lnurlAuthConfig);

  const provider: OAuthConfig<any> = {
    id: "lnurl",
    name: "Lightning",
    type: "oauth",
    version: "2.0",
    checks: ["state"],
    issuer: config.siteUrl,
    token: config.siteUrl + config.apis.token,
    authorization: config.siteUrl + config.pages.signIn,
    profile(profile: any) {
      return {
        id: profile.id,
        name: profile.name,
        image: profile.image,
        email: "",
      };
    },
    idToken: true,
    client: {
      id_token_signed_response_alg: "HS256",
    },
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    style: {
      logo: base64EncodedLightningSvg,
      bg: "#24292f", // TODO pull color through from theme
      text: "#fff", // TODO pull color through from theme
    },
  };

  const handler = async function lnurlAuthHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.url?.indexOf(config.apis.create) === 0) {
      return await createHandler(req, res, config);
    } else if (req.url?.indexOf(config.apis.ping) === 0) {
      return await pingHandler(req, res, config);
    } else if (req.url?.indexOf(config.apis.callback) === 0) {
      return await callbackHandler(req, res, config);
    } else if (req.url?.indexOf(config.apis.token) === 0) {
      return await tokenHandler(req, res, config);
    } else if (
      config.pages?.signIn === config.apis.signIn &&
      req.url?.indexOf(config.apis.signIn) === 0
    ) {
      return await loginHandler(req, res, config);
    } else if (req.url?.indexOf(config.apis.image) === 0) {
      return await imageHandler(req, res, config);
    } else if (req.url?.indexOf(config.apis.qr) === 0) {
      return await qrHandler(req, res, config);
    }

    throw new Error("Unknown path");
  };

  return {
    provider,
    handler,
  };
}
