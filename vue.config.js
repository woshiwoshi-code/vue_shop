const {
  defineConfig
} = require('@vue/cli-service')
const path = require('path'); //引入path模块
// element-plus插件自动导入
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const {
  ElementPlusResolver
} = require("unplugin-vue-components/resolvers");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
});