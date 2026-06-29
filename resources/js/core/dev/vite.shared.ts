import fs from 'node:fs';
import path from 'node:path';
import type { Plugin as VitePlugin, UserConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import type { BuildTarget } from './types';
import type {PluginManifest} from "../../core/platform/plugin/types";
import locationPlugin from "./vite-location-plugin";

/**
 * Writes plugin.manifest.json into the output directory.
 */
export function writePluginManifestPlugin(
    outDirAbs: string,
    manifest: PluginManifest
): VitePlugin {
    return {
        name: 'write-plugin-manifest',
        apply: 'build',
        closeBundle() {
            const manifestPath = path.join(outDirAbs, 'plugin.manifest.json');
            fs.mkdirSync(outDirAbs, { recursive: true });
            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        }
    };
}

/**
 * Creates a shared Vite federation config for plugins.
 */
export function createFederatedPluginConfig(params: {
    pluginName: string;
    target: BuildTarget;
    providerFileAbs: string;
    outDirAbs: string;
    manifest: PluginManifest;
    shared?: Record<string, unknown>;
}): UserConfig {
    const {
        pluginName,
        target,
        providerFileAbs,
        outDirAbs,
        manifest,
        shared = {}
    } = params;

    return {
        build: {
            target: 'esnext',
            outDir: outDirAbs,
            emptyOutDir: false
        },

        define: {
            __PLUGIN_MANIFEST__: JSON.stringify(manifest)
        },

        plugins: [
            locationPlugin(),
            federation({
                name: `${pluginName}-${target}`,
                filename: 'remoteEntry.js',
                exposes: {
                    './plugin': providerFileAbs
                },
                shared
            }),

            writePluginManifestPlugin(outDirAbs, manifest)
        ]
    };
}
