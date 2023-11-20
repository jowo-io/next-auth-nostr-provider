import merge from "lodash.merge";

import QRCode from "qrcode";

import { QRGenerator } from "../main/config/types.js";

export const generateQr: QRGenerator = async (data, config) => {
  // generic preset theme options
  const themeOptions =
    config.theme.colorScheme === "dark"
      ? {
          margin: 0.5,
          color: {
            dark: config.theme.background,
            light: config.theme.text,
          },
        }
      : {
          margin: 0,
          color: {
            dark: config.theme.text,
            light: config.theme.background,
          },
        };

  // qr specific option overrides
  const qrOptions: any = {
    color: {
      dark: config.theme.qrForeground,
      light: config.theme.qrBackground,
    },
    margin: config.theme.qrMargin,
  };

  // merge options, prioritize explicit qrOptions
  const options = merge(themeOptions, qrOptions);

  return {
    data: (await QRCode.toString(data, {
      ...options,
      type: "svg",
    })) as unknown as string,
    type: "svg",
  };
};
