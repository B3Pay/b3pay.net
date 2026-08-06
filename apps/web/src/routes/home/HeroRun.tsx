import { Badge, Button, IconOf } from "@b3pay/ui";

/**
 * One checkout: two B3Forge seats, paid in ckBTC. Each call lights the hops it
 * touches in the background topology. `refund` is never in `lights` — a
 * successful payment leaves that node dark, and that is the point of showing it.
 */
export const STEPS = [
  { fn: "invoice_create", target: "merchant", ms: "9ms", lights: [0, 1, 2] },
  { fn: "icrc2_approve", target: "wallet", ms: "12ms", lights: [3, 4, 6] },
  { fn: "icrc1_transfer", target: "ckbtc-ledger", ms: "38ms", lights: [5, 7, 8] },
  { fn: "settle_receipt", target: "browser", ms: "4ms", lights: [9, 10, 11, 12, 13] },
] as const;

const mono = (size: number) => ({
  fontFamily: "var(--font-mono)",
  fontSize: size,
});

/** The right column shows that checkout processing, then its result. */
export function HeroRun({ step, onRetry }: { step: number; onRetry: () => void }) {
  const done = step >= STEPS.length;
  return (
    <div
      className="b3-scan site-hero-run"
      style={{
        position: "relative",
        background: "var(--ink-050)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          height: 40,
          padding: "0 14px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <span
          style={{
            ...mono(10),
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Checkout — order 4821 · 2 seats
        </span>
        <Badge color={done ? "success" : "warning"} size="xs" dot>
          {done ? "Paid" : "Running"}
        </Badge>
      </div>

      <div style={{ padding: "16px 16px 14px" }}>
        <h2 className="b3-eyebrow" style={{ margin: "0 0 12px" }}>
          Processing
        </h2>
        <div style={{ display: "flex", flexDirection: "column" }} aria-live="polite">
          {STEPS.map((s, i) => {
            const ran = step > i;
            const active = step === i + 1;
            return (
              <div
                key={s.fn}
                style={{
                  display: "grid",
                  gridTemplateColumns: "12px minmax(0,1fr) auto auto",
                  gap: 10,
                  alignItems: "center",
                  padding: "8px 0",
                  borderTop: i ? "1px solid var(--border)" : 0,
                  opacity: ran ? 1 : 0.34,
                  transition: "opacity var(--dur-slow) var(--ease-dock)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 9999,
                    background: ran ? "var(--success)" : "var(--ink-500)",
                    boxShadow: active ? "0 0 8px 1px var(--success)" : "none",
                    justifySelf: "center",
                  }}
                />
                <span
                  style={{
                    ...mono(12),
                    color: "var(--foreground)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.fn}
                </span>
                <span style={{ ...mono(10), color: "var(--muted-foreground)" }}>
                  {s.target}
                </span>
                <span
                  style={{
                    ...mono(10),
                    color: ran ? "var(--success)" : "var(--muted-foreground)",
                    minWidth: 34,
                    textAlign: "right",
                  }}
                >
                  {ran ? s.ms : "—"}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0 12px" }}>
          <h2 className="b3-eyebrow" style={{ margin: 0 }}>
            Result
          </h2>
          <hr className="b3-rule-hot" style={{ flex: 1 }} />
        </div>
        <div
          style={{
            border:
              "1px solid " +
              (done ? "color-mix(in srgb,var(--success) 45%,transparent)" : "var(--border)"),
            background: done ? "color-mix(in srgb,var(--success) 8%,transparent)" : "transparent",
            padding: "14px",
            transition:
              "border-color var(--dur-slow) var(--ease-out), background-color var(--dur-slow) var(--ease-out)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span
              className="b3-display"
              style={{
                fontSize: 30,
                fontVariantNumeric: "tabular-nums",
                // --ink-500 is 2.25:1 on --ink-050 — under AA even at 30px.
                color: done ? "var(--foreground)" : "var(--muted-foreground)",
                transition: "color var(--dur-slow) var(--ease-out)",
              }}
            >
              {done ? "0.0241" : "0.0000"}{" "}
              <span
                style={{
                  ...mono(13),
                  fontWeight: 400,
                  letterSpacing: 0,
                  color: "var(--muted-foreground)",
                }}
              >
                ckBTC
              </span>
            </span>
            <span
              style={{
                ...mono(10),
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: done ? "var(--success)" : "var(--muted-foreground)",
              }}
            >
              {done ? "Settled" : "Pending"}
            </span>
          </div>
          <div style={{ ...mono(10), color: "var(--muted-foreground)", marginTop: 8 }}>
            {done
              ? "block 1 284 907 · fee 0.0000021 · payout to merchant"
              : "awaiting settlement"}
          </div>
          <Button
            size="sm"
            fullWidth
            style={{ marginTop: 14 }}
            variant={done ? "outlined" : "filled"}
            color={done ? "secondary" : "primary"}
            isLoading={step > 0 && !done}
            icon={IconOf(done ? "RotateCcw" : "Zap")}
            onClick={done ? onRetry : undefined}
          >
            {done ? "Run it again" : "Pay 0.0241 ckBTC"}
          </Button>
        </div>
      </div>
    </div>
  );
}
