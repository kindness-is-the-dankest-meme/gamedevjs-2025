import { App } from "./components/App.tsx";

self.addEventListener(
  "message",
  ({ data }) => console.log(JSON.stringify(data)),
);

self.postMessage(<App />);
