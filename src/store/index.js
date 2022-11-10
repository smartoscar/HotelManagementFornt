import { createStore } from 'vuex'

// 导入主题模块
import theme from './modules/theme.js'
// 导入当前登录用户模块
import admin from './modules/admin'

export default createStore({
    // 定义模块
    modules: {
        theme,
        admin
    }
})