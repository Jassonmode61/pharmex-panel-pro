import { promises as fs } from "fs";
import path from "path";
const root = path.resolve(process.cwd(), "data");

export async function ensureFile(file, fallback) {
  const p = path.join(root, file);
  try {
    await fs.access(p);
  } catch {
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(p, JSON.stringify(fallback, null, 2));
  }
  return p;
}

export async function read(file, fallback = []) {
  const p = await ensureFile(file, fallback);
  const txt = await fs.readFile(p, "utf8");
  return JSON.parse(txt || "null");
}

export async function write(file, data) {
  const p = await ensureFile(file, Array.isArray(data) ? [] : {});
  await fs.writeFile(p, JSON.stringify(data, null, 2));
  return data;
}