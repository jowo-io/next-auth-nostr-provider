import { HTMLAttributes } from "preact/compat";

import { hardConfig } from "../../main/config/hard";

export function Title({ ...props }: HTMLAttributes<HTMLHeadingElement>) {
  if (!props.children) return null;

  return (
    <h1 {...props} id={hardConfig.ids.title}>
      {props.children}
    </h1>
  );
}
