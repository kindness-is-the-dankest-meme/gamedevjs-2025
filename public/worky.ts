console.log("foo");
self.postMessage("bar");
self.addEventListener("message", ({ data }) => console.log(data));
