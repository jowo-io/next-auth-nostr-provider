import { AnchorHTMLAttributes } from "react";
import { hardConfig } from "../config";
import { formatLnurl } from "../utils/lnurl";

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
