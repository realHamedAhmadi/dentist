import str from "./string";

/**
 * Resolves a stable port number based on plugin metadata.
 */
export function resolveDevServerPort(pluginName: string, target: string,basePort=4000): number {
    const pluginSum = str.alphabetSum(pluginName);
    const targetSum = str.alphabetSum(target);

    // Combine sums to create a unique port
    return basePort + pluginSum + targetSum;
}
