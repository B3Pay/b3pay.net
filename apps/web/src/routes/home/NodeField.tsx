import { useEffect, useRef } from "react";

/**
 * The background is a payment-gateway topology: every node is a real hop a
 * ckBTC checkout passes through. The run panel lights them as it executes.
 *
 * 0–14 are the indices the design handoff documents; the Bitcoin leg (15, 16)
 * is appended rather than inserted so those stay stable.
 */
export const NODES = [
  { x: 6, y: 18, l: "checkout" },
  { x: 6, y: 72, l: "merchant" },
  { x: 17, y: 42, l: "invoice" },
  { x: 28, y: 13, l: "wallet" },
  { x: 27, y: 67, l: "kyt-check" },
  { x: 38, y: 89, l: "rate-oracle" },
  { x: 39, y: 34, l: "icp-ledger" },
  { x: 50, y: 58, l: "ckbtc-ledger" },
  { x: 51, y: 9, l: "fee-vault" },
  { x: 63, y: 30, l: "settlement" },
  { x: 74, y: 56, l: "receipt" },
  { x: 76, y: 12, l: "webhook" },
  { x: 85, y: 84, l: "audit-log" },
  { x: 88, y: 40, l: "payout" },
  { x: 95, y: 66, l: "refund" },
  { x: 3, y: 45, l: "btc-network" },
  { x: 16, y: 88, l: "ckbtc-minter" },
  // The band under the run panel read as dead space. These are the hops a
  // checkout of this size really has and the panel had no room to name.
  //
  // They sit below y=94 on purpose. The panel is the tallest thing in the hero,
  // so it always spans the grid's content box — roughly 12% to 94% — whatever
  // its own height happens to be. Everything above 94% here is behind it.
  { x: 52, y: 96, l: "btc-checker" },
  { x: 64, y: 97, l: "archive" },
  { x: 78, y: 95, l: "index-canister" },
  { x: 95, y: 92, l: "dispute" },
] as const;

export const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 2], [1, 2], [2, 3], [2, 6], [3, 4], [3, 6], [4, 6], [4, 7], [5, 7], [6, 7],
  [6, 8], [7, 8], [7, 9], [8, 9], [9, 10], [9, 11], [10, 12], [10, 13], [11, 13],
  [12, 14], [13, 14],
  // The Bitcoin leg: UTXOs arrive from the network, the minter mints against
  // them, and the ckBTC lands on the ledger the rest of the graph already uses.
  [15, 16], [16, 2], [16, 4], [16, 7],
  // Screening, history and the two nodes a clean payment never reaches.
  [16, 17], [17, 7], [7, 18], [18, 12], [18, 19], [10, 19], [12, 20], [14, 20],
];

/**
 * Blurred at rest; the cursor carries a spotlight that brings it into focus.
 * `active` switches nodes on.
 *
 * The cursor position is written straight onto the element as --mx/--my. It is
 * deliberately not React state — a mousemove handler that re-renders at 60Hz
 * would be the most expensive thing on the page.
 */
export function NodeField({ active }: { active: ReadonlySet<number> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const move = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
      el.dataset.live = "true";
    };
    const leave = () => {
      el.dataset.live = "false";
    };
    host.addEventListener("mousemove", move);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mousemove", move);
      host.removeEventListener("mouseleave", leave);
    };
  }, []);

  const layer = (sharp: boolean) => (
    <div
      className={"b3-nodefield__layer b3-nodefield__layer--" + (sharp ? "sharp" : "blur")}
      key={sharp ? "s" : "b"}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        {EDGES.map(([i, j], k) => {
          const on = active.has(i) && active.has(j);
          return (
            <line
              key={k}
              x1={NODES[i].x}
              y1={NODES[i].y}
              x2={NODES[j].x}
              y2={NODES[j].y}
              stroke={on ? "var(--forge-500)" : "var(--ink-500)"}
              strokeWidth={on ? 1.6 : 1}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke var(--dur-slow) var(--ease-out)" }}
            />
          );
        })}
      </svg>
      {NODES.map((n, i) => {
        const on = active.has(i);
        // Past 68% the label would run off the right edge, so it flips — and the
        // whole box shifts left by its own width, or the dot leaves its edges.
        const flip = n.x > 68;
        return (
          <span
            key={i}
            className={"b3-nodefield__node" + (flip ? " b3-nodefield__node--flip" : "")}
            style={{ left: n.x + "%", top: n.y + "%" }}
          >
            <span className={"b3-nodefield__dot" + (on ? " b3-nodefield__dot--hot" : "")} />
            <span
              className="b3-nodefield__label"
              style={{ color: on ? "var(--forge-500)" : "var(--text-mark)" }}
            >
              {n.l}
            </span>
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="b3-nodefield" ref={ref} data-live="false" aria-hidden>
      {layer(false)}
      {layer(true)}
    </div>
  );
}
