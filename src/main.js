import { createApp } from 'vue'
import App from './App.vue'
// 导入当前项目的路由器
import router from './router'
// 导入当前项目的全局状态管理对象
import store from './store'
// 屏蔽浏览器警告
import 'default-passive-events'

// 导入element-plus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import * as echarts from 'echarts'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store).use(router).use(ElementPlus, { locale: zhCn }).component('QuillEditor', QuillEditor).mount('#app')
app.echarts = echarts