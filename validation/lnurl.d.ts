import { z } from "zod";
export declare const callbackValidation: z.ZodObject<{
    k1: z.ZodString;
    key: z.ZodString;
    sig: z.ZodString;
}, "strip", z.ZodTypeAny, {
    k1: string;
    sig: string;
    key: string;
}, {
    k1: string;
    sig: string;
    key: string;
}>;
export type CallbackValidation = z.infer<typeof callbackValidation>;
export declare const lnurlAuthValidation: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export type LnurlAuthValidation = z.infer<typeof callbackValidation>;
export declare const createValidation: z.ZodObject<{
    state: z.ZodString;
}, "strip", z.ZodTypeAny, {
    state: string;
}, {
    state: string;
}>;
export type CreateValidation = z.infer<typeof callbackValidation>;
export declare const pingValidation: z.ZodObject<{
    k1: z.ZodString;
}, "strip", z.ZodTypeAny, {
    k1: string;
}, {
    k1: string;
}>;
export type PingValidation = z.infer<typeof callbackValidation>;
export declare const tokenValidation: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
export type TokenValidation = z.infer<typeof callbackValidation>;
export declare const userValidation: z.ZodObject<{
    access_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    access_token: string;
}, {
    access_token: string;
}>;
export type UserValidation = z.infer<typeof callbackValidation>;
//# sourceMappingURL=lnurl.d.ts.map