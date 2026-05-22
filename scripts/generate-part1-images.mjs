#!/usr/bin/env node
/**
 * OpenAI gpt-image-1 を使って TOEIC Part 1 用の写真を一括生成し、
 * public/images/toeic/p1-N.png として保存する。
 *
 * 使い方:
 *   OPENAI_API_KEY=sk-... node scripts/generate-part1-images.mjs
 *
 * オプション:
 *   --force         既存ファイルがあっても再生成する
 *   --part p1-3     特定の問題だけ生成する (id 完全一致)
 *   --size 1024x1024 サイズを指定 (デフォルト 1024x1024)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "toeic");
const QUESTIONS_FILE = path.join(ROOT, "src", "data", "toeic-questions.ts");

const args = process.argv.slice(2);
const force = args.includes("--force");
const partArgIdx = args.indexOf("--part");
const partFilter = partArgIdx >= 0 ? args[partArgIdx + 1] : null;
const sizeArgIdx = args.indexOf("--size");
const size = sizeArgIdx >= 0 ? args[sizeArgIdx + 1] : "1024x1024";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY 環境変数を設定してください。");
  console.error("例: OPENAI_API_KEY=sk-... node scripts/generate-part1-images.mjs");
  process.exit(1);
}

/**
 * toeic-questions.ts から Part 1 の { id, photoPrompt, photoCaption } を抜き出す。
 * 簡易パーサ: id/part/photoPrompt の3フィールドだけを正規表現で取得。
 */
async function loadPart1Questions() {
  const src = await fs.readFile(QUESTIONS_FILE, "utf8");
  const items = [];
  const blockRe = /\{[\s\S]*?\}/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const block = m[0];
    const idMatch = /id:\s*"([^"]+)"/.exec(block);
    const partMatch = /part:\s*"([^"]+)"/.exec(block);
    const promptMatch = /photoPrompt:\s*"((?:\\"|[^"])*)"/.exec(block);
    const captionMatch = /photoCaption:\s*"((?:\\"|[^"])*)"/.exec(block);
    if (!idMatch || !partMatch) continue;
    if (partMatch[1] !== "part1") continue;
    if (!promptMatch && !captionMatch) continue;
    items.push({
      id: idMatch[1],
      photoPrompt: promptMatch ? promptMatch[1].replace(/\\"/g, '"') : null,
      photoCaption: captionMatch ? captionMatch[1].replace(/\\"/g, '"') : null,
    });
  }
  return items;
}

async function generateOne(item) {
  const outFile = path.join(OUT_DIR, `${item.id}.png`);
  if (!force) {
    try {
      await fs.access(outFile);
      console.log(`[skip] ${item.id}: ${outFile} (既存ファイル、--force で上書き)`);
      return { id: item.id, status: "skipped" };
    } catch {
      // 存在しない -> 生成へ
    }
  }

  const prompt = item.photoPrompt ?? item.photoCaption;
  const wrapped = `Realistic photograph for TOEIC Part 1 listening practice. Clear, well-lit, professional looking. ${prompt}. No text, no captions, no watermarks, no logos.`;

  console.log(`[gen ] ${item.id}: ${prompt.slice(0, 80)}...`);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: wrapped,
      size,
      n: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[err ] ${item.id}: ${res.status} ${text.slice(0, 200)}`);
    return { id: item.id, status: "error", error: text };
  }

  const data = await res.json();
  const first = data.data?.[0];
  if (!first) {
    console.error(`[err ] ${item.id}: no image returned`);
    return { id: item.id, status: "error", error: "empty" };
  }

  let buffer;
  if (first.b64_json) {
    buffer = Buffer.from(first.b64_json, "base64");
  } else if (first.url) {
    const imgRes = await fetch(first.url);
    if (!imgRes.ok) {
      console.error(`[err ] ${item.id}: failed to download from URL`);
      return { id: item.id, status: "error", error: "download" };
    }
    buffer = Buffer.from(await imgRes.arrayBuffer());
  } else {
    return { id: item.id, status: "error", error: "no format" };
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(outFile, buffer);
  console.log(`[done] ${item.id}: ${outFile} (${(buffer.length / 1024).toFixed(0)} KB)`);
  return { id: item.id, status: "ok", path: outFile };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let items = await loadPart1Questions();
  if (partFilter) {
    items = items.filter((it) => it.id === partFilter);
    if (items.length === 0) {
      console.error(`--part ${partFilter} に一致する問題がありません`);
      process.exit(1);
    }
  }

  console.log(`対象: ${items.length} 問 (size=${size}, force=${force})`);
  console.log("");

  const results = [];
  for (const item of items) {
    const r = await generateOne(item);
    results.push(r);
    // レート制御 (1秒間隔)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("");
  console.log("==== 結果 ====");
  const ok = results.filter((r) => r.status === "ok").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const err = results.filter((r) => r.status === "error").length;
  console.log(`生成: ${ok}, スキップ: ${skipped}, エラー: ${err}`);
  if (err > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
