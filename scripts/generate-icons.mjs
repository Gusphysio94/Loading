import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const out = join(root, "public", "icons");
mkdirSync(out, { recursive: true });

const baseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5470"/>
      <stop offset="50%" stop-color="#F04EA0"/>
      <stop offset="100%" stop-color="#A64BFF"/>
    </linearGradient>
    <radialGradient id="bg" cx="50%" cy="0%" r="100%">
      <stop offset="0%" stop-color="#1a1130"/>
      <stop offset="100%" stop-color="#0a0a14"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="url(#g)" stroke-width="40" stroke-linecap="round" stroke-dasharray="500 800" transform="rotate(-90 256 256)"/>
  <circle cx="256" cy="256" r="32" fill="url(#g)"/>
</svg>
`;

const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5470"/>
      <stop offset="50%" stop-color="#F04EA0"/>
      <stop offset="100%" stop-color="#A64BFF"/>
    </linearGradient>
    <radialGradient id="bg" cx="50%" cy="0%" r="100%">
      <stop offset="0%" stop-color="#1a1130"/>
      <stop offset="100%" stop-color="#0a0a14"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="100" fill="none" stroke="url(#g)" stroke-width="32" stroke-linecap="round" stroke-dasharray="360 600" transform="rotate(-90 256 256)"/>
  <circle cx="256" cy="256" r="22" fill="url(#g)"/>
</svg>
`;

const targets = [
  { svg: baseSvg, size: 192, name: "icon-192.png" },
  { svg: baseSvg, size: 512, name: "icon-512.png" },
  { svg: maskableSvg, size: 512, name: "icon-512-maskable.png" },
];

for (const t of targets) {
  const buffer = await sharp(Buffer.from(t.svg))
    .resize(t.size, t.size)
    .png()
    .toBuffer();
  writeFileSync(join(out, t.name), buffer);
  console.log("wrote", t.name);
}
