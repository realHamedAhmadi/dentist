import { PluginManifest } from "@/core/platform/plugin/manifest/types"
import { PluginDependencyCompatibilityValidator } from "@/core/platform/plugin/PluginDependencyCompatibilityValidator"
import { ManifestValidator } from "@/core/platform/plugin/manifest/ManifestValidator"
import { ManifestLoader } from "@/core/platform/plugin/manifest/ManifestLoader"
import { PluginDescriptor } from "@/core/platform/plugin/PluginDescriptor"
import { Plugin } from "@/core/platform/plugin/types"
import {IApplication} from "@/core/platform/application/types";

export class PluginLoader {

    private manifestLoader = new ManifestLoader()

    private manifestValidator = new ManifestValidator()

    private compatibilityValidator = new PluginDependencyCompatibilityValidator()
    constructor(protected app:IApplication) {

    }

    async load(pluginPaths: string[]): Promise<PluginDescriptor[]> {

        const manifests: PluginManifest[] = []

        const descriptors: PluginDescriptor[] = []

        for (const path of pluginPaths) {

            // dynamic import of module
            const module = await import(path)

            if (!module.default) {
                throw new Error(
                    `Plugin at ${path} has no default export`
                )
            }

            const plugin: Plugin = new module.default

            // load manifest.json near plugin
            const manifest =
                await this.manifestLoader.load(path)

            // validate manifest structure
            this.manifestValidator.validate(manifest)

            manifests.push(manifest)

            descriptors.push({
                plugin,
                manifest,

                path
            })

        }

        // validate version compatibility
        this.compatibilityValidator.validate(
            manifests,
            "1.0.0"
        )

        return descriptors

    }

}
