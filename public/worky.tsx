const App = () => (
  <>
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      <defs>
        <g id="tli">
          <rect width="80" height="80" />
          <path d="M 0 0 H 40 A 40 40 0 0 1 0 40 Z" />
        </g>
        <g id="tri">
          <rect width="80" height="80" />
          <path d="M 80 0 V 40 A 40 40 0 0 1 40 0 Z" />
        </g>
        <g id="bri">
          <rect width="80" height="80" />
          <path d="M 80 80 H 40 A 40 40 0 0 1 80 40 Z" />
        </g>
        <g id="bli">
          <rect width="80" height="80" />
          <path d="M 0 80 V 40 A 40 40 0 0 1 40 80 Z" />
        </g>
        <g id="bro">
          <rect width="80" height="80" />
          <path d="M 0 0 V 80 H 40 A 40 40 0 0 1 80 40 V 0 Z" />
        </g>
        <g id="blo">
          <rect width="80" height="80" />
          <path d="M 0 0 V 40 A 40 40 0 0 1 40 80 H 80 V 0 Z" />
        </g>
        <g id="tlo">
          <rect width="80" height="80" />
          <path d="M 40 0 A 40 40 0 0 1 0 40 V 80 H 80 V 0 Z" />
        </g>
        <g id="tro">
          <rect width="80" height="80" />
          <path d="M 0 0 V 80 H 80 V 40 A 40 40 0 0 1 40 0 Z" />
        </g>
        <g id="vi">
          <rect width="80" height="80" />
          <rect width="40" height="80" />
        </g>
        <g id="vo">
          <rect width="80" height="80" />
          <rect x="40" width="40" height="80" />
        </g>
        <g id="hi">
          <rect width="80" height="80" />
          <rect width="80" height="40" />
        </g>
        <g id="ho">
          <rect width="80" height="80" />
          <rect y="40" width="80" height="40" />
        </g>
        <g id="i">
          <rect width="80" height="80" />
        </g>
        <g id="o">
          <rect width="80" height="80" />
        </g>
      </defs>
      <use href="#bri" transform="translate(0,0)" />
      <g>
        <rect width="80" height="80" />
        <path d="M 80 80 H 40 A 40 40 0 0 1 80 40 Z" />
      </g>
    </svg>
    <section>
      <header>
        <h1>Pond Game</h1>
        <p>
          {/* basic hud stuff, health, hunger, etc */}
        </p>
      </header>
      <nav>
        {/* play / pause, menu screen? */}
      </nav>
      <menu>
        <li>
          <input type="radio" id="oars" name="active-tool" checked />
          <label htmlFor="oars">Oars</label>
        </li>
        <li>
          <input type="radio" id="fishing-pole" name="active-tool" />
          <label htmlFor="fishing-pole">Fishing Pole</label>
        </li>
        <li>
          <input type="radio" id="flashlight" name="active-tool" />
          <label htmlFor="flashlight">Flashlight</label>
        </li>
      </menu>
      <aside>
        <table>
          {/* inventory? */}
        </table>
      </aside>
      <footer>
        {/* contextual stuff */}
      </footer>
    </section>
  </>
);

self.postMessage(<App />);
self.addEventListener(
  "message",
  ({ data }) => console.log(JSON.stringify(data)),
);
