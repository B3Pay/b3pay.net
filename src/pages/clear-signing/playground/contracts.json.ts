/**
 * /clear-signing/playground/contracts.json: what the playground says about
 * each contract the coverage tracker follows, cut from the coverage report
 * (src/components/playground/contracts.ts). Written once, at build time.
 */
import type { APIRoute } from "astro";
import { report } from "../../../components/coverage/report.ts";
import { playgroundContracts } from "../../../components/playground/contracts.ts";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(playgroundContracts(report)), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
