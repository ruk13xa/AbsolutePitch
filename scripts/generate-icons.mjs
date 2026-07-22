// One-off script to regenerate public/icons/*.png from the app icon design.
// Requires `sharp` (not a project dependency): `npm install -D sharp` first,
// then `node scripts/generate-icons.mjs`.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const baseSvg = (size, pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" />
  <g transform="translate(${pad},${pad}) scale(${(size - pad * 2) / 64})">
    <path
      fill="#ffffff"
      d="M42 12v26.17A9 9 0 1 0 46 46V20.83l-14 3.5v20.84A9 9 0 1 0 36 53V19.5z"
    />
  </g>
</svg>
`;

const targets = [
  { file: "icon-192.png", size: 192, pad: 20 },
  { file: "icon-512.png", size: 512, pad: 53 },
  { file: "maskable-192.png", size: 192, pad: 38 },
  { file: "maskable-512.png", size: 512, pad: 102 },
];

for (const { file, size, pad } of targets) {
  await sharp(Buffer.from(baseSvg(size, pad)))
    .png()
    .toFile(`public/icons/${file}`);
  console.log("wrote", file);
}
