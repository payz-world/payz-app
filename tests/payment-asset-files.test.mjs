import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const paymentAssetFiles = [
  "ethereum.webp",
  "xaut.svg",
  "ondo-slvon.png",
  "ondo-iauon.png",
  "ondo-mstron.png",
  "ondo-tslaon.png",
  "ondo-googlon.png",
  "ondo-aaplon.png",
  "solana.svg",
  "xstocks-googlx.png",
  "xstocks-spcxx.png",
  "xstocks-aaplx.png",
  "xstocks-spyx.png",
  "xstocks-tslax.png",
  "bnb-chain.svg",
  "base.svg",
  "robinhood-network.png",
  "nvidia.svg",
  "spdr-spy.png",
];

test("payment network and asset logos are present in the app's public assets", () => {
  for (const assetFile of paymentAssetFiles) {
    assert.ok(
      existsSync(path.resolve(appRoot, "public", "payment-assets", assetFile)),
      `Missing payment asset: ${assetFile}`,
    );
  }
});
