// @ts-check

import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [react()],
    
    // Configuración para Node.js Server
    output: "server", // SSR - Server Side Rendering
    adapter: node({
        mode: 'standalone' // Servidor independiente
    }),
    
    // Configuración de build
    build: {
        assets: '_astro',
    },
    
    // Base URL
    base: '/',
    
    // Configuración de rutas
    trailingSlash: 'ignore',
});