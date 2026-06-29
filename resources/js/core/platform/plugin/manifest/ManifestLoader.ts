import { PluginManifest } from "./types"

/**
 * Handles the asynchronous loading of plugin manifest files.
 * Uses dynamic imports to fetch JSON data from plugin directories.
 */
export class ManifestLoader {

    /**
     * Loads a manifest.json file from the specified directory.
     */
    async load(dir: string): Promise<PluginManifest> {
        // Remove trailing slash if present to avoid path issues
        const normalizedDir = dir.replace(/\/+$/, "")

        // Perform dynamic import using the normalized path
        const module = await import(`${normalizedDir}/manifest.json`)

        // Return the default export containing the manifest object
        return module.default as PluginManifest
    }
}
