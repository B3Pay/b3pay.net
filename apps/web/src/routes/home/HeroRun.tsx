import { Badge, Button, Icon, IconOf } from "@b3pay/ui";

/**
 * One checkout paid in Bitcoin. The buyer only ever holds BTC; the ckBTC minter
 * turns their on-chain deposit into ckBTC, and the checkout is settled with it.
 *
 * These are the calls that flow actually makes:
 *   get_btc_address    ckBTC minter — a deposit address derived per account
 *                      with threshold ECDSA. The buyer sends BTC to it.
 *   bitcoin_get_utxos  the minter reads the Bitcoin network through the
 *                      management canister and waits out `min_confirmations`
 *                      (6 on mainnet — the one step here measured in blocks).
 *   update_balance     the minter KYT-checks the new UTXOs and mints ckBTC 1:1
 *                      on the ledger, minus its check fee.
 *   icrc2_approve      the buyer approves the merchant canister as spender.
 *   icrc2_transfer_from the merchant pulls the approved amount. Approve pairs
 *                      with transfer_from — a plain icrc1_transfer would not
 *                      use the allowance at all.
 *   settle_receipt     B3Pay's own call; the browser gets the receipt.
 *
 * Each step declares which nodes it lights in the background topology.
 * `refund` is never in `lights` — a successful payment leaves that node dark,
 * and that is the point of showing it.
 */
export const STEPS = [
  { fn: "get_btc_address", target: "ckbtc-minter", ms: "9ms", phase: "mint", lights: [0, 2, 16] },
  { fn: "bitcoin_get_utxos", target: "btc-network", ms: "6 conf", phase: "mint", lights: [15] },
  { fn: "update_balance", target: "ckbtc-minter", ms: "2.1s", phase: "mint", lights: [4, 7] },
  { fn: "icrc2_approve", target: "wallet", ms: "12ms", phase: "pay", lights: [3, 6] },
  { fn: "icrc2_transfer_from", target: "ckbtc-ledger", ms: "38ms", phase: "pay", lights: [1, 5, 8] },
  { fn: "settle_receipt", target: "browser", ms: "4ms", phase: "pay", lights: [9, 10, 11, 12, 13] },
] as const;

/** The two halves of the run: acquire the ckBTC, then spend it. */
const PHASES = [
  { key: "mint", title: "Mint" },
  { key: "pay", title: "Pay" },
] as const;

/** Amounts. ckBTC is 1:1 with BTC; the ledger's transfer fee is 10 satoshi. */
export const AMOUNT = "0.0241";
/**
 * Truncated the way the minter's address is shown in a real checkout. Kept
 * short enough that `bc1q…f8k3 · 6/6 conf` still fits the leg at 390px.
 */
const DEPOSIT_ADDRESS = "bc1q…f8k3";

/** The step index each part of the deposit bar switches on at. */
const BTC_AT = 1; // get_btc_address returned — the deposit address exists
const CONFIRMED_AT = 2; // bitcoin_get_utxos saw min_confirmations
const MINTED_AT = 3; // update_balance settled — ckBTC is on the ledger

const mono = (size: number) => ({
  fontFamily: "var(--font-mono)",
  fontSize: size,
});

/** One side of the deposit bar: an amount, its ticker, and a status line. */
function Leg({
  amount,
  ticker,
  note,
  on,
  tone,
  align = "left",
}: {
  amount: string;
  ticker: string;
  note: string;
  on: boolean;
  tone: string;
  align?: "left" | "right";
}) {
  return (
    <div style={{ minWidth: 0, textAlign: align }}>
      <div
        className="b3-display"
        style={{
          fontSize: 20,
          fontVariantNumeric: "tabular-nums",
          color: on ? "var(--foreground)" : "var(--muted-foreground)",
          transition: "color var(--dur-slow) var(--ease-out)",
          whiteSpace: "nowrap",
        }}
      >
        {amount}{" "}
        <span style={{ ...mono(11), fontWeight: 400, letterSpacing: 0, color: on ? tone : "var(--muted-foreground)" }}>
          {ticker}
        </span>
      </div>
      <div
        style={{
          ...mono(10),
          color: "var(--muted-foreground)",
          marginTop: 4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {note}
      </div>
    </div>
  );
}

/** The right column shows that checkout processing, then its result. */
export function HeroRun({ step, onRetry }: { step: number; onRetry: () => void }) {
  const done = step >= STEPS.length;
  const btcIn = step >= BTC_AT;
  const minted = step >= MINTED_AT;
  const deposit = !btcIn
    ? "awaiting deposit address"
    : `${DEPOSIT_ADDRESS} · ${step >= CONFIRMED_AT ? "6/6" : "0/6"} conf`;

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

      {/* The buyer pays in BTC and the merchant is settled in ckBTC. That
          conversion is the first thing the panel says, before any call runs. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
          gap: 12,
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Leg
          amount={AMOUNT}
          ticker="BTC"
          on={btcIn}
          tone="var(--forge-500)"
          note={deposit}
        />
        <Icon
          name="ArrowRight"
          size={15}
          style={{
            color: minted ? "var(--success)" : btcIn ? "var(--forge-500)" : "var(--ink-500)",
            transition: "color var(--dur-slow) var(--ease-out)",
          }}
        />
        <Leg
          amount={AMOUNT}
          ticker="ckBTC"
          on={minted}
          tone="var(--success)"
          align="right"
          note={minted ? "minted · ckbtc-ledger" : "awaiting mint"}
        />
      </div>

      <div style={{ padding: "14px 16px" }}>
        {PHASES.map((p, pi) => (
          <div key={p.key} style={{ marginTop: pi ? 16 : 0 }}>
            <h2 className="b3-eyebrow" style={{ margin: "0 0 8px" }}>
              {p.title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }} aria-live="polite">
              {STEPS.map((s, i) => [s, i] as const)
                .filter(([s]) => s.phase === p.key)
                .map(([s, i], row) => {
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
                        padding: "7px 0",
                        borderTop: row ? "1px solid var(--border)" : 0,
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
                          minWidth: 38,
                          textAlign: "right",
                        }}
                      >
                        {ran ? s.ms : "—"}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

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
              {done ? AMOUNT : "0.0000"}{" "}
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
              ? "block 1 284 907 · fee 0.0000001 · payout to merchant"
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
            {done ? "Run it again" : `Pay ${AMOUNT} BTC`}
          </Button>
        </div>
      </div>
    </div>
  );
}
