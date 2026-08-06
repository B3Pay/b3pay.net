import { useEffect, useMemo, useState } from "react";
import { Button, IconOf } from "@b3pay/ui";
import { useNavigate } from "react-router-dom";

import { HeroRun, STEPS } from "./HeroRun";
import { NodeField } from "./NodeField";
import { GITHUB_ORG } from "../../site/products";
import { linkProps } from "../../lib/router-link";
import { usePrefersReducedMotion } from "../../lib/use-reduced-motion";

const STAT_STRIP: [string, string][] = [
  ["03", "chains"],
  ["04", "projects"],
  ["07", "packages"],
  ["MIT", "licence"],
];

export function Hero() {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  // Runs once per `run`, then stops at Settled and waits for "Run it again".
  useEffect(() => {
    if (reduced) {
      setStep(STEPS.length);
      return;
    }
    setStep(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= STEPS.length) clearInterval(t);
    }, 1100);
    return () => clearInterval(t);
  }, [run, reduced]);

  const active = useMemo(() => {
    const s = new Set<number>();
    STEPS.slice(0, step).forEach((st) => st.lights.forEach((n) => s.add(n)));
    return s;
  }, [step]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="b3-colgrid" />
      <NodeField active={active} />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--heat-glow)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 2,
          background: "var(--gradient-brand)",
          animation: "b3-glow-breathe 4s var(--ease-in-out) infinite",
        }}
      />
      <span className="b3-spine" aria-hidden>
        B3PAY / ORG / EST 2023 / INTERNET COMPUTER
      </span>
      <span className="b3-tick b3-tick--hot" style={{ left: 18, top: 18 }} />
      <span className="b3-tick" style={{ right: 18, top: 18 }} />

      <div
        className="site-grid-hero"
        style={{
          position: "relative",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "116px 24px 56px",
        }}
      >
        <div className="site-hero-copy">
          <p
            className="b3-eyebrow"
            style={{ display: "flex", alignItems: "center", gap: 10, margin: 0 }}
          >
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: 9999,
                background: "var(--forge-500)",
                boxShadow: "var(--glow-forge-sm)",
              }}
            />
            Open source · Internet Computer · since 2023
          </p>
          <h1 className="b3-display" style={{ margin: "26px 0 0", fontSize: "clamp(44px, 6.6vw, 92px)" }}>
            Infrastructure for apps that hold their own keys.
          </h1>
          <div style={{ display: "flex", gap: 18, marginTop: 30, alignItems: "flex-start" }}>
            <span
              aria-hidden
              style={{
                width: 40,
                height: 1,
                background: "var(--forge-600)",
                marginTop: 14,
                flex: "none",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 19,
                lineHeight: "30px",
                color: "var(--muted-foreground)",
                maxWidth: 520,
                textWrap: "pretty",
              }}
            >
              B3Pay builds open-source wallets, TypeScript libraries and workflow tooling for
              the Internet Computer. No centralized backend sits between your users and their
              assets.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 38, flexWrap: "wrap" }}>
            <Button
              size="xl"
              variant="filled"
              color="primary"
              bevel
              {...linkProps(navigate, "/developers")}
              iconRight={IconOf("ArrowRight")}
            >
              Start building
            </Button>
            <Button
              size="xl"
              variant="outlined"
              as="a"
              href={GITHUB_ORG}
              target="_blank"
              rel="noreferrer"
              icon={IconOf("Github")}
            >
              View the repos
            </Button>
          </div>
          <div style={{ display: "flex", marginTop: 46, borderTop: "1px solid var(--border)" }}>
            {STAT_STRIP.map(([v, l], i) => (
              <div
                key={l}
                style={{
                  flex: 1,
                  paddingTop: 14,
                  borderRight: i < 3 ? "1px solid var(--border)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                    marginTop: 5,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <HeroRun step={step} onRetry={() => setRun((r) => r + 1)} />
      </div>
    </div>
  );
}
