import { HTMLAttributes } from "preact/compat";

import { hardConfig } from "../config/hard";

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
