import { z } from "zod";
import { Token } from "../base/base";
import { SurveyMetadata } from "./survey";

export * from "../base/container";
export * from "../base/base";

export const ContainerInfo = z.object({
    userToken: Token,
    sessionToken: Token,
    surveys: z.array(SurveyMetadata),
});

export type ContainerInfo = z.infer<typeof ContainerInfo>;
