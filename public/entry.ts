import { bar } from "./foo.ts";
console.log(bar);

const worker = new Worker("./worker.ts");
worker.addEventListener("message", ({ data }) => console.log(data));
