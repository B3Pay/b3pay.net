/**
 * The wall of calldata behind the hero and the closing band: rows of calls
 * from BACKDROP, two a row, each row starting somewhere else so the calldata
 * reads as a wall rather than a list. Each call carries its sentence, cut
 * after the verb, which a second layer prints where the call's hex begins:
 * both layers are set in the same monospace font and measured in `ch`.
 */
import { BACKDROP, encode } from "./calldata.ts";

/** Space between two calls on a row, in `ch`. */
const GAP = 8;

export interface WallCall {
  hex: string;
  verb: string;
  rest: string;
  /** The call's hex and the gap after it, in `ch`. */
  width: number;
}

/** One row for each indent (in `ch`, negative to start off the left edge), from call `offset` on. */
export function wall(indents: number[], offset = 0): { indent: number; calls: WallCall[] }[] {
  return indents.map((indent, i) => ({
    indent,
    calls: [0, 1].map((k) => {
      const example = BACKDROP[(offset + i * 2 + k) % BACKDROP.length]!;
      const [verb = "", ...rest] = example.says.split(" ");
      const hex = encode(example.call);
      return { hex, verb, rest: rest.join(" "), width: hex.length + GAP };
    }),
  }));
}
