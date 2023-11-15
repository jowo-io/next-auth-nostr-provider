import * as React from "react";

import { hardConfig } from "../config/index.js";

export function Loading({
  ...props
}: {} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={hardConfig.ids.loading} style={{ textAlign: "center" }} {...props}>
      Loading ...
    </div>
  );
}
