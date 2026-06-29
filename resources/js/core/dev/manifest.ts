import fs from 'node:fs';
import path from 'node:path';
import type {BuildTarget,PluginPackageMeta} from './types';
import type {
    PluginManifest,
    PluginActivationType
} from '@/core/platform/plugin/types'

/**
 * Reads package.json from the plugin root directory.
 */
export function readPluginPackage(pluginRoot: string): any {
    const pkgPath = path.resolve(pluginRoot, 'package.json');

    if (!fs.existsSync(pkgPath)) {
        throw new Error(`package.json not found in plugin root: ${pluginRoot}`);
    }

    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
}

/**
 * Ensures the target is valid.
 */
export function assertBuildTarget(target: string): asserts target is BuildTarget {
    if (target !== 'admin' && target !== 'client') {
        throw new Error(`Invalid BUILD_TARGET "${target}". Use "admin" or "client".`);
    }
}

/**
 * Extracts plugin metadata from package.json.
 */
export function readPluginMeta(pkg: any): PluginPackageMeta {
    const plugin = pkg.plugin ?? {};

    if (!plugin.core || typeof plugin.core !== 'string') {
        throw new Error(`package.json is missing required field: plugin.core`);
    }

    if (
        plugin.activation &&
        plugin.activation !== 'eager' &&
        plugin.activation !== 'lazy' &&
        plugin.activation !== 'manual'
    ) {
        throw new Error(`Invalid plugin.activation value: ${plugin.activation}`);
    }

    return {
        core: plugin.core,
        activation: plugin.activation as PluginActivationType | undefined,
        dependencies: plugin.dependencies ?? undefined
    };
}

/**
 * Resolves the normalized plugin name.
 */
export function resolvePluginName(pkg: any, explicitName?: string): string {
    const rawName = explicitName || pkg.name || 'unknown-plugin';
    return String(rawName).replace(/^@plugins\//, '');
}

/**
 * Creates the relative remote entry path for the target/version output.
 */
export function buildRelativeEntryPath(version: string): string {
    return `./remoteEntry.js`;
}

/**
 * Creates a plugin manifest object from package.json and build target.
 */
export function createPluginManifest(params: {
    pkg: any;
    target: BuildTarget;
    explicitName?: string;
}): PluginManifest {
    const {pkg, target, explicitName} = params;

    const name = resolvePluginName(pkg, explicitName);
    const version = String(pkg.version || '0.0.0');
    const meta = readPluginMeta(pkg);

    return {
        name,
        area: target,
        version,
        core: meta.core,
        entry: buildRelativeEntryPath(version),
        dependencies: meta.dependencies,
        activation: meta.activation
    };
}
