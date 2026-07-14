import {defineConfig, loadEnv, type UserConfig} from 'vite';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPluginManifest, readPluginPackage, resolveBuildTarget, resolvePluginName,} from './manifest';
import {createFederatedPluginConfig} from './vite.shared';
import str from '../shared/utils/string';
import {resolveDevServerPort} from '../shared/utils/helper';

type SharedDependencyConfig = {
    singleton: boolean;
    requiredVersion: false | string;
};

type PluginViteConfigOptions = {
    exposes?: Record<string, string>;
    shared?: Record<string, SharedDependencyConfig>;
    outDir?: (context: PluginViteConfigContext) => string;
    providerFile?: (context: PluginViteConfigContext) => string;
    port?: (context: PluginViteConfigContext) => number;
    override?: (config: UserConfig, context: PluginViteConfigContext) => UserConfig;
};

type PluginViteConfigContext = {
    env: Record<string, string>;
    pluginRootDir: string;
    target: string;
    pluginName: string;
    packageName: string;
    version: string;
};

const defaultShared: Record<string, SharedDependencyConfig> = {
    react: { singleton: true, requiredVersion: false },
    'react-dom': { singleton: true, requiredVersion: false },
    i18next: { singleton: true, requiredVersion: false },
    'react-i18next': { singleton: true, requiredVersion: false },
    'i18next-browser-languagedetector': { singleton: true, requiredVersion: false },
};

/**
 * Creates a shared Vite config for federated plugins.
 */
export function createPluginViteConfig(pluginRootDir:string,options: PluginViteConfigOptions = {}) {
    return defineConfig(({ mode }) => {
        const env = loadEnv(mode, process.cwd(), '');

        const target = resolveBuildTarget(env);
        const pkg = readPluginPackage(pluginRootDir);
        const pluginName = resolvePluginName(pkg, env.PLUGIN_NAME);

        const manifest = createPluginManifest({
            pkg,
            target,
            explicitName: env.PLUGIN_NAME,
        });

        const context: PluginViteConfigContext = {
            env,
            pluginRootDir,
            target,
            pluginName,
            packageName: pkg.name,
            version: manifest.version,
        };

        const providerFileAbs = options.providerFile?.(context) ?? path.join(
            pluginRootDir,
            `${target}/service-providers/Plugin${str.capitalize(target)}ServiceProvider.ts`,
        );

        const outDirAbs = options.outDir?.(context) ?? path.join(
            pluginRootDir,
            `../../../../public/dist/plugins/${pluginName}/${target}/${manifest.version}`,
        );

        const devServerPort = options.port?.(context) ?? resolveDevServerPort(pluginName, target);
        const config = createFederatedPluginConfig({
            pluginName,
            target,
            pluginRootDir,
            outDirAbs,
            manifest,
            exposes: {
                './serviceProvider': providerFileAbs,
                ...(options.exposes ?? {}),
            },
            shared: {
                ...defaultShared,
                ...(options.shared ?? {}),
            },
        });

        const finalConfig: UserConfig = {
            ...config,
            server: {
                ...(config.server ?? {}),
                port: devServerPort,
                strictPort: true,
                cors: true,
            },
            preview: {
                ...(config.preview ?? {}),
                port: devServerPort,
                strictPort: true,
            },
            resolve: {
                alias: {
                    '@': path.resolve(pluginRootDir, '../../'),
                },
            },
        };

        return options.override?.(finalConfig, context) ?? finalConfig;
    });
}
