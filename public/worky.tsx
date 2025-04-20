const App = () => (
  <>
    <svg></svg>
    <header></header>
    <nav></nav>
    <menu></menu>
    <aside></aside>
    <footer></footer>
  </>
);
const work = <App />;

self.postMessage(work);
self.addEventListener(
  "message",
  ({ data }) => {
    console.log(JSON.stringify(data));
    console.log(JSON.stringify(work));
  },
);
