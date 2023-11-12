import { CSSProperties } from "react";

import CopyCode from "./CopyCode";
import QrCode from "./QrCode";
import Button from "./Button";

import { hardConfig } from "../config";
import Title from "./Title";

/**
 *
 * siteUrl
 * theme (dark/light mode)
 *
 *
 */

export default function Lightning({
  title,
  lnurl,
  theme,
}: {
  title?: string | null;
  lnurl: string;
  theme?: { [key: string]: CSSProperties | undefined };
}) {
  return (
    <div id={hardConfig.ids.wrapper} style={theme?.wrapper}>
      <Title style={theme?.title}>{title}</Title>

      <QrCode lnurl={lnurl} style={theme?.qr} />

      <CopyCode lnurl={lnurl} style={theme?.input} />

      <Button lnurl={lnurl} style={theme?.button} />
    </div>
  );
}
