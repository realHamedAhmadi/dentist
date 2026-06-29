/**
 * Module providing utility functions for semantic versioning validation and comparison.
 * Uses the semver library.
 */
import semver from "semver";

/**
 * Checks if a given version string is a valid semantic version.
 * @param version - The version string to validate.
 * @returns True if the version is valid, false otherwise.
 */
export function isVersionValid(version: string): boolean {
    // Use semver.valid to check if the version string is valid.
    // It returns the parsed version string or null if invalid.
    return semver.valid(version) !== null;
}

/**
 * Checks if a given version satisfies a specified version range.
 * @param version - The version string to check.
 * @param range - The version range string (e.g., ">=1.0.0", "^2.1.0").
 * @returns True if the version satisfies the range, false otherwise.
 */
export function doesVersionSatisfyRange(version: string, range: string): boolean {
    // First, ensure the provided version is valid.
    if (!isVersionValid(version)) {
        // If the version is not valid, it cannot satisfy any range.
        return false;
    }

    // Use semver.satisfies to determine if the version meets the range criteria.
    return semver.satisfies(version, range);
}

/**
 * Checks if a given range string is a valid version range.
 * @param range - The range string to validate.
 * @returns True if the range is valid, false otherwise.
 */
export function isVersionRangeValid(range: string): boolean {
    // Use semver.validRange to check if the range string is a valid version range.
    // It returns the parsed range string or null if invalid.
    return semver.validRange(range) !== null;
}

/**
 * Version utility namespace object.
 */
const versionUtils  = {
    isValid: isVersionValid,
    isRangeValid: isVersionRangeValid,
    satisfies: doesVersionSatisfyRange,
} as const;
export default versionUtils
