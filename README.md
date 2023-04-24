# Living on the Edge

A POC / Experiment of the serverless application running entirely on Edge.

**Work in progress.**

## Use case

Application for creating and running microsurveys on pages. Allows users to create small surveys, attach them to their web application and gather and analyse users feedback.

## Tech stack

Build on Cloudflare workers.

-   Bare workers to expose API for launching surveys and gathering responses
-   Cloudflare KV for distributed, on-edge storage of survey information
-   Cloudflare Queues to batch received responses and write them to database
-   Supabase PostgreSQL as a main DB
-   Cloudflare Pages to deploy Dashboard and SurveyCreator
