import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import mkcert from "vite-plugin-mkcert";

/**
 * 🔧 Конфигурация Vite — корпоративный build для VPN User Manager
 */
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = command === "build";

  return {
    plugins: [
      /**
       * 🔹 React с компилятором и оптимизацией
       */
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),

      /**
       * 🔹 mkcert для HTTPS в dev-режиме
       */
      mkcert(),

      /**
       * 🔹 Поддержка alias из tsconfig.json
       */
      tsconfigPaths(),

      /**
       * 🔹 Проверка типов
       */
      checker({ typescript: true }),

      /**
       * 🔹 SVG → React Component
       */
      svgr({
        svgrOptions: {
          icon: true,
          svgoConfig: {
            plugins: [{ name: "removeViewBox", active: false }],
          },
        },
      }),

      /**
       * 🔹 GZIP / Brotli сжатие
       */
      compression({ algorithm: "gzip", ext: ".gz" }),
      compression({ algorithm: "brotliCompress", ext: ".br" }),

      /**
       * 🔹 PWA
       */
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "logo.svg"],
        manifest: {
          name: "VPN User Manager",
          short_name: "VPN Manager",
          description:
            "Корпоративная панель управления пользователями VPN RouterOS и FreeRADIUS.",
          lang: "ru",
          start_url: "/",
          display: "standalone",
          background_color: "#f8f9fa",
          theme_color: "#0d6efd",
          icons: [
            { src: "/logo.svg", type: "image/svg+xml", sizes: "any" },
            {
              src: "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/icons/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/i,
              handler: "StaleWhileRevalidate",
              options: { cacheName: "images", expiration: { maxEntries: 50 } },
            },
            {
              urlPattern: /^https:\/\/.*\/api\/.*$/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                networkTimeoutSeconds: 5,
              },
            },
          ],
        },
      }),

      /**
       * 🔹 Анализ структуры бандла (dist/stats.html)
       */
      visualizer({
        filename: "dist/stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],

    /**
     * 🔹 SCSS глобальные переменные и mixins
     */
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixins.scss" as *;
          `,
        },
      },
      modules: {
        generateScopedName: "[local]_[hash:6]",
      },
    },

    /**
     * 🔹 Алиасы
     */
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@routes": path.resolve(__dirname, "./src/routes"),
      },
    },

    /**
     * 🔹 Сервер разработки (HTTPS + proxy)
     */
    server: {
      https: {}, // mkcert подхватит сертификаты автоматически
      port: Number(env.VITE_PORT) || 5173,
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8000/",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },

    /**
     * 🔹 Preview-сервер
     */
    preview: {
      port: 4173,
      host: true,
    },

    /**
     * 🔹 Build-оптимизация
     */
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "vendor.react";
              if (id.includes("axios")) return "vendor.network";
              if (id.includes("zustand")) return "vendor.state";
              return "vendor";
            }
          },
        },
      },
    },

    /**
     * 🔹 Оптимизация зависимостей
     */
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
      exclude: ["@vitejs/plugin-react"],
    },

    /**
     * 🔹 Минификация кода
     */
    esbuild: {
      drop: isProduction ? ["console", "debugger"] : [],
    },

    define: {
      "process.env": {},
    },
  };
});
