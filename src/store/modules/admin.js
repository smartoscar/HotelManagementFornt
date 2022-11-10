// 当前登录账户信息模块
export default {
    namespaced: true,
    state: {
        // 用于保存当前登录用户信息
        loginUser: {
            username: '小米',
            roleId: '',
            roleName: '',
            lastLoginTime: '',
            photo: '',
        },
        userPermission: {

        },
    },
    getters: {

    },
    mutations: {
        setLoginUser(state, val) {
            state.loginUser = val
        },

        setUserPermission(state, val) {
            state.userPermission = val
        }
    },
    actions: {
        setLoginUser(store, val) {
            store.commit('setLoginUser', val)
        },

        setUserPermission(store, val) {
            store.commit('setUserPermission', val)
        }
    }
}