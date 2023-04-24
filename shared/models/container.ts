import { z } from "zod";
import { EntityId, Token } from "./base";
import { SurveyMetadata } from "./survey";

export const Container = z.object({
    id: EntityId,
    name: z.string(),
    description: z.string(),
    surveysCount: z.number().min(0).optional(),
    created: z.string(),
    updated: z.string(),
});

export const ContainerInfo = z.object({
    userToken: Token,
    sessionToken: Token,
    surveys: z.array(SurveyMetadata),
});

export type Container = z.infer<typeof Container>;
export type ContainerInfo = z.infer<typeof ContainerInfo>;
