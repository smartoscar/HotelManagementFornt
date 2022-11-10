<template>
  <div class="container">
    <div class="left" :style="{width:isCollapse?'60px':'200px', background: currentThemeColor}">
      <div class="logo">
        <div>{{isCollapse?'Bing':'Bing酒店管理系统'}}</div>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        :background-color="currentThemeColor"
        class="el-menu-vertical-demo"
        :default-active="leftActiveIndex"
        text-color="#fff"
        :collapse="isCollapse"
        router
      >
        <el-sub-menu v-for="item in menu" :index="item.resourceId + ''" :key="item.resourceId">
          <template #title v-if="item.isMenu == 1 && item.isLeaf == 0">
            <el-icon><Document /></el-icon>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item v-for="subItem in item.childrenResource" :index="'/layout/' + subItem.href" :key="subItem.resourceId">{{subItem.name}}</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="right">
      <div class="top" :style="{background: currentThemeColor}">
        <div class="icon" @click="isCollapse = !isCollapse">
          <el-icon :size="24" v-show="!isCollapse">
            <Fold />
          </el-icon>
          <el-icon :size="24" v-show="isCollapse">
            <Expand />
          </el-icon>
        </div>
        <div class="menu">
          <el-menu
            :default-active="topActiveIndex"
            class="el-menu-demo"
            mode="horizontal"
            :background-color="currentThemeColor"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-menu-item index="/layout"><el-icon><House /></el-icon>首页</el-menu-item>
            <el-menu-item index="/layout/email"><el-icon><Message /></el-icon>邮件</el-menu-item>
            <el-menu-item index="/layout/message"><el-icon><ChatDotSquare /></el-icon>消息</el-menu-item>
            <el-sub-menu index="4">
              <template #title><el-icon><Orange /></el-icon>切换皮肤</template>
              <el-menu-item v-for="(item, index) in getColorNames" :key="index" index="" @click="changeTheme(index)">{{item}}</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="5">
              <template #title><el-icon><UserFilled /></el-icon>
              {{$store.state.admin.loginUser.username}}
              </template>
              <el-menu-item index="/layout/mine">个人中心</el-menu-item>
              <el-menu-item index="/layout/resetPwd">修改密码</el-menu-item>
              <el-menu-item index="" @click="logout">退出系统</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </div>
      <div class="bottom">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
//导入组合式api
import { reactive, toRefs, computed, onBeforeMount, } from "vue";
// 导入全局状态管理对象
import {useStore} from 'vuex'
// 导入路由对象
import {useRouter} from 'vue-router'
// 导入elementPlus图标
import {
  Document,House,Message,ChatDotSquare,Orange,UserFilled,
  Menu as IconMenu,
  Location,
  Setting,
  Fold,
  Expand,
} from "@element-plus/icons-vue";
// 导入用户API
import {getUser} from '../api/admin'

export default {
  name: "Layout",
  setup() {
    // 返回一个全局状态管理对象
    let $store = useStore()
    // 返回一个路由对象
    let $router = useRouter()

    // 页面挂载之前
    onBeforeMount(async () => {
      let token = sessionStorage.getItem('token')
      //  判断token是否存在并有效，有token才能展示
      if(!token) {
        $router.push('/login')
      }
      let username = localStorage.getItem('username');
      let res = await getUser({username})
      $store.dispatch('admin/setLoginUser', res.data)
    })
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      // 保存登陆用户的权限
      $store.replaceState(
        Object.assign(
          {},
          $store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    // beforeunload事件在页面刷新时先触发
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify($store.state))
    })

    // 获取菜单
    let menu = $store.state.admin.userPermission

    // 定义菜单数据
    let menuData = reactive({
      leftActiveIndex: '1',
      topActiveIndex: '/layout',
      // 左侧菜单是否展开
      isCollapse: false,
    });

    // 从全局状态里面获取颜色数组
    let getColorNames = computed(() => {
      return $store.getters['theme/getColorNames']
    })

    // 从全局状态获取当前主题色
    let currentThemeColor = computed(()=>{
      return $store.state.theme.currentThemeColor.color
    })

    // 切换主题
    let changeTheme = (index) => {
      // 根据index获取对应的颜色主题
      let color = $store.state.theme.colors[index]
      // 将该颜色主题复制给当前颜色主题
      $store.dispatch('theme/updateCurrentThemeColor', color)
    }

    // 退出系统
    let logout = ()=>{
      // 清除所有的浏览器缓存
      sessionStorage.clear()
      localStorage.clear()
      // 跳转到登录页面
      $router.push('/login')
    }

    return { menu, ...toRefs(menuData), getColorNames, currentThemeColor, changeTheme, logout};
  },
};
</script>
<style scoped lang='scss'>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  .left {
    height: 60px;
    transition: all 0.5s;
    .logo {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        color: white;
        font-size: 18px;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 4px 10px;
        // 不收缩
        flex-shrink: 0;
      }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 100vw;
    }
    .el-menu--collapse {
      min-height: 100vw;
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #545c64;
      .icon {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
      .menu {
        width: 650px;
      }
    }
    .bottom {
      flex: 1;
      padding: 6px;
    }
  }
}
</style>