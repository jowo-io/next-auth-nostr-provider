import { z } from "zod";

export const callbackValidation = z.object({
  k1: z.string().min(1),
  key: z.string().min(1),
  sig: z.string().min(1),
});

export type CallbackValidation = z.infer<typeof callbackValidation>;

export const createValidation = z.object({
  state: z.string().min(1),
});

export type CreateValidation = z.infer<typeof callbackValidation>;

export const pollValidation = z.object({
  k1: z.string().min(1),
});

export type PingValidation = z.infer<typeof callbackValidation>;

export const tokenValidation = z.object({
  code: z.string().min(1),
});

export type TokenValidation = z.infer<typeof callbackValidation>;

export const userValidation = z.object({
  access_token: z.string().min(1),
});

export type UserValidation = z.infer<typeof callbackValidation>;
