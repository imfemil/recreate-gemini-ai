import z from "zod";

export const promptInputSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  images: z.array(z.string()).max(5, 'You can upload max 5 images'),
});
