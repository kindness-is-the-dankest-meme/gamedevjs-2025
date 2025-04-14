const worker = new Worker("./worker.ts");
worker.addEventListener("message", ({ data }) => console.log(data));
