import { CSSProperties } from "react";

import { Title } from "./Title.js";
import { QrCode } from "./QrCode.js";
import { CopyCode } from "./CopyCode.js";
import { Button } from "./Button.js";

import { hardConfig } from "../../main/config/hard.js";

export function LnAuthLogin({
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
