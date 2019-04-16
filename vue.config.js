module.exports = {
  baseUrl: './',
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `@import "@/css/mixin.scss";`
      }
    }
  },
  assetsDir: 'static',
  // 打包时不生成.map文件
  productionSourceMap: false,
  chainWebpack: config => {
    // ie报错无效字符 添加该配置项 解决该问题
    config.module
      .rule('iview')
      .test(/iview.src.*?js$/)
      .use('babel')
      .loader('babel-loader')
      .end()
  }
  // outputDir: 'dist',
  // devServer: {
  //   host: '0.0.0.0', // can be overwritten by process.env.HOST
  //   port: 6060, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
  // }
}