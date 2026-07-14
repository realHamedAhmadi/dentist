import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import sirv from 'sirv';
import fs from 'node:fs';
import path from 'node:path';
import pckg from './package.json';
import locationPlugin from './resources/js/core/dev/vite-location-plugin';

/**
 * Resolves build target from environment variables.
 */
function resolveBuildTarget(env: Record<string, string>): string {
    const target = env.BUILD_TARGET ?? process.env.BUILD_TARGET ?? 'admin';

    if (!target || !target.trim()) {
        throw new Error('BUILD_TARGET must be a non-empty string.');
    }

    return target.trim();
}

/**
 * Resolves app entry file with ts/tsx fallback.
 */
function resolveEntryFile(target: string): string {
    const tsxFile = path.resolve(__dirname, `resources/js/${target}/main.tsx`);
    const tsFile = path.resolve(__dirname, `resources/js/${target}/main.ts`);

    if (fs.existsSync(tsxFile)) {
        return `resources/js/${target}/main.tsx`;
    }

    if (fs.existsSync(tsFile)) {
        return `resources/js/${target}/main.ts`;
    }

    throw new Error(`Entry file not found for target "${target}".`);
}

/**
 * Resolves locales directory for standalone app.
 */
function resolveLocalesDir(target: string): string {
    return path.resolve(__dirname, `resources/js/${target}/locales`);
}

/**
 * Resolves dev server port from environment variables.
 */
function resolvePort(env: Record<string, string>, target: string): number {
    const explicitPort = env.VITE_PORT ?? process.env.VITE_PORT;

    if (explicitPort) {
        const parsedPort = Number(explicitPort);

        if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
            throw new Error(`VITE_PORT is invalid: "${explicitPort}".`);
        }

        return parsedPort;
    }

    const defaultPorts: Record<string, number> = {
        admin: 5173,
        client: 5174,
    };

    return defaultPorts[target] ?? 5180;
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const target = resolveBuildTarget(env);
    const version = pckg.version;
    const relativePath = `dist/app/${target}/${version}`;
    const outDir = path.join(__dirname, `public/${relativePath}`);
    const localesDir = resolveLocalesDir(target);
    const entryFile = resolveEntryFile(target);
    const port = resolvePort(env, target);

    return {
        plugins: [
            {
                name: 'serve-app-locales',
                configureServer(server) {
                    // Serve target-specific locales in development mode
                    if (fs.existsSync(localesDir)) {
                        server.middlewares.use(`/${relativePath}/locales`, sirv(localesDir, { dev: true }));
                    }
                },
            },
            locationPlugin(),
            laravel({
                input: ['resources/css/app.css', entryFile],
                refresh: true,
                buildDirectory:relativePath
            }),
            react(),
            federation({
                name: `host_app_${target}`,
                remotes: {
                    __dev_placeholder__: '', // Workaround for federation dev runtime initialization
                },
                shared: {
                    react: {
                        singleton: true,
                        requiredVersion: false,
                    },
                    'react-dom': {
                        singleton: true,
                        requiredVersion: false,
                    },
                    i18next: {
                        singleton: true,
                        requiredVersion: false,
                    },
                    'react-i18next': {
                        singleton: true,
                        requiredVersion: false,
                    },
                    'i18next-browser-languagedetector': {
                        singleton: true,
                        requiredVersion: false,
                    },
                },
            }),
        ],

        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js'),
            },
        },

        server: {
            host: 'localhost',
            port,
            strictPort: true,
            cors: true,
            origin: `http://localhost:${port}`,
            hmr: {
                host: 'localhost',
                protocol: 'ws',
                port,
            },
        },


        build: {
            outDir,
            manifest:true,
            emptyOutDir: true,
            copyPublicDir: false,
            target: 'esnext',
            rollupOptions: {
                output: {
                    format: 'es',
                    entryFileNames: '[name]-[hash].esm.js',
                    chunkFileNames: '[name]-[hash].esm.js',
                    assetFileNames: '[name]-[hash][extname]',
                    manualChunks(id) {
                        // Split common vendor chunks
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom')) {
                                return 'vendor';
                            }

                            if (id.includes('tanstack')) {
                                return 'table';
                            }

                            if (id.includes('recharts')) {
                                return 'charts';
                            }
                        }

                        return undefined;
                    },
                },
            },
        },

        esbuild: {
            jsx: 'automatic',
        },
        optimizeDeps: {
            force: true,
        },
    };
});
