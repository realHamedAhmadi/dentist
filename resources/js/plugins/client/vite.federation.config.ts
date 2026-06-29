import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import {
    assertBuildTarget,
    createPluginManifest,
    readPluginPackage,
    resolvePluginName
} from '../../core/dev/manifest';
import { createFederatedPluginConfig } from '../../core/dev/vite.shared';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const pluginRoot = process.cwd();

    const targetRaw = env.BUILD_TARGET || 'admin';
    assertBuildTarget(targetRaw);

    const target = targetRaw;
    const pkg = readPluginPackage(pluginRoot);
    const pluginName = resolvePluginName(pkg, env.PLUGIN_NAME);
    const manifest = createPluginManifest({
        pkg,
        target,
        explicitName: env.PLUGIN_NAME
    });

    const sourceRoot = target === 'admin' ? 'admin/src' : 'client/src';
    const providerFileAbs = path.join(pluginRoot, `${sourceRoot}/service-providers/pluginServiceProvider.ts`);
    const outDirAbs = path.join(pluginRoot, `${target}/${manifest.version}`);

    return createFederatedPluginConfig({
        pluginName,
        target,
        providerFileAbs,
        outDirAbs,
        manifest,
        shared: {
            react: { singleton: true, requiredVersion: false },
            'react-dom': { singleton: true, requiredVersion: false },
            i18next: { singleton: true, requiredVersion: false },
            'react-i18next': { singleton: true, requiredVersion: false },
            'i18next-browser-languagedetector': { singleton: true, requiredVersion: false },
        }
    });
});
