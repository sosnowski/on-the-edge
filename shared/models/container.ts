import { z } from "zod";
import { EntityId, Token } from "./base";
import { SurveyMetadata } from "./survey";

export const Container = z.object({
    id: EntityId.optional(),
    name: z.string(),
    description: z.string(),
    domain: z.string().optional(),
    created: z.string().optional(),
    updated: z.string().optional(),
});

export const ContainerInfo = z.object({
    userToken: Token,
    sessionToken: Token,
    surveys: z.array(SurveyMetadata),
});

export type Container = z.infer<typeof Container>;
export type ContainerInfo = z.infer<typeof ContainerInfo>;
