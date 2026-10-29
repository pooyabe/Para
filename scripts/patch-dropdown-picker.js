#!/usr/bin/env node
/**
 * react-native-dropdown-picker imports `SafeAreaView` from "react-native".
 * React Native 0.86 deprecated that export and logs a warning whenever the
 * component renders, asking developers to use "react-native-safe-area-context"
 * instead. The package ships its sources (no compiled output), so Metro bundles
 * the import as-is and the project cannot change it from its own code.
 *
 * This postinstall step redirects that single import to the recommended
 * package. It is idempotent and safe to run repeatedly.
 */
const fs = require("fs");
const path = require("path");

const pickerPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native-dropdown-picker",
  "src",
  "components",
  "Picker.js",
);

const reactNativeImportEntry = "    View,\n    SafeAreaView,\n";
const safeAreaContextImport =
  "import { SafeAreaView } from 'react-native-safe-area-context';\n";
const reactNativeImportEnd = "} from 'react-native';\n";

if (!fs.existsSync(pickerPath)) {
  // Dependency not installed (yet); nothing to patch.
  console.log("[patch-dropdown-picker] react-native-dropdown-picker is absent, skipping.");
  process.exit(0);
}

const source = fs.readFileSync(pickerPath, "utf8");

if (source.includes(safeAreaContextImport)) {
  console.log("[patch-dropdown-picker] Already patched.");
  process.exit(0);
}

if (!source.includes(reactNativeImportEntry) || !source.includes(reactNativeImportEnd)) {
  // Upstream changed shape (new version or manual edit): do not guess.
  console.warn(
    "[patch-dropdown-picker] Unexpected Picker.js contents; SafeAreaView import was NOT patched.",
  );
  process.exit(0);
}

const patched = source
  .replace(reactNativeImportEntry, "    View,\n")
  .replace(reactNativeImportEnd, reactNativeImportEnd + safeAreaContextImport);

fs.writeFileSync(pickerPath, patched);
console.log("[patch-dropdown-picker] Patched SafeAreaView import.");
