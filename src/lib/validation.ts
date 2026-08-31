import { z } from "zod";

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),

  message: z
    .string()
    .trim()
    .min(10, "Please enter a message.")
    .max(3000, "Message is too long."),
});

export type ContactFormData = z.infer<typeof contactSchema>;