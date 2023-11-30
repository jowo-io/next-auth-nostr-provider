import { NextApiRequest, NextApiResponse } from "next/types";
import { OAuthConfig } from "next-auth/providers/oauth";

import { formatConfig, UserConfig } from "./config/index";
import { NextRequest, NextResponse } from "next/server";
import { formatRouter } from "./utils/router";
import dynamicHandler from "./utils/handlers";

// auth apis
import createHandler from "./handlers/create";
import pollHandler from "./handlers/poll";
import callbackHandler from "./handlers/callback";
import tokenHandler from "./handlers/token";

// pages
import signInHandler from "./handlers/signin";

// misc
import avatarHandler from "./handlers/avatar";
import qrHandler from "./handlers/qr";
import diagnosticsHandler from "./handlers/diagnostics";

/**
 * Generate a provider and handler to setup Lightning auth.
 *
 * @param {Object} userConfig - config options, see the package README for details
 *
 * @returns {Object}
 * @returns {String} provider - a provider that can be added to the `next-auth` config's providerArray
 * @returns {String} handler - an API handler to be exported in the pages/api/lnauth/[...lnauth] folder
 */
export default function NextAuthLightning(userConfig: UserConfig) {
  const config = formatConfig(userConfig);

  const provider: OAuthConfig<any> = {
    id: "lightning",
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
    clientId: config.siteUrl,
    clientSecret: config.secret,
    style: {
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgyIiBoZWlnaHQ9IjI4MiIgdmlld0JveD0iMCAwIDI4MiAyODIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPgo8Y2lyY2xlIGN4PSIxNDAuOTgzIiBjeT0iMTQxLjAwMyIgcj0iMTQxIiBmaWxsPSIjN0IxQUY3Ii8+CjxwYXRoIGQ9Ik03OS43NjA5IDE0NC4wNDdMMTczLjc2MSA2My4wNDY2QzE3Ny44NTcgNjAuNDIzNSAxODEuNzYxIDYzLjA0NjYgMTc5LjI2MSA2Ny41NDY2TDE0OS4yNjEgMTI2LjU0N0gyMDIuNzYxQzIwMi43NjEgMTI2LjU0NyAyMTEuMjYxIDEyNi41NDcgMjAyLjc2MSAxMzMuNTQ3TDExMC4yNjEgMjE1LjA0N0MxMDMuNzYxIDIyMC41NDcgOTkuMjYxIDIxNy41NDcgMTAzLjc2MSAyMDkuMDQ3TDEzMi43NjEgMTUxLjU0N0g3OS43NjA5Qzc5Ljc2MDkgMTUxLjU0NyA3MS4yNjA5IDE1MS41NDcgNzkuNzYwOSAxNDQuMDQ3WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMCI+CjxyZWN0IHdpZHRoPSIyODIiIGhlaWdodD0iMjgyIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",
      bg: config.theme.signInButtonBackground,
      text: config.theme.signInButtonText,
    },
  };

  const handler = async function lnAuthHandler(
    req: NextApiRequest | NextRequest,
    res: NextApiResponse | NextResponse
  ) {
    const { path } = formatRouter(req, res);

    if (path?.indexOf(config.apis.create) === 0) {
      return await dynamicHandler(req, res, config, createHandler);
    } else if (path?.indexOf(config.apis.poll) === 0) {
      return await dynamicHandler(req, res, config, pollHandler);
    } else if (path?.indexOf(config.apis.callback) === 0) {
      return await dynamicHandler(req, res, config, callbackHandler);
    } else if (path?.indexOf(config.apis.token) === 0) {
      return await dynamicHandler(req, res, config, tokenHandler);
    } else if (path?.indexOf(config.apis.signIn) === 0) {
      return await dynamicHandler(req, res, config, signInHandler);
    } else if (path?.indexOf(config.apis.avatar) === 0) {
      return await dynamicHandler(req, res, config, avatarHandler);
    } else if (path?.indexOf(config.apis.qr) === 0) {
      return await dynamicHandler(req, res, config, qrHandler);
    } else if (
      path?.indexOf(config.apis.diagnostics) === 0 &&
      config.flags.diagnostics
    ) {
      return await dynamicHandler(req, res, config, diagnosticsHandler);
    }

    return await dynamicHandler(req, res, config, async () => ({
      error: "NotFound",
      status: 404,
    }));
  };

  return {
    provider,
    handler,
  };
}
