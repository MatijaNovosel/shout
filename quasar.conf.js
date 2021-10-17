const ESLintPlugin = require("eslint-webpack-plugin");
const { configure } = require("quasar/wrappers");

module.exports = configure(function (ctx) {
  return {
    supportTS: false,
    boot: ["i18n", "axios"],
    css: ["app.scss"],
    extras: ["roboto-font", "material-icons", "mdi-v6"],
    build: {
      vueRouterMode: "history",
      chainWebpack(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
      }
    },
    devServer: {
      https: false,
      port: 8080,
      open: true
    },
    framework: {
      config: {},
      plugins: []
    },
    animations: [],
    ssr: {
      pwa: false,
      prodPort: 3000,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      chainWebpackWebserver(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      },
      middlewares: [ctx.prod ? "compression" : "", "render"]
    },
    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {},
      chainWebpackCustomSW(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      },
      manifest: {
        name: "Chat app web",
        short_name: "Chat app web",
        description: "A chat app for the web",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },
    cordova: {},
    capacitor: {
      hideSplashscreen: true
    },
    electron: {
      bundler: "packager",
      packager: {},
      builder: {
        appId: "chat-app-web"
      },
      chainWebpackMain(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      },
      chainWebpackPreload(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      }
    }
  };
});
