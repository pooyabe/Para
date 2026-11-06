#!/usr/bin/env node
/**
 * Applies small, explicit fixes to dependencies that ship unbundled sources and
 * contain code React Native 0.86 no longer supports. Metro bundles those files
 * as-is, so the project cannot correct them from its own code.
 *
 * Each patch is a precise text replacement with an idempotency check. If a
 * dependency changes in a way the patch no longer recognises, the install fails
 * with an explanation instead of silently shipping the warning again.
 */
const fs = require("fs");
const path = require("path");

const modulesRoot = path.join(__dirname, "..", "node_modules");

const PATCHES = [
  {
    // The New Architecture ignores setLayoutAnimationEnabledExperimental and
    // warns about it. The call only existed to enable LayoutAnimation on the
    // legacy Android architecture, so dropping it is a no-op on current React
    // Native versions.
    name: "@mohamadkh75/react-native-jalali-datepicker",
    file: path.join(
      modulesRoot,
      "@mohamadkh75",
      "react-native-jalali-datepicker",
      "src",
      "index.js",
    ),
    isApplied: (source) =>
      !source.includes("setLayoutAnimationEnabledExperimental"),
    apply: (source) => {
      const layoutAnimationSetup =
        /[ \t]*if \(Platform\.OS === 'android'\) \{\r?\n[ \t]*UIManager\.setLayoutAnimationEnabledExperimental &&\r?\n[ \t]*UIManager\.setLayoutAnimationEnabledExperimental\(true\);\r?\n[ \t]*\}\r?\n\r?\n/;

      if (!layoutAnimationSetup.test(source)) {
        return null;
      }

      return source.replace(layoutAnimationSetup, "");
    },
  },
];

let failed = false;

for (const patch of PATCHES) {
  const label = `[patch-dependencies] ${patch.name}`;

  if (!fs.existsSync(patch.file)) {
    console.log(`${label}: not installed, skipping.`);
    continue;
  }

  const source = fs.readFileSync(patch.file, "utf8");

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

  fs.writeFileSync(patch.file, patched);
  console.log(`${label}: patched.`);
}

if (failed) {
  process.exit(1);
}
