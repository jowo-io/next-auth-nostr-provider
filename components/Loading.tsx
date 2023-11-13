import { hardConfig } from "../config.js";

export default function Loading({}: {}) {
  return (
    <div id={hardConfig.ids.loading} style={{ textAlign: "center" }}>
      Loading ...
    </div>
  );
}
