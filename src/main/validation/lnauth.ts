import { z } from "zod";

export const callbackValidation = z.object({
  k1: z.string().min(1),
  key: z.string().min(1),
  sig: z.string().min(1),
});

export type CallbackValidation = z.infer<typeof callbackValidation>;

export const createValidation = z
  .object({
    state: z.string().min(1),
    k1: z.string().min(1).optional(),
  })
  .strict();

export type CreateValidation = z.infer<typeof callbackValidation>;

export const signInValidation = z.object({
  state: z.string().min(1),
  redirect_uri: z.string().min(1),
});

export type SignInValidation = z.infer<typeof callbackValidation>;

export const pollValidation = z
  .object({
    k1: z.string().min(1),
  })
  .strict();

export type PingValidation = z.infer<typeof callbackValidation>;

export const tokenValidation = z.object({
  grant_type: z.union([
    z.literal("authorization_code"),
    z.literal("refresh_token"),
  ]),
  code: z.string().optional(),
  refresh_token: z.string().optional(),
});

export type TokenValidation = z.infer<typeof callbackValidation>;
