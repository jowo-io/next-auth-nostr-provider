import { HTMLAttributes } from "react";

import { hardConfig } from "../config/index.js";

export default function Title({
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  if (!props.children) return null;

  return (
    <h1 {...props} id={hardConfig.ids.title}>
      {props.children}
    </h1>
  );
}
