import { HTMLAttributes } from "preact/compat";

import { formatLightningAuth } from "../utils/lnurl"
import { hardConfig } from "../../main/config/hard"

export function Button({
  lnurl,
  ...props
}: {
  lnurl: string;
} & HTMLAttributes<HTMLAnchorElement>) {
  const { button } = formatLightningAuth(lnurl);

  return (
    <a {...props} id={hardConfig.ids.button} href={button}>
      Open Lightning Wallet
    </a>
  );
}
