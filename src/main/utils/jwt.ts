import * as jose from "jose";

import { Config } from "../config/index";

export async function generateIdToken(
  pubkey: string,
  name: string,
  image: string,
  config: Config
) {
  const secret = Buffer.from(config.secret);

  const expires = Math.floor(Date.now() / 1000 + config.intervals.idToken);
  const jwt = await new jose.SignJWT({
    id: pubkey,
    name,
    image,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(Math.floor(Date.now() / 1000))
    .setIssuer(config.baseUrl)
    .setAudience(config.baseUrl)
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
    .setIssuedAt(Math.floor(Date.now() / 1000))
    .setIssuer(config.baseUrl)
    .setAudience(config.baseUrl)
    .setExpirationTime(expires)
    .setSubject(pubkey)
    .sign(secret, {});

  return jwt;
}

export async function verifyRefreshToken(
  refreshToken: string,
  config: Config
): Promise<{
  pubkey?: string;
  jwt: any;
}> {
  const secret = Buffer.from(config.secret);

  const jwt = await jose.jwtVerify(refreshToken, secret);

  const pubkey =
    typeof jwt.payload?.id === "string" ? jwt.payload.id : undefined;

  return {
    pubkey,
    jwt: jwt.payload,
  };
}
