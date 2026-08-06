import { Command, type CommandGroup } from "@b3pay/ui";
import { useNavigate } from "react-router-dom";

import { PAGES, type DocPage } from "../content/pages";
import { Box, FileText, Hash } from "../lib/icons";

/**
 * ⌘K across every page of every project.
 *
 * The index is the route table plus the headings each page exported at build
 * time — no separate search build step, and nothing to fall out of sync. It is
 * a prefix/substring match rather than full text: at this corpus size a fuzzy
 * ranker would add a dependency and a worse first result.
 *
 * `Command` filters on `label`, so a heading's own text has to be the label and
 * the page it belongs to goes in the hint.
 */
export function DocsPalette({
  current,
  onClose,
}: {
  /** The page being read — its headings are offered first. */
  current?: DocPage;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const go = (path: string) => () => {
    navigate(path);
    onClose();
  };

  const groups: CommandGroup[] = [];

  if (current && current.toc.length) {
    groups.push({
      label: "On this page",
      items: current.toc.map((t) => ({
        label: t.text,
        hint: current.title,
        icon: Hash,
        onSelect: go(`${current.path}#${t.id}`),
      })),
    });
  }

  if (current) {
    const siblings = PAGES.filter(
      (p) => p.project.key === current.project.key && p.path !== current.path,
    );
    if (siblings.length) {
      groups.push({
        label: current.project.name,
        items: siblings.map((p) => ({
          label: p.title,
          hint: p.section,
          icon: FileText,
          onSelect: go(p.path),
        })),
      });
    }
  }

  const rest = PAGES.filter((p) => !current || p.project.key !== current.project.key);
  if (rest.length) {
    groups.push({
      label: current ? "Other projects" : "All projects",
      items: rest.map((p) => ({
        label: p.title,
        hint: p.project.name,
        icon: Box,
        onSelect: go(p.path),
      })),
    });
  }

  return <Command onClose={onClose} placeholder="Search the documentation…" groups={groups} />;
}
