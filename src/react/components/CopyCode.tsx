import { HTMLAttributes } from "react";

import { hardConfig } from "../../main/config/hard.js";

export function CopyCode({
  lnurl,
  ...props
}: { lnurl: string } & HTMLAttributes<HTMLPreElement>) {
  return (
    <pre {...props} id={hardConfig.ids.copy}>
      {lnurl}
    </pre>
  );
}
