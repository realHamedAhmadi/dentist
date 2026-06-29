import versionUtils from "@/core/shared/utils/version"
import { PluginManifest } from "@/core/platform/plugin/manifest/types"

type DependencyPolicy = "required" | "optional"

/**
 * Validates plugin compatibility against the core version
 * and declared plugin dependencies.
 *
 * Responsibilities:
 * - Validate plugin core version compatibility
 * - Validate required dependency existence
 * - Validate required dependency version compatibility
 * - Validate optional dependency version compatibility when available
 */
export class PluginDependencyCompatibilityValidator {

    /**
     * Validates all plugin manifests against the current core version
     * and cross-plugin dependency constraints.
     */
    validate(
        manifests: PluginManifest[],
        coreVersion: string
    ): void {

        const manifestMap =
            this.createManifestMap(manifests)

        for (const manifest of manifests) {
            // Validate compatibility with the host core version
            this.validateCoreVersion(manifest, coreVersion)

            // Validate required dependencies strictly
            this.validateDependencies(
                manifest,
                manifestMap,
                "required"
            )

            // Validate optional dependencies non-strictly
            this.validateDependencies(
                manifest,
                manifestMap,
                "optional"
            )
        }

    }

    /**
     * Creates a fast lookup map for manifests by plugin id.
     */
    private createManifestMap(
        manifests: PluginManifest[]
    ): Map<string, PluginManifest> {

        return new Map(
            manifests.map(manifest => [manifest.id, manifest])
        )

    }

    /**
     * Validates that a plugin supports the current core version.
     */
    private validateCoreVersion(
        manifest: PluginManifest,
        coreVersion: string
    ): void {

        const isCompatible =
            versionUtils.satisfies(coreVersion, manifest.core)

        if (!isCompatible) {
            throw new Error(
                `Plugin "${manifest.id}" is incompatible with core version "${coreVersion}". Expected "${manifest.core}".`
            )
        }

    }

    /**
     * Validates dependencies of a given policy type.
     *
     * Required dependencies:
     * - Must exist
     * - Must satisfy the declared version range
     *
     * Optional dependencies:
     * - May be missing
     * - If present, should satisfy the declared version range
     */
    private validateDependencies(
        manifest: PluginManifest,
        manifestMap: Map<string, PluginManifest>,
        policy: DependencyPolicy
    ): void {

        const dependencies =
            this.getDependencies(manifest, policy)

        for (const dependencyId in dependencies) {
            // Read the expected version range for the dependency
            const expectedVersion =
                dependencies[dependencyId]

            // Resolve the installed dependency manifest
            const dependencyManifest =
                manifestMap.get(dependencyId)

            // Handle missing dependency based on its policy
            if (!dependencyManifest) {
                this.handleMissingDependency(
                    manifest.id,
                    dependencyId,
                    policy
                )
                continue
            }

            // Validate the installed dependency version
            const isCompatible =
                versionUtils.satisfies(
                    dependencyManifest.version,
                    expectedVersion
                )

            if (!isCompatible) {
                this.handleVersionMismatch(
                    manifest.id,
                    dependencyId,
                    expectedVersion,
                    dependencyManifest.version,
                    policy
                )
            }
        }

    }

    /**
     * Returns dependency declarations for the given policy.
     */
    private getDependencies(
        manifest: PluginManifest,
        policy: DependencyPolicy
    ): Record<string, string> {

        return manifest.dependencies?.[policy] ?? {}

    }

    /**
     * Handles a missing dependency according to its policy.
     */
    private handleMissingDependency(
        pluginId: string,
        dependencyId: string,
        policy: DependencyPolicy
    ): void {

        if (policy === "required") {
            throw new Error(
                `Plugin "${pluginId}" requires missing dependency "${dependencyId}".`
            )
        }

        console.warn(
            `Optional dependency "${dependencyId}" for plugin "${pluginId}" is not installed.`
        )

    }

    /**
     * Handles a dependency version mismatch according to its policy.
     */
    private handleVersionMismatch(
        pluginId: string,
        dependencyId: string,
        expectedVersion: string,
        actualVersion: string,
        policy: DependencyPolicy
    ): void {

        const message =
            `Plugin "${pluginId}" expects "${dependencyId}" version "${expectedVersion}", but found "${actualVersion}".`

        if (policy === "required") {
            throw new Error(message)
        }

        console.warn(
            `Optional dependency version mismatch. ${message}`
        )

    }

}
