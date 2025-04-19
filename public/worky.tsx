import type { Child } from "./lib/real.ts";

const Item = (_: { key: string }, children: Child[]) => <li>{children}</li>;
const List = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((i, j) => (
      <Item key={j + ":" + i.toLocaleLowerCase().replace(/\W/g, "-")}>
        {i}
      </Item>
    ))}
  </ul>
);
const App = () => (
  <main id="m">
    <List
      items={[
        "An item",
        "Another item",
        "A third item",
        "A fourth",
      ]}
    />
    <hr />
    <article className="the-article">
      <header>
        <h1>The Title</h1>
        <h2>A Subheading</h2>
      </header>
      <section>
        <p>Some content.</p>
        <p>
          Some <b>more</b>
          <i>content</i>.
        </p>
      </section>
      <footer>The footer</footer>
    </article>
  </main>
);
const work = <App />;

self.postMessage(work);
self.addEventListener(
  "message",
  ({ data }) => {
    console.log(JSON.stringify(data) === JSON.stringify(work));
  },
);
