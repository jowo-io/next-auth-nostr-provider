import { z } from "zod";

const leadingSlashRegex = new RegExp("^(/+)");

export const configValidation = z
  .object({
    // required
    siteUrl: z.string().min(10),
    secret: z.string().min(10),
    storage: z
      .object({
        set: z.function(),
        get: z.function(),
        update: z.function(),
        delete: z.function(),
      })
      .strict(),
    generateQr: z.function(),

    // optional
    generateAvatar: z.function().nullable().optional(),
    generateName: z.function().nullable().optional(),
    pages: z
      .object({
        signIn: z.string().regex(leadingSlashRegex).min(1).optional(),
        error: z.string().regex(leadingSlashRegex).min(1).optional(),
      })
      .strict()
      .nullish(),
    flags: z
      .object({
        diagnostics: z.boolean().optional(),
        logs: z.boolean().optional(),
      })
      .strict()
      .nullish(),
    title: z.string().nullable().optional(),
    theme: z
      .object({
        colorScheme: z
          .union([z.literal("light"), z.literal("dark")])
          .optional(),
        background: z.string().min(1).optional(),
        backgroundCard: z.string().min(1).optional(),
        text: z.string().min(1).optional(),
        error: z.string().min(1).optional(),
        signInButtonBackground: z.string().min(1).optional(),
        signInButtonText: z.string().min(1).optional(),
        qrBackground: z.string().min(1).optional(),
        qrForeground: z.string().min(1).optional(),
        qrMargin: z.number().positive().max(10).optional(),
      })
      .strict()
      .nullish(),
  })
  .strict();
