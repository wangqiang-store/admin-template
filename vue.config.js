// vue.config.js
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  // 基本路径
  publicPath: "/",
  // 输出文件目录
  outputDir: "dist",
  assetsDir: "static",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  runtimeCompiler: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  pages: {
    index: {
      entry: "src/main.ts",
      template: "public/index.html",
      title: "vue3.2 + pinia + ts + element-plus",
    },
  },
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    // config.plugin("html").tap(args => {
    // // 修复 Lazy loading routes Error
    //     args[0].chunksSortMode = "none";
    //     return args;
    // });
    config.resolve.alias // 添加别名
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@components", resolve("src/components"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"));
    // 压缩图片
    // 需要 npm i -D image-webpack-loader
    // config.module
    // .rule("images")
    // .use("image-webpack-loader")
    // .loader("image-webpack-loader")
    // .options({
    //     mozjpeg: { progressive: true, quality: 65 },
    //     optipng: { enabled: false },
    //     pngquant: { quality: [0.65, 0.9], speed: 4 },
    //     gifsicle: { interlaced: false },
    //     webp: { quality: 75 }
    // });
  },
  configureWebpack: {
    resolve: {
      extensions: [".js", ".json", ".vue", ".ts"],
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: false,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // postcss: {
      //     plugins: [
      //         require('postcss-px2rem')({remUnit: 75}), // 换算的基数
      //     ]
      // }
    },
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false
    requireModuleExtension: true,
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico",
    },
  },
  // webpack-dev-server 相关配置
  devServer: {
    // open: process.platform === 'darwin',
    //将服务启动后默认打开浏览器
    open: true,
    host: "0.0.0.0",
    port: 8080,
    // https: true,
    hotOnly: true,
    // historyApiFallback: true,
    proxy: {
      "/websocket": {
        // target: "wss://192.168.0.211:8301/websocket", //开发
        target: "ws://8.129.91.146:8301/websocket", //测试
        changeOrigin: true,
        pathRewrite: {
          "^/websocket": "/",
        },
        ws: true,
      },
      "/": {
        // target: "http://192.168.0.35:8301/", //后端 剑虎
        // target: 'http://192.168.0.101:7105',//本地
        target: "https://8.129.91.146:9522", //测试
        // target: "http://47.112.167.239:8301", //开发
        // target: "http://192.168.0.211:8301", //后端 茂哥
        changeOrigin: true,
        pathRewrite: {
          "^/": "/",
        },
        ws: false,
      },
    },
    before: (app) => {},
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },
};
