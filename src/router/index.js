import { createRouter, createWebHashHistory } from 'vue-router'
// import { useStore } from 'vuex'
// import { $checkPermission } from '../utils/permit'

// 定义路由信息的数组
const routes = [
    // 首页
    {
        path: '/',
        name: 'Index',
        meta: {
            title: 'Bing酒店管理系统'
        },
        component: () =>
            import ('../views/Index.vue')
    },
    // 登录页
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录'
        },
        component: () =>
            import ('../views/Login.vue')
    },
    // 布局页
    {
        path: '/layout',
        name: 'Layout',
        meta: {
            title: 'Bing酒店管理系统'
        },
        component: () =>
            import ('../views/Layout.vue'),
        children: [
            // 首页
            {
                path: '',
                name: 'Home',
                meta: {
                    title: '首页'
                },
                component: () =>
                    import ('../views/home/Home.vue'),
            },
            // 邮件
            {
                path: 'email',
                name: 'Email',
                meta: {
                    title: '邮件'
                },
                component: () =>
                    import ('../views/home/Email.vue'),
            },
            // 消息
            {
                path: 'message',
                name: 'Message',
                meta: {
                    title: '消息'
                },
                component: () =>
                    import ('../views/home/Message.vue'),
            },
            // 个人中心
            {
                path: 'mine',
                name: 'Mine',
                meta: {
                    title: '个人中心'
                },
                component: () =>
                    import ('../views/admin/Mine.vue'),
            },
            // 修改密码
            {
                path: 'resetPwd',
                name: 'ResetPwd',
                meta: {
                    title: '修改密码'
                },
                component: () =>
                    import ('../views/admin/ResetPwd.vue'),
            },
            // 角色管理
            {
                path: 'role',
                name: 'Role',
                meta: {
                    title: '角色管理'
                },
                component: () =>
                    import ('../views/role/Role.vue'),
            },
            // 用户管理
            {
                path: 'admin',
                name: 'Admin',
                meta: {
                    title: '用户管理',
                    // permission: 'admin:list',
                },
                component: () =>
                    import ('../views/admin/Admin.vue'),
            },
            // 权限管理
            {
                path: 'resource',
                name: 'Resource',
                meta: {
                    title: '权限管理'
                },
                component: () =>
                    import ('../views/role/Resource.vue'),
            },
            // 房型管理
            {
                path: 'roomType',
                name: 'RoomType',
                meta: {
                    title: '房型管理'
                },
                component: () =>
                    import ('../views/roomType/RoomType.vue'),
            },
            // 客房管理
            {
                path: 'room',
                name: 'Room',
                meta: {
                    title: '客房管理'
                },
                component: () =>
                    import ('../views/room/Room.vue'),
            },
            // 订单管理
            {
                path: 'roomOrder',
                name: 'RoomOrder',
                meta: {
                    title: '订单管理'
                },
                component: () =>
                    import ('../views/order/Order.vue'),
            }
        ]
    },
    // Error404
    {
        path: '/:pathMatch(.*)*',
        name: 'Error404',
        meta: {
            title: '404'
        },
        component: () =>
            import ('../views/Error404.vue'),
    }
]

// 创建一个路由器对象
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 导入nprogress
import NProgress from 'nprogress'
// 导入nprogress的央视
import 'nprogress/nprogress.css'

// 定义路由导航前置守卫
router.beforeEach((to, from, next) => {
    // 开启进度条
    NProgress.start()
        // if (to.meta && to.meta.permission) {
        //     let userPermission = useStore().state.admin.admin.userPermission
        //     console.log(permi);
        //     if ($checkPermission(to.meta.permission, userPermission)) {
        //         next()
        //     }
        // } else {
        //     next()
        // }
    next()
})

// 定义理由导航后置守卫
router.afterEach((to, from) => {
    // 判断路由元信息中,有没有配置标题信息,如果配置了,显示它里面配置的标题
    if (to.meta && to.meta.title) {
        document.title = to.meta.title
    }
    // 关闭进度条
    NProgress.done()
})

export default router