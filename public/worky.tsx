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
        <ul>
          <li>An item</li>
          <li>Another item</li>
          <li>A third item</li>
          <li>A fourth</li>
        </ul>
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
