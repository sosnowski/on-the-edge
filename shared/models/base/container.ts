import { z } from "zod";
import { EntityId } from "./base";

export const Container = z.object({
    containerId: EntityId,
    name: z.string(),
    description: z.string(),
    surveysCount: z.number().min(0).optional(),
    created: z.string(),
    updated: z.string(),
});

export type Container = z.infer<typeof Container>;
