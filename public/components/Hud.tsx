export const Hud = () => (
  <section>
    <header>
      <h1>pond game</h1>
      <p>{/* basic hud stuff, health, hunger, etc */}</p>
    </header>
    <nav>{/* play / pause, menu screen? */}</nav>
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
      <table>{/* inventory? */}</table>
    </aside>
    <footer>{/* contextual stuff */}</footer>
  </section>
);
