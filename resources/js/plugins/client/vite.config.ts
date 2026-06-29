import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
//import terser from '@rollup/plugin-terser';
import mergePluginManifest from '../mergePluginManifest'
import path from 'path';
import locationPlugin from "../../core/dev/vite-location-plugin";

const pluginName = path.basename(__dirname);
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,'./manifest.json'), 'utf-8'));
const outDir = path.normalize(path.join(__dirname, `../../../../dist/plugins/${pluginName}/${manifest.version}`));

export default defineConfig({
    build: {
        // Define output directory for this specific module
        outDir: outDir,
        emptyOutDir: true,
        copyPublicDir: false,
        // Disable CSS code splitting for smaller plugins
        cssCodeSplit: false,
        // Using Terser for maximum minification
        //minify: 'terser',
        /*terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_getters: true,
                expression: true
            },
            format: { comments: false }
        },*/
        rollupOptions: {
            // Keep the output clean
            output: [
                // 1. ESM Version (Modern Browsers)
                {
                    format: 'es',
                    entryFileNames: '[name]-[hash].esm.js',
                    chunkFileNames: '[name]-[hash].js',
                }/*,
                {
                    format: 'iife',
                    name: `${pluginName}${(chunkInfo) => chunkInfo.name === 'admin' ? 'Admin' : 'Client'}`,
                    entryFileNames: '[name]-[hash].iife.js',
                    globals: {
                        '@shared': 'AppShared',
                        'react': 'React'
                    },
                    //inlineDynamicImports: true,
                    extend: true,
                }*/
            ],
            external: ['@shared', 'react'],
        }
    },
    plugins: [
        locationPlugin(),
        laravel({
            input: [
                path.join(__dirname, 'admin'),
                path.join(__dirname, 'client'),
            ],
            refresh: true,
        }),
        react(),
        {
            name: 'log-path',
            buildStart() {
                console.log('--- STARTING BUILD TO: ---');
                console.log(outDir);
            }
        },
        //mergePluginManifest(manifest.id,outDir)
    ],
    resolve: {
        alias: {
            // Mapping to the Core module for shared code
            '@': path.join(__dirname, '../../'),
        }
    }
});
