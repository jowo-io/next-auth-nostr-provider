import { IssueData, z } from "zod";

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

export const signInValidation = z.object({
  state: z.string().min(1),
  redirect_uri: z.string().min(1),
});

export type SignInValidation = z.infer<typeof callbackValidation>;

export const pollValidation = z.object({
  k1: z.string().min(1),
});

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

export const userValidation = z.object({
  access_token: z.string().min(1),
});

export type UserValidation = z.infer<typeof callbackValidation>;

export function errorMap(issue: IssueData) {
  return {
    message: `Body argument ${issue.path} of ${issue.code}`,
  };
}

export function formatErrorMessage(e: any): string {
  console.error(e);

  let message = "Something went wrong";

  if (typeof e?.message === "string") {
    // regular Error type
    message = e.message;

    try {
      // zod errors are thrown as stringified json array, so decode array if detected
      if (e.message[0] === "[") {
        const zodError = JSON.parse(e.message);
        if (typeof zodError?.[0]?.message === "string") {
          // Zod error type
          message = zodError[0].message;
        }
      }
    } catch (e: any) {
      console.error(e);
    }
  }

  return message;
}
