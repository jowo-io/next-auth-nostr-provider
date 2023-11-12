import { HTMLAttributes } from "react";
import { hardConfig } from "../config";

export default function CopyCode({
  lnurl,
  ...props
}: { lnurl: string } & HTMLAttributes<HTMLPreElement>) {
  // TODO make it copy/paste when you click
  // TODO add ellipsis in middle
  return (
    <pre {...props} id={hardConfig.ids.copy}>
      {lnurl}
    </pre>
  );
}
