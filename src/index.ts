export type {
  StorageSession as NextAuthLightningStorageSession,
  UserConfig as NextAuthLightningConfig,
} from "./main/config/types";
export type { NextAuthLightningClientSession } from "./server/index";

export { default } from "./main/index";
export { HandlerErrorCodes as ErrorCodes } from "./main/utils/handlers";
