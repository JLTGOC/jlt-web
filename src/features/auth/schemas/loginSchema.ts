import * as z from "zod";

export const loginSchema = z.object({
  // Backend accepts either email or username in the `email` field.
  email: z.string().trim().min(1, "Username or email is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean().optional(),
});
