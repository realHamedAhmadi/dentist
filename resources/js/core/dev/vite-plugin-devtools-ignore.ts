import type { Plugin } from "vite";
import type { ExistingRawSourceMap } from "rollup";

/**
 * Options for the devtools ignore plugin.
 */
export interface DevtoolsIgnoreOptions {
    /**
     * Patterns used to match files that should be ignored by Chrome DevTools.
     */
    patterns: RegExp[];
}

/**
 * Extended source map type with Chrome DevTools ignore list support.
 */
type SourceMapWithIgnoreList = ExistingRawSourceMap & {
    x_google_ignoreList?: number[];
};

/**
 * Create a non-stateful RegExp for safe repeated `.test()` usage.
 * If the input has `g`/`y`, they are removed to avoid `lastIndex` issues.
 */
function toSafeRegex(input: RegExp): RegExp {
    // Remove stateful flags to keep matching deterministic
    const safeFlags = input.flags.replace(/g|y/g, "");
    return new RegExp(input.source, safeFlags);
}

/**
 * Vite plugin that marks selected modules as ignored in Chrome DevTools
 * by injecting `x_google_ignoreList` into their sourcemaps.
 *
 * Notes:
 * - Runs only in dev mode (`apply: "serve"`).
 * - Preserves existing sourcemaps from previous transforms.
 * - Avoids stateful RegExp pitfalls (`/g` and `/y`).
 */
export default function devtoolsIgnorePlugin(options: DevtoolsIgnoreOptions): Plugin {
    const safePatterns = (options?.patterns ?? []).map(toSafeRegex);

    return {
        name: "vite-plugin-devtools-ignore",
        apply: "serve",
        enforce: "post",

        transform(code, id) {
            // Normalize path separators for cross-platform matching
            const normalizedId = id.replace(/\\/g, "/");

            // Check if this file should be ignored in DevTools
            const shouldIgnore = safePatterns.some((pattern) =>
                pattern.test(normalizedId)
            );

            if (!shouldIgnore) {
                return null;
            }

            // Get the full sourcemap chain up to this point
            const combined = this.getCombinedSourcemap() as SourceMapWithIgnoreList;

            // Build a robust fallback sourcemap if none exists
            const map: SourceMapWithIgnoreList =
                combined && typeof combined === "object" && "version" in combined
                    ? combined
                    : {
                        version: 3,
                        file: normalizedId,
                        sources: [normalizedId],
                        sourcesContent: [code],
                        names: [],
                        mappings: "",
                    };

            // Ensure this module's source index is included in ignore list
            // Usually source index 0 for single-source maps, but we compute safely.
            const sourceIndex = Math.max(0, map.sources.indexOf(normalizedId));
            const prev = Array.isArray(map.x_google_ignoreList)
                ? map.x_google_ignoreList
                : [];

            // Merge uniquely and keep deterministic order
            map.x_google_ignoreList = Array.from(new Set([...prev, sourceIndex])).sort(
                (a, b) => a - b
            );

            return {
                code,
                map,
            };
        },
    };
}
