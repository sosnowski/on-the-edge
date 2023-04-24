import { z } from "zod";

export const EntityId = z.number().min(0);
export const Token = z.string().length(30);

export type EntityId = z.infer<typeof EntityId>;
export type Token = z.infer<typeof Token>;
