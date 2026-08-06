import { Button, IconOf } from "@b3pay/ui";
import { useNavigate } from "react-router-dom";

import { Section } from "../site/furniture";
import { linkProps } from "../lib/router-link";
import { useSeo } from "../lib/seo";

export default function NotFound() {
  const navigate = useNavigate();
  useSeo({
    title: "Page not found — B3Pay",
    description: "That page does not exist on b3pay.net.",
    path: "/404",
  });

  return (
    <Section
      as="h1"
      eyebrow="404"
      title="That page does not exist."
      lead="The route is not one of the six this site serves. Everything B3Pay ships is listed under Products."
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button variant="outlined" {...linkProps(navigate, "/")} icon={IconOf("ArrowLeft")}>
          Back to home
        </Button>
        <Button variant="ghost" {...linkProps(navigate, "/products")}>
          Products
        </Button>
      </div>
    </Section>
  );
}
