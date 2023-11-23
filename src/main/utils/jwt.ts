import * as jose from "jose";

import { Config } from "../config/index.js";

export async function generateIdToken(pubkey: string, config: Config) {
  const secret = Buffer.from(config.secret);

  const { name } = config?.generateName
    ? await config.generateName(pubkey, config)
    : { name: "" };

  const image = config?.generateAvatar
    ? `${config.siteUrl}${config.apis.avatar}/${pubkey}`
    : "";

  const expires = Math.floor(Date.now() / 1000 + config.intervals.idToken);

  const jwt = await new jose.SignJWT({
    id: pubkey,
    name,
    image,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(config.siteUrl)
    .setAudience(config.siteUrl)
    .setExpirationTime(expires)
    .setSubject(pubkey)
    .sign(secret, {});

  return jwt;
}

export async function generateRefreshToken(pubkey: string, config: Config) {
  const secret = Buffer.from(config.secret);

  const expires = Math.floor(Date.now() / 1000 + config.intervals.refreshToken);

  const jwt = await new jose.SignJWT({
    id: pubkey,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(config.siteUrl)
    .setAudience(config.siteUrl)
    .setExpirationTime(expires)
    .setSubject(pubkey)
    .sign(secret, {});

  return jwt;
}

export async function verifyRefreshToken(
  refreshToken: string,
  config: Config
): Promise<{
  pubkey: string;
  jwt: any;
}> {
  const secret = Buffer.from(config.secret);

  const jwt = await jose.jwtVerify(refreshToken, secret);

  const pubkey = jwt.payload?.id;
  if (!pubkey || typeof pubkey !== "string") throw new Error("Missing pubkey");

  return {
    pubkey,
    jwt: jwt.payload,
  };
}
