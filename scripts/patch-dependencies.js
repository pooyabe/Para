#!/usr/bin/env node
/**
 * Applies small, explicit fixes to dependencies that ship unbundled sources and
 * contain code React Native 0.86 no longer supports, or behaviour this project
 * must correct. Metro bundles those files as-is, so the project cannot correct
 * them from its own code.
 *
 * Each patch is a precise text replacement with an idempotency check. If a
 * dependency changes in a way the patch no longer recognises, the install fails
 * with an explanation instead of silently shipping the warning again.
 */
const fs = require("fs");
const path = require("path");

const modulesRoot = path.join(__dirname, "..", "node_modules");
const datePickerRoot = path.join(modulesRoot, "react-native-ui-datepicker");

const PATCHES = [
  {
    // Year grids list the oldest year first, which reads backwards in a Jalali
    // calendar where users look for the most recent year first. The year range
    // itself is untouched, only the order the cells are rendered in.
    name: "react-native-ui-datepicker (years newest first)",
    files: [
      path.join(datePickerRoot, "src", "components", "years.tsx"),
      path.join(datePickerRoot, "lib", "module", "components", "years.js"),
      path.join(datePickerRoot, "lib", "commonjs", "components", "years.js"),
    ],
    isApplied: (source) => source.includes("[...years].reverse().map("),
    apply: (source) => {
      if (!/const column = years\.map\(/.test(source)) {
        return null;
      }

      return source.replace(
        /const column = years\.map\(/,
        "const column = [...years].reverse().map(",
      );
    },
  },
];

let failed = false;

for (const patch of PATCHES) {
  for (const file of patch.files) {
    const label = `[patch-dependencies] ${patch.name} (${path.relative(
      modulesRoot,
      file,
    )})`;

    if (!fs.existsSync(file)) {
      console.log(`${label}: not found, skipping.`);
      continue;
    }

    const source = fs.readFileSync(file, "utf8");

    if (patch.isApplied(source)) {
      console.log(`${label}: already patched.`);
      continue;
    }

    const patched = patch.apply(source);

    if (patched === null) {
      console.error(
        `${label}: expected code not found. The dependency probably changed.\n` +
          `Check whether it still needs this fix, then update scripts/patch-dependencies.js.`,
      );
      failed = true;
      continue;
    }

    fs.writeFileSync(file, patched);
    console.log(`${label}: patched.`);
  }
}

if (failed) {
  process.exit(1);
}
