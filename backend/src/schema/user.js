import z from "zod";

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email"));

export const userSchema = z.object({
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters"),
});
