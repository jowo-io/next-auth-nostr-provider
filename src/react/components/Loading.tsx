import { HTMLAttributes } from "preact/compat";

import { hardConfig } from "../../main/config/hard.js";

export function Loading({ ...props }: {} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={hardConfig.ids.loading} style={{ textAlign: "center" }} {...props}>
      Loading ...
    </div>
  );
}
