import { HTMLAttributes } from "react";

import { hardConfig } from "../config/index.js";

export default function CopyCode({
  lnurl,
  ...props
}: { lnurl: string } & HTMLAttributes<HTMLPreElement>) {
  return (
    <pre {...props} id={hardConfig.ids.copy}>
      {lnurl}
    </pre>
  );
}
