import {wayfinder} from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {defineConfig} from 'vite';
import sirv from 'sirv'
import path from 'path'
import pckg from './package.json'
import locationPlugin from "./resources/js/core/dev/vite-location-plugin";

const outDir=path.join(__dirname, `./dist/app/${pckg.version}`);

export default defineConfig({
    plugins: [
        {
            name: 'serve-plugin-locales',
            configureServer(server) {
                // Serve locales directory as /locales
                const localesDir = path.resolve(__dirname, 'resources/js/plugins/client/admin/locales')
                server.middlewares.use(`${outDir}/locales`, sirv(localesDir, { dev: true }))
            },
        },
        locationPlugin(),
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/admin/main.tsx',
                //'resources/js/client/main.tsx',
            ],
            //ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        //tailwindcss(),
        /*wayfinder({
            formVariants: true,
        }),*/
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        }
    },
    build: {
        outDir: outDir,
        emptyOutDir: true,
        copyPublicDir: false,
        rollupOptions: {
            output: {
                format: 'es',
                entryFileNames: '[name]-[hash].esm.js',
                chunkFileNames: '[name]-[hash].esm.js',
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'vendor'
                        }
                        if (id.includes('tanstack')) {
                            return 'table'
                        }
                        if (id.includes('recharts')) {
                            return 'charts'
                        }
                    }
                }
            }
        }
    },
    esbuild: {
        jsx: 'automatic',
    },
});
