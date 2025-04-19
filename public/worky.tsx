import type { Kids } from "./lib/real.ts";

const Item = (props: { key: string }, kids: Kids) => <li {...props}>{kids}</li>;
const List = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((i, j) => (
      <Item key={j + ":" + i.toLocaleLowerCase().replace(/\W/g, "-")}>{i}</Item>
    ))}
  </ul>
);
const work = (
  <main id="m">
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
        <List
          items={[
            "An item",
            "Another item",
            "A third item",
            "A fourth",
          ]}
        />
      </section>
      <footer>The footer</footer>
    </article>
  </main>
);

self.postMessage(work);
self.addEventListener(
  "message",
  ({ data }) => console.log(JSON.stringify(data) === JSON.stringify(work)),
);
