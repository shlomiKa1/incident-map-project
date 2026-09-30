import z from "zod";

const idSchema = z.string().regex(/^[a-f\d]{24}/i, "invalid id");
const category = z.enum(["fire", "flood", "accident", "medical", "other"]);

export const idParamSchema = z.object({
  id: idSchema,
});

export const createIncident = z.object({
  title: z.string().trim().min(4).max(25, "Maximum 25 characters"),
  description: z.string().trim().min(4),
  category: category,
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export const updateIncident = createIncident.partial().extend({
  createdBy: idSchema,
});

export const QuerySchema = z
  .object({
    category: category,
  })
  .partial();
