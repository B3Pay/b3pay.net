/**
 * /clear-signing/coverage.json: the coverage tracker's data, the file the
 * page at /clear-signing/coverage/ is built from, byte for byte. Written once,
 * at build time.
 */
import type { APIRoute } from "astro";
import { RAW } from "../../components/coverage/report.ts";

export const GET: APIRoute = () =>
  new Response(RAW, { headers: { "Content-Type": "application/json; charset=utf-8" } });
