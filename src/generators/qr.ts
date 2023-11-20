import QRCode from "qrcode";

import { QRGenerator } from "../main/config/types.js";

export const generateQr: QRGenerator = async (data, config) => {
  const options: any = {
    color: {
      dark: config.theme.qrForeground,
      light: config.theme.qrBackground,
    },
    margin: config.theme.qrMargin,
  };

  return {
    data: (await QRCode.toString(data, {
      ...options,
      type: "svg",
    })) as unknown as string,
    type: "svg",
  };
};
