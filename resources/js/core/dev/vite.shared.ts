import fs from 'node:fs';
import path from 'node:path';
import type { Plugin as VitePlugin, UserConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import sirv from 'sirv';
import type { PluginManifest } from '../../core/platform/plugin/types';
import locationPlugin from './vite-location-plugin';
import __dirname from "@/plugins/client/vite.config";

const federationBuildEntry = 'virtual:federation-build-entry';
const resolvedFederationBuildEntry = `\0${federationBuildEntry}`;

function federationBuildEntryPlugin(): VitePlugin {
    return {
        name: 'federation-build-entry',
        resolveId(id) {
            return id === federationBuildEntry ? resolvedFederationBuildEntry : null;
        },
        load(id) {
            return id === resolvedFederationBuildEntry ? 'export {};' : null;
        },
    };
}

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
 * Dynamically serves locales directory in dev mode.
 * Identifies whether we are running inside a Plugin directory or the main Host App.
 */
export function serveModuleLocalesInDevMode(options: {
    target: string;
    version: string;
    pluginName?: string; // If undefined, assumes we are configuring the Host App
}): VitePlugin {
    return {
        name: 'serve-plugin-locales',
        configureServer(server) {
            const isPlugin = !!options.pluginName;

            // 1. Resolve local physical path
            let localDir: string;
            if (isPlugin) {
                // E.g., project_root/Plugins/order/admin/locales
                localDir = path.resolve(process.cwd(), `${options.target}/locales`);
            } else {
                // E.g., project_root/resources/js/admin/locales
                localDir = path.resolve(process.cwd(), `resources/js/${options.target}/locales`);
            }

            // 2. Resolve target URL route prefix
            // If Host: /dist/app/{target}/{version}
            // If Plugin: /dist/plugins/{plugin}/{target}/{version}
            const urlPath = isPlugin
                ? `/dist/plugins/${options.pluginName}/${options.target}/${options.version}`
                : `/dist/app/${options.target}/${options.version}`;

            // Check directory existence to prevent Sirv from crashing
            if (fs.existsSync(localDir)) {
                server.middlewares.use(urlPath, sirv(localDir, { dev: true }));
            }
        },
    };
}

function copyLocalFolder(pluginTargetDir:string,outputDir:string) {
    return {
        name: 'copy-local-folder',
        closeBundle() {
            const from = `${pluginTargetDir}/locales`
            const to = `${outputDir}/locales`;
            if (fs.existsSync(from)) {
                fs.cpSync(from, to, {
                    recursive: true,
                    force: true,
                });

                console.log(`Copied local folder: ${from} -> ${to}`);
            }
        },
    };
}

/**
 * Creates a shared Vite federation config for plugins.
 */
export function createFederatedPluginConfig(params: {
    pluginName: string;
    target: string;
    pluginRootDir:string,
    outDirAbs: string;
    manifest: PluginManifest;
    exposes?: any;
    shared?: any;
}): UserConfig {
    const {
        pluginName,
        target,
        pluginRootDir,
        exposes,
        outDirAbs,
        manifest,
        shared = {}
    } = params;

    return {
        build: {
            target: 'esnext',
            outDir: outDirAbs,
            emptyOutDir: true,
            copyPublicDir: false,
            rollupOptions: {
                input: federationBuildEntry
            }
        },

        define: {
            __PLUGIN_MANIFEST__: JSON.stringify(manifest)
        },

        plugins: [
            federationBuildEntryPlugin(),
            locationPlugin(),
            copyLocalFolder(`${pluginRootDir}/${target}`,outDirAbs),
            federation({
                name: `${pluginName}-${target}`,
                filename: 'remoteEntry.js',
                exposes,
                shared
            }),
            writePluginManifestPlugin(outDirAbs, manifest),
            serveModuleLocalesInDevMode({
                target,
                version: manifest.version,
                pluginName
            })
        ]
    };
}
