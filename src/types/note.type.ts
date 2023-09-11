import { z } from "zod";

export const noteSchema = z.object({
  id: z.number(),
  timestamp: z.number(),
  title: z.string(),
  content: z.string(),
});
export type Note = z.infer<typeof noteSchema>;
export type NoteBody = Omit<Note, 'id' | 'timestamp'>
