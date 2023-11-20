import { HTMLAttributes } from "preact/compat";

import { formatLightningAuth } from "../utils/lnurl.js";
import { hardConfig } from "../../main/config/hard.js";

export function QrCode({
  lnurl,
  ...props
}: {
  lnurl: string;
} & HTMLAttributes<HTMLImageElement>) {
  const { qr } = formatLightningAuth(lnurl);

  return (
    <img
      width={500}
      height={500}
      alt="Login with Lightning - QRCode"
      {...props}
      id={hardConfig.ids.qr}
      src={qr}
    />
  );
}
