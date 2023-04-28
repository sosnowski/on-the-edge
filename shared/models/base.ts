import { z } from "zod";
import { nanoid } from "nanoid";

export const EntityId = z.string().length(30);
export const Token = z.string().length(30);

export const newEntityId = (): EntityId => {
    return nanoid(30);
};

export type EntityId = z.infer<typeof EntityId>;
export type Token = z.infer<typeof Token>;
