import sharp from "sharp";
import fs from "fs";

const sizes = [96, 192, 512];
const input = "public/logo.svg";

if (!fs.existsSync("public/icons")) fs.mkdirSync("public/icons", { recursive: true });

for (const size of sizes) {
  const output = `public/icons/icon-${size}x${size}.png`;
  await sharp(input)
    .resize(size, size)
    .png()
    .toFile(output);
  console.log(`✅ ${output}`);
}
