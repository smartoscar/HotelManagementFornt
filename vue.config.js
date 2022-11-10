const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,

    // 服务端提供了跨域处理，此处代理不再需要
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost/', //这里填入你要请求的接口的前缀
    //             ws: true, //代理websocked
    //             changeOrigin: false, //虚拟的站点需要更换origin
    //             pathRewrite: {
    //                 '^/api': '' //重写路径
    //             }
    //         }
    //     }
    // }
})