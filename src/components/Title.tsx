import * as React from "react";

import { hardConfig } from "../config/index.js";

export function Title({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  if (!props.children) return null;

  return (
    <h1 {...props} id={hardConfig.ids.title}>
      {props.children}
    </h1>
  );
}
