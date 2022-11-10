// 颜色主题封装

export default {
    namespaced: true,
    state: {
        // 定义所有的主题色
        colors: [
            { name: '蓝色', color: '#1F5574' },
            { name: '绿色', color: '#3f5b50' },
            { name: '红色', color: '#d13559' },
            { name: '黑色', color: '#000000' },
            { name: '灰色', color: '#545c64' },
        ],
        // 当前主题色
        currentThemeColor: { name: '蓝色', color: '#1F5574' },
    },
    getters: {
        // 返回主题色的名称数组
        getColorNames(state) {
            return state.colors.map(r => r.name)
        }
    },
    mutations: {
        // 更新当前主题色
        updateCurrentThemeColor(state, val) {
            state.currentThemeColor = val
        }
    },
    actions: {
        // 更新当前主题色
        updateCurrentThemeColor(store, val) {
            store.commit('updateCurrentThemeColor', val)
        }
    },
    modules: {

    }
}