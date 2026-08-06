import { Badge, Button, Icon, IconOf } from "@b3pay/ui";

/**
 * One checkout, priced in dollars and paid in Bitcoin. The buyer only ever
 * holds BTC; the ckBTC minter turns their on-chain deposit into ckBTC, and the
 * checkout is settled with that. Nine calls, because that is what a payment
 * this shape costs — the panel is worth nothing if it pretends otherwise.
 *
 * The calls that flow actually makes:
 *   get_exchange_rate  the Exchange Rate Canister. A cart priced in USD has to
 *                      be quoted in BTC before anything can be charged.
 *   invoice_create     B3Pay's own; the merchant gets an invoice to settle.
 *   get_btc_address    ckBTC minter — a deposit address derived per account
 *                      with threshold ECDSA. The buyer sends BTC to it.
 *   bitcoin_get_utxos  the minter reads the Bitcoin network through the
 *                      management canister and waits out `min_confirmations`
 *                      (6 on mainnet — the one step here measured in blocks).
 *   check_transaction  the Bitcoin checker canister screens those UTXOs. The
 *                      minter will not mint against a deposit that fails it.
 *   update_balance     the minter mints ckBTC on the ledger against the
 *                      screened UTXOs, less its check fee.
 *   icrc2_approve      the buyer approves the merchant canister as spender.
 *   icrc2_transfer_from the merchant pulls the approved amount. Approve pairs
 *                      with transfer_from — a plain icrc1_transfer would not
 *                      use the allowance at all.
 *   settle_receipt     B3Pay's own call; the browser gets the receipt.
 *
 * Each step declares which nodes it lights in the background topology.
 * `refund` and `dispute` are never in `lights` — a payment that goes right
 * leaves both dark, and that is the point of showing them.
 */
export const STEPS = [
  { fn: "get_exchange_rate", target: "rate-oracle", ms: "1.4s", phase: "quote", lights: [5] },
  { fn: "invoice_create", target: "merchant", ms: "9ms", phase: "quote", lights: [0, 1, 2] },
  { fn: "get_btc_address", target: "ckbtc-minter", ms: "11ms", phase: "mint", lights: [16] },
  { fn: "bitcoin_get_utxos", target: "btc-network", ms: "6 conf", phase: "mint", lights: [15] },
  { fn: "check_transaction", target: "btc-checker", ms: "240ms", phase: "mint", lights: [17, 4] },
  { fn: "update_balance", target: "ckbtc-minter", ms: "2.1s", phase: "mint", lights: [7, 18] },
  { fn: "icrc2_approve", target: "wallet", ms: "12ms", phase: "pay", lights: [3, 6] },
  { fn: "icrc2_transfer_from", target: "ckbtc-ledger", ms: "38ms", phase: "pay", lights: [8, 9] },
  { fn: "settle_receipt", target: "browser", ms: "4ms", phase: "pay", lights: [10, 11, 12, 13, 19] },
] as const;

/** The three acts: price the order, acquire the ckBTC, then spend it. */
const PHASES = [
  { key: "quote", title: "Quote" },
  { key: "mint", title: "Mint" },
  { key: "pay", title: "Pay" },
] as const;

/**
 * The money. $1 784.17 at 74 032.10 is 0.0241 BTC, ckBTC is 1:1 with that, and
 * the ckBTC ledger takes 10 satoshi to move it — so the merchant nets
 * 0.02409990. Every figure the panel prints comes from these four.
 */
export const AMOUNT = "0.0241";
const FIAT = "$1 784.17";
const RATE = "74 032.10";
const SUBTOTAL = "0.02410000";
const LEDGER_FEE = "0.00000010";
const MERCHANT_NET = "0.02409990";
/**
 * Truncated the way the minter's address is shown in a real checkout. Kept
 * short enough that `bc1q…f8k3 · 6/6 conf` still fits the leg at 390px.
 */
const DEPOSIT_ADDRESS = "bc1q…f8k3";

