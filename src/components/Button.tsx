import * as React from "react";

import { formatLnAuth } from "../utils/lnurl.js";
import { hardConfig } from "../config/index.js";

export function Button({
  lnurl,
  ...props
}: {
  lnurl: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { button } = formatLnAuth(lnurl);

  return (
    <a {...props} id={hardConfig.ids.button} href={button}>
      Open Lightning Wallet
    </a>
  );
}
