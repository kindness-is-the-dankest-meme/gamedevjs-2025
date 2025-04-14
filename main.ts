import { handleRequest } from "./server/handleRequest.ts";

Deno.serve(handleRequest);
