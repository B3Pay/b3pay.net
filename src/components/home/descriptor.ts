/**
 * The descriptor excerpt the home page shows, printed from APPROVE_FORMAT
 * itself so the page can never show a different file than the one the hero
 * reads. Each line carries the part of the display it produces, so the page
 * can light the lines that make one field: 1 is the intent, 2 the spender,
 * 3 the amount, and 0 is structure.
 *
 * The layout is JSON with two spaces, except that a list of plain values
 * stays on one line. scripts/home-calldata.test.mjs parses it back.
 */
import { APPROVE_FORMAT } from "./calldata.ts";

export interface Line {
  /** Two spaces per level. */
  indent: number;
  /** The line, without its indent. */
  text: string;
  beat: 0 | 1 | 2 | 3;
}

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const scalar = (value: Json) => value === null || typeof value !== "object";

export function formatLines(): Line[] {
  const lines: Line[] = [];

  // Writes `value` starting on the current line (which already holds `head`),
  // then any lines it needs, the last one ending with `tail`.
  const write = (head: string, value: Json, tail: string, indent: number, beat: Line["beat"]) => {
    if (scalar(value) || (Array.isArray(value) && value.every(scalar))) {
      const inline = Array.isArray(value)
        ? `[${value.map((v) => JSON.stringify(v)).join(", ")}]`
        : JSON.stringify(value);
      lines.push({ indent, text: `${head}${inline}${tail}`, beat });
      return;
    }
    const entries: [string | null, Json][] = Array.isArray(value)
      ? value.map((item) => [null, item])
      : Object.entries(value);
    const [open, close] = Array.isArray(value) ? ["[", "]"] : ["{", "}"];
    lines.push({ indent, text: `${head}${open}`, beat });
    entries.forEach(([key, item], i) => {
      const comma = i < entries.length - 1 ? "," : "";
      write(key === null ? "" : `${JSON.stringify(key)}: `, item, comma, indent + 1, beatOf(beat, key, item));
    });
    lines.push({ indent, text: `${close}${tail}`, beat });
  };

  // Inside the format: the key and `intent` make the title, and each field
  // object makes its row.
  const beatOf = (parent: Line["beat"], key: string | null, item: Json): Line["beat"] => {
    if (parent !== 0) return parent;
    if (key === "intent") return 1;
    if (key === null && item && typeof item === "object" && !Array.isArray(item)) {
      if (item.path === "#.spender") return 2;
      if (item.path === "#.value") return 3;
    }
    return 0;
  };

  const [[signature, format]] = Object.entries(APPROVE_FORMAT) as unknown as [[string, Json]];
  write(`${JSON.stringify(signature)}: `, format, "", 0, 0);
  // The signature line names the function, which is the title's job too.
  lines[0]!.beat = 1;
  return lines;
}
