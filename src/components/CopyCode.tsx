import * as React from "react";

import { hardConfig } from "../config/index.js";

export function CopyCode({
  lnurl,
  ...props
}: { lnurl: string } & React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre {...props} id={hardConfig.ids.copy}>
      {lnurl}
    </pre>
  );
}
