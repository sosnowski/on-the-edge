import { z } from "zod";
import { EntityId, Token } from "./base";
import { SurveyMetadata } from "./survey";
import { isValidDomain } from "../validators";

export const Container = z.object({
    id: EntityId.optional(),
    name: z.string(),
    description: z.string(),
    domains: z.array(
        z.string().refine(isValidDomain, { message: "Invalid domain" })
    ),
    created: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
});

export const ContainerInfo = z.object({
    userToken: Token,
    sessionToken: Token,
    surveys: z.array(SurveyMetadata),
});

export type Container = z.infer<typeof Container>;
export type ContainerInfo = z.infer<typeof ContainerInfo>;
