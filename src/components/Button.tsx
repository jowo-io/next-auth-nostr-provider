import { AnchorHTMLAttributes } from "react";

import { formatLnAuth } from "../utils/lnurl.js";
import { hardConfig } from "../config.js";

export default function Button({
  lnurl,
  ...props
}: {
  lnurl: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { button } = formatLnAuth(lnurl);

  return (
    <a {...props} id={hardConfig.ids.button} href={button}>
      Open Lightning Wallet
    </a>
  );
}
