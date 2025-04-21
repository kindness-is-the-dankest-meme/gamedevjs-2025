type PondProps = {
  cols: number;
  rows: number;
  size: number;
};

export const Pond = ({ cols, rows, size }: PondProps) => (
  <svg
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    viewBox={`0 0 ${cols * size} ${rows * size}`}
    fill="none"
  >
    <defs>
      <g id="tli">
        <rect width={size} height={size} />
        <path d="M 0 0 H 40 A 40 40 0 0 1 0 40 Z" />
      </g>
      <g id="tri">
        <rect width={size} height={size} />
        <path d="M 80 0 V 40 A 40 40 0 0 1 40 0 Z" />
      </g>
      <g id="bri">
        <rect width={size} height={size} />
        <path d="M 80 80 H 40 A 40 40 0 0 1 80 40 Z" />
      </g>
      <g id="bli">
        <rect width={size} height={size} />
        <path d="M 0 80 V 40 A 40 40 0 0 1 40 80 Z" />
      </g>
      <g id="bro">
        <rect width={size} height={size} />
        <path d="M 0 0 V 80 H 40 A 40 40 0 0 1 80 40 V 0 Z" />
      </g>
      <g id="blo">
        <rect width={size} height={size} />
        <path d="M 0 0 V 40 A 40 40 0 0 1 40 80 H 80 V 0 Z" />
      </g>
      <g id="tlo">
        <rect width={size} height={size} />
        <path d="M 40 0 A 40 40 0 0 1 0 40 V 80 H 80 V 0 Z" />
      </g>
      <g id="tro">
        <rect width={size} height={size} />
        <path d="M 0 0 V 80 H 80 V 40 A 40 40 0 0 1 40 0 Z" />
      </g>
      <g id="vi">
        <rect width={size} height={size} />
        <rect width={size / 2} height={size} />
      </g>
      <g id="vo">
        <rect width={size} height={size} />
        <rect x={size / 2} width={size / 2} height={size} />
      </g>
      <g id="hi">
        <rect width={size} height={size} />
        <rect width={size} height={size / 2} />
      </g>
      <g id="ho">
        <rect width={size} height={size} />
        <rect y={size / 2} width={size} height={size / 2} />
      </g>
      <g id="i">
        <rect width={size} height={size} />
      </g>
      <g id="o">
        <rect width={size} height={size} />
      </g>
    </defs>
    <g>
      <use href="#bri" transform="translate(0,0)" />
    </g>
  </svg>
);
