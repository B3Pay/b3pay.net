import { registerIcons } from "@b3pay/ui";
import { Hash } from "lucide-react";

/**
 * The one glyph the docs need that b3pay.net did not, plus a single import site
 * for the ones the design system already knows about.
 *
 * `registerIcons` is the design system's documented extension point, and calling
 * it here — rather than importing from `lucide-react` at each use site — keeps
 * `<Icon name="Hash" />` working alongside the component-prop form.
 *
 * Every module that resolves an icon by name imports from this file, so this
 * call is guaranteed to have run first: `IconOf` caches its lookups, and a name
 * resolved before registration would stay resolved to the fallback.
 */
registerIcons({ Hash });

export { Hash };
export {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  FileText,
  Github,
  Menu,
  MessageSquare,
  Pencil,
  Search,
  TriangleAlert,
} from "lucide-react";
