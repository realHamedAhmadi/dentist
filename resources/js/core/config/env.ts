export enum EnvMode {
    Development = 'dev',
    Production = 'prod',
    Testing = 'test'
}

/**
 * Accessing the environment object once per call
 * Vite will perform the static replacement here during build.
 */
const getRawEnv = (): Record<string, string | undefined> => {
    // Relying on Vite's replacement for import.meta.env
    return (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env
        : (typeof process !== 'undefined' ? process.env : {});
};

/**
 * Resolving mode using a clean approach that allows tree-shaking
 * for production builds.
 */
const resolveMode = (): EnvMode => {
    const rawEnv = getRawEnv();

    // Using mapping object for cleaner lookup
    const modeMap: Record<string, EnvMode> = {
        'production': EnvMode.Production,
        'test': EnvMode.Testing,
        'development': EnvMode.Development
    };

    return modeMap[rawEnv.MODE || ''] ?? EnvMode.Development;
};

// Cache the result to avoid redundant calculations
let _cachedMode: EnvMode | null = null;

export const getEnvMode = (): EnvMode => {
    if (_cachedMode === null) {
        _cachedMode = resolveMode();
    }
    return _cachedMode;
};

/**
 * These exports are now perfect targets for bundler's dead code elimination.
 */
export const isDev = (): boolean => getEnvMode() === EnvMode.Development;
export const isProd = (): boolean => getEnvMode() === EnvMode.Production;
export const isTest = (): boolean => getEnvMode() === EnvMode.Testing;
