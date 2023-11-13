import { AnchorHTMLAttributes } from "react";

import { formatLnurl } from "../utils/lnurl.js";
import { hardConfig } from "../config.js";

export default function Button({
  lnurl,
  ...props
}: {
  lnurl: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { button } = formatLnurl(lnurl);

  return (
    <a {...props} id={hardConfig.ids.button} href={button}>
      Open Lightning Wallet
    </a>
  );
}