/** The step index each part of the panel switches on at. */
const QUOTED_AT = 1; // get_exchange_rate returned — the cart has a BTC price
const BTC_AT = 3; // get_btc_address returned — the deposit address exists
const CONFIRMED_AT = 4; // bitcoin_get_utxos saw min_confirmations
const SCREENED_AT = 5; // check_transaction cleared the UTXOs
const MINTED_AT = 6; // update_balance settled — ckBTC is on the ledger

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
  const quoted = step >= QUOTED_AT;
  const btcIn = step >= BTC_AT;
  const minted = step >= MINTED_AT;
  const deposit = !btcIn
    ? "awaiting deposit address"
    : `${DEPOSIT_ADDRESS} · ${step >= CONFIRMED_AT ? "6/6" : "0/6"} conf`;
  // The screening verdict rides the ckBTC leg — the BTC leg has no room for it
  // at 390px, and it is the minter's answer anyway, not the deposit's.
  const mint = minted
    ? "minted · ckbtc-ledger"
    : step >= SCREENED_AT
      ? "utxos clean · minting"
      : "awaiting mint";

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
          Order 4821 · 2 × b3forge seat
        </span>
        <Badge color={done ? "success" : "warning"} size="xs" dot>
          {done ? "Paid" : "Running"}
        </Badge>
      </div>

      {/* The cart is priced in dollars. Everything below is downstream of the
          rate that converts it, so the rate is stated before any of it. */}
      <div
        style={{
          ...mono(10),
          display: "flex",
          flexWrap: "wrap",
          gap: "2px 8px",
          padding: "9px 16px",
          color: "var(--muted-foreground)",
          borderBottom: "1px solid var(--border)",
          background: "color-mix(in srgb,var(--card) 55%,transparent)",
        }}
      >
        {quoted ? (
          <>
            <span style={{ color: "var(--foreground)" }}>{FIAT} USD</span>
            <span>· BTC/USD {RATE}</span>
            <span>· quote locked 15:00</span>
          </>
        ) : (
          <span>pricing order · awaiting rate</span>
        )}
      </div>

      {/* The buyer pays in BTC and the merchant is settled in ckBTC. That
          conversion is the first thing the panel says, before any call runs. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
          gap: 12,
          alignItems: "center",
          padding: "10px 16px",
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
          note={mint}
        />
      </div>

      <div style={{ padding: "12px 16px" }}>
        {PHASES.map((p, pi) => (
          <div key={p.key} style={{ marginTop: pi ? 13 : 0 }}>
            <h2 className="b3-eyebrow" style={{ margin: "0 0 6px" }}>
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
                        padding: "6px 0",
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

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "14px 0 10px" }}>
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
            padding: "12px 14px",
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
          {/* What the merchant actually banks, which is not what the buyer
              paid. A receipt that hides the fee is not a receipt. */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: 8,
              margin: "10px 0 9px",
              paddingTop: 9,
              borderTop: "1px solid var(--border)",
            }}
          >
            {[
              ["Subtotal", SUBTOTAL, "left"],
              ["Ledger fee", LEDGER_FEE, "center"],
              ["Net", MERCHANT_NET, "right"],
            ].map(([label, value, align]) => (
              <div key={label} style={{ minWidth: 0, textAlign: align as "left" }}>
                <div className="b3-eyebrow">{label}</div>
                <div
                  style={{
                    ...mono(11),
                    marginTop: 3,
                    fontVariantNumeric: "tabular-nums",
                    color: done ? "var(--foreground)" : "var(--muted-foreground)",
                    transition: "color var(--dur-slow) var(--ease-out)",
                  }}
                >
                  {done ? value : "—"}
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...mono(10), color: "var(--muted-foreground)" }}>
            {done
              ? "block 1 284 907 · index 4 918 220 · payout to merchant"
              : "awaiting settlement"}
          </div>
          <Button
            size="sm"
            fullWidth
            style={{ marginTop: 12 }}
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
