import { ImgHTMLAttributes } from "react";

import { formatLnAuth } from "../utils/lnurl.js";
import { hardConfig } from "../config.js";

export default function QrCode({
  lnurl,
  ...props
}: {
  lnurl: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const { qr } = formatLnAuth(lnurl);

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
