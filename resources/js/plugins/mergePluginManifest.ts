import path from 'path';
import fs from "fs";
/**
 * Merge Vite manifest with custom plugin manifest
 * - Reads Vite manifest.json from outDir
 * - Reads plugin.manifest.json from source
 * - Produces plugin-manifest.json (or overrides manifest.json)
 */
export default function mergePluginManifest(plugin,outDir) {
    return {
        name: 'merge-plugin-manifest',
        // runs when build is done and files are written
        buildEnd() {
            // Single line comments are English inside method
            // 1. Ensure vite manifest exists
            const viteManifestFile = path.join(outDir, 'manifest.json');
            const pluginManifestPath = path.resolve(__dirname, `${plugin}/manifest.json`);
            if (!fs.existsSync(viteManifestFile)) {
                console.warn(
                    '[merge-plugin-manifest] vite manifest.json not found at:',
                    viteManifestFile
                );
                return;
            }

            // 2. Read vite manifest
            const viteManifestRaw = fs.readFileSync(viteManifestFile, 'utf-8');
            let viteManifest;
            try {
                viteManifest = JSON.parse(viteManifestRaw);
            } catch (e) {
                console.error(
                    '[merge-plugin-manifest] failed to parse vite manifest.json',
                    e
                );
                return;
            }

            // 3. Read custom plugin manifest
            if (!fs.existsSync(pluginManifestPath)) {
                console.warn(
                    '[merge-plugin-manifest] custom plugin manifest not found at:',
                    pluginManifestPath
                );
                return;
            }

            const pluginManifestRaw = fs.readFileSync(
                pluginManifestPath,
                'utf-8'
            );
            let pluginManifest;
            try {
                pluginManifest = JSON.parse(pluginManifestRaw);
            } catch (e) {
                console.error(
                    '[merge-plugin-manifest] failed to parse plugin.manifest.json',
                    e
                );
                return;
            }

            // 4. Merge logic
            // You can customize this: deep merge, override, etc.
            const merged = {
                ...pluginManifest,
                vite: viteManifest, // keep vite manifest under a separate key
            };

            // 5. Write final manifest file
            const outputFile = path.join(outDir, 'manifest.json'); // or 'manifest.json' if you want to override

            fs.writeFileSync(
                outputFile,
                JSON.stringify(merged, null, 2),
                'utf-8'
            );

            console.log(
                '[merge-plugin-manifest] merged manifest written to:',
                outputFile
            );
        },
    };
}
