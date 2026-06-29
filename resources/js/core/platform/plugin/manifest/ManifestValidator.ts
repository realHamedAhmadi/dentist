import versionUtils from "@/core/shared/utils/version"
import { PluginManifest } from "./types"

export class ManifestValidator {

    validate(manifest: PluginManifest): void {
        this.validateId(manifest)

        this.validateVersion(manifest)

        this.validateCore(manifest)

        this.validateDependencies(manifest)

    }

    private validateId(manifest: PluginManifest) {

        if (!manifest.id || typeof manifest.id !== "string") {
            throw new Error("Plugin manifest missing valid 'id'")
        }

        const validId = /^[a-z0-9._-]+$/

        if (!validId.test(manifest.id)) {
            throw new Error(
                `Plugin '${manifest.id}' has invalid id format`
            )
        }

    }

    private validateVersion(manifest: PluginManifest) {

        if (!manifest.version) {
            throw new Error(
                `Plugin ${manifest.id} missing 'version'`
            )
        }

        if (!versionUtils.isValid(manifest.version)) {
            throw new Error(
                `Plugin ${manifest.id} has invalid version '${manifest.version}'`
            )
        }

    }

    private validateCore(manifest: PluginManifest) {

        if (!manifest.core) {
            throw new Error(
                `Plugin ${manifest.id} missing 'core' version range`
            )
        }

        if (!versionUtils.isRangeValid(manifest.core)) {
            throw new Error(
                `Plugin ${manifest.id} has invalid core range '${manifest.core}'`
            )
        }

    }

    private validateDependencies(manifest: PluginManifest) {

        const deps = manifest.dependencies

        if (!deps) return

        const required = deps.required ?? {}
        const optional = deps.optional ?? {}

        if (typeof required !== "object" || typeof optional !== "object") {
            throw new Error(
                `Plugin ${manifest.id} dependencies must be objects`
            )
        }

        const requiredKeys = Object.keys(required)
        const optionalKeys = Object.keys(optional)

        // duplicate dependency check
        for (const dep of requiredKeys) {

            if (optionalKeys.includes(dep)) {
                throw new Error(
                    `Plugin ${manifest.id} dependency '${dep}' cannot be both required and optional`
                )
            }

        }

        this.validateDependencyGroup(
            manifest,
            required,
            "required"
        )

        this.validateDependencyGroup(
            manifest,
            optional,
            "optional"
        )

    }

    private validateDependencyGroup(
        manifest: PluginManifest,
        deps: Record<string, string>,
        type: string
    ) {

        for (const depId in deps) {

            if (depId === manifest.id) {
                throw new Error(
                    `Plugin ${manifest.id} cannot depend on itself`
                )
            }

            const range = deps[depId]

            if (!versionUtils.isRangeValid(range)) {
                throw new Error(
                    `Plugin ${manifest.id} ${type} dependency '${depId}' has invalid range '${range}'`
                )
            }

        }

    }

}
