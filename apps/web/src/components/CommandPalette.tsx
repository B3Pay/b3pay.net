import { Command, IconOf } from "@b3pay/ui";
import { useNavigate } from "react-router-dom";

import { GITHUB_ORG } from "../site/products";
import { ROUTES } from "../site/routes";

const PACKAGES = [
  {
    label: "@ic-reactor/react",
    hint: "npm",
    href: "https://www.npmjs.com/package/@ic-reactor/react",
  },
  {
    label: "@ic-reactor/core",
    hint: "npm",
    href: "https://www.npmjs.com/package/@ic-reactor/core",
  },
  { label: "b3_utils", hint: "crates.io", href: "https://docs.rs/b3_utils" },
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <Command
      onClose={onClose}
      placeholder="Search products, packages and docs…"
      groups={[
        {
          label: "Pages",
          items: ROUTES.map((r) => ({
            label: r.label,
            icon: IconOf("FileText"),
            onSelect: () => navigate(r.path),
          })),
        },
        {
          label: "Organisation",
          items: [
            {
              label: "GitHub",
              hint: "github.com/B3Pay",
              icon: IconOf("Github"),
              onSelect: () => window.open(GITHUB_ORG, "_blank", "noreferrer"),
            },
          ],
        },
        {
          label: "Packages",
          items: PACKAGES.map((p) => ({
            label: p.label,
            hint: p.hint,
            icon: IconOf("Package"),
            onSelect: () => window.open(p.href, "_blank", "noreferrer"),
          })),
        },
      ]}
    />
  );
}
