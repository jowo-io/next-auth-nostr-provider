import { HTMLAttributes } from "react";

import { hardConfig } from "../config/index.js";

export default function Loading({
  ...props
}: {} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={hardConfig.ids.loading} style={{ textAlign: "center" }} {...props}>
      Loading ...
    </div>
  );
}
