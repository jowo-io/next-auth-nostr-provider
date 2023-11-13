import { z } from "zod";

export const callbackValidation = z.object({
  k1: z.string().nonempty(),
  key: z.string().nonempty(),
  sig: z.string().nonempty(),
});

export type CallbackValidation = z.infer<typeof callbackValidation>;

export const lnurlAuthValidation = z.object({
  // colors: z.number().min(0).max(10).default(0),
});

export type LnurlAuthValidation = z.infer<typeof callbackValidation>;

export const createValidation = z.object({
  state: z.string().nonempty(),
});

export type CreateValidation = z.infer<typeof callbackValidation>;

export const pingValidation = z.object({
  k1: z.string().nonempty(),
});

export type PingValidation = z.infer<typeof callbackValidation>;

export const tokenValidation = z.object({
  code: z.string().nonempty(),
});

export type TokenValidation = z.infer<typeof callbackValidation>;

export const userValidation = z.object({
  access_token: z.string().nonempty(),
});

export type UserValidation = z.infer<typeof callbackValidation>;
