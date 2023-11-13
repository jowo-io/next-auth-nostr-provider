import * as jose from "jose";

import { Config } from "../config/index.js";

export async function generateIdToken(pubkey: string, config: Config) {
  const secret = Buffer.from(config.secret);

  const { name } = config?.generateName
    ? await config.generateName(pubkey, config)
    : { name: null };

  const image = config?.generateAvatar
    ? `${config.siteUrl}${config.apis.image}/${pubkey}.svg`
    : null;

  const jwt = await new jose.SignJWT({
    id: pubkey,
    name,
    image,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(config.siteUrl)
    .setAudience(config.siteUrl)
    .setExpirationTime("2h")
    .setSubject(pubkey)
    .sign(secret, {});

  return jwt;
}
