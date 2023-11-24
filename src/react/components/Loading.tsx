import { HTMLAttributes } from "preact/compat";

import { hardConfig } from "../../main/config/hard";

export function Loading({ ...props }: {} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={hardConfig.ids.loading} style={{ textAlign: "center" }} {...props}>
      <span>Loading...</span>
    </div>
  );
}
