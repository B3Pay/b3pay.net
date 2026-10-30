/**
 * A reader for the tar archives GitHub serves for a commit or a branch: ustar
 * headers, a pax global header whose `comment` is the commit id, and pax
 * extended headers for paths longer than the ustar fields hold.
 *
 * It only reads. Writing files is `archive.mjs`'s job, after it has decided
 * which entries a module may contain.
 */
import { gunzipSync } from "node:zlib";

const BLOCK = 512;

function text(header, offset, length) {
  const slice = header.subarray(offset, offset + length);
  const end = slice.indexOf(0);
  return slice.subarray(0, end === -1 ? length : end).toString("utf8");
}

function number(header, offset, length) {
  const digits = text(header, offset, length).trim();
  if (digits === "") return 0;
  if (!/^[0-7]+$/.test(digits)) throw new Error(`tar: unreadable number field "${digits}"`);
  return Number.parseInt(digits, 8);
}

/** `<length> <key>=<value>\n` records, as POSIX pax defines them. */
export function parsePax(body) {
  const records = {};
  let at = 0;
  while (at < body.length) {
    const space = body.indexOf(0x20, at);
    if (space === -1) throw new Error("tar: pax record without a length");
    const length = Number.parseInt(body.subarray(at, space).toString("ascii"), 10);
    if (!Number.isInteger(length) || length <= space - at || at + length > body.length)
      throw new Error("tar: pax record length out of range");
    const record = body.subarray(space + 1, at + length - 1).toString("utf8");
    const equals = record.indexOf("=");
    if (equals < 1) throw new Error(`tar: pax record without a key: "${record}"`);
    records[record.slice(0, equals)] = record.slice(equals + 1);
    at += length;
  }
  return records;
}

/**
 * @param {Buffer} gzipped a .tar.gz
 * @returns {{ global: Record<string, string>, entries: { path: string, type: string, data: Buffer | null }[] }}
 *   `type` is the ustar typeflag: "0" a file, "5" a directory, "2" a symlink.
 */
export function readTar(gzipped) {
  const archive = gunzipSync(gzipped);
  const entries = [];
  let global = {};
  let extended = {};
  let offset = 0;

  while (offset + BLOCK <= archive.length) {
    const header = archive.subarray(offset, offset + BLOCK);
    if (header.every((byte) => byte === 0)) break;

    let sum = 0;
    for (let i = 0; i < BLOCK; i++) sum += i >= 148 && i < 156 ? 0x20 : header[i];
    if (sum !== number(header, 148, 8)) throw new Error(`tar: header checksum mismatch at byte ${offset}`);

    const size = number(header, 124, 12);
    const type = header[156] === 0 ? "0" : String.fromCharCode(header[156]);
    const body = archive.subarray(offset + BLOCK, offset + BLOCK + size);
    if (body.length !== size) throw new Error("tar: archive ends inside an entry");
    offset += BLOCK + Math.ceil(size / BLOCK) * BLOCK;

    if (type === "g") {
      global = { ...global, ...parsePax(body) };
      continue;
    }
    if (type === "x") {
      extended = parsePax(body);
      continue;
    }

    const prefix = text(header, 345, 155);
    const name = text(header, 0, 100);
    const path = extended.path ?? (prefix ? `${prefix}/${name}` : name);
    extended = {};
    entries.push({ path, type, data: type === "0" ? Buffer.from(body) : null });
  }

  return { global, entries };
}
