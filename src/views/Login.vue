<template>
<div class="container">
    <div class="login">
        <div class="item">
            <h2>酒店管理系统</h2>
        </div>
        <div class="item">
            <span>账号：</span>
            <div>
                <el-input size="small" v-model="username" placeholder="请输入账号"/>
            </div>
        </div>
        <div class="item">
            <span>密码：</span>
            <div>
                <el-input size="small" type="password" v-model="password" placeholder="请输入密码"/>
            </div>
            
        </div>
        <div class="item">
            <span>记住我：</span>
            <div>
                <el-checkbox v-model="ckMe" size="large" />
            </div>
            
        </div>
        <div class="item">
            <span></span>
            <el-button size="small" type="primary" @click="adminLogin">登陆</el-button>
            <el-button size="small">取消</el-button>
        </div>
    </div>
</div>
</template>
<script>
// 导入组合式API
import {reactive, toRefs, onBeforeMount} from 'vue'
// 导入全局状态管理对象
import {useStore} from 'vuex'
// 导入访问后台api
import {login, loginAuto} from '../api/admin'
// 导入路由
import {useRouter} from 'vue-router'

export default {
    name:'Login',
    setup(){
        // 返回一个全局状态管理对象
        let $store = useStore()

        let $router = useRouter()
        // 定义登陆数据
        let loginData = reactive({
            username:'oscar',
            password:'1qazxsw2',
            ckMe:false,
        })

        // 定义管理员登陆方法
        let adminLogin = async ()=>{
            // 解构出账号和密码
            // let {username, password} = loginData
            // 调用登录API，返回是否成功
            let res = await login(loginData);
            if(res.success) {
                $store.state.admin.userPermission = res.userPermission
                // 跳转到布局页
                $router.push('/layout')
            }
        }

        // 页面挂载之前判断是否存有账户和密码
        onBeforeMount(async () => {
            let isLogin = await loginAuto()
            if(isLogin) {
                // 跳转到布局页
                $router.push('/layout')
            }
        })

        // 返回数据
        return {...toRefs(loginData), adminLogin}
    }
}
</script>
<style scoped lang='scss'>
.container{
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, rgba(25, 68, 117, 0.842), lightblue);
    display: flex;
    justify-content: center;
    align-items: center;
    .login{
        width: 400px;
        height: 220px;
        border: 1px solid #eee;
        border-radius: 6px;
        color:#eee;
        font-family: 'bing';
        padding: 10px;
        .item{
            font-size: 14px;
            display: flex;
            align-items: center;
            margin:10px 0;
            h2{
                flex: 1;
                text-align: center;
            }
            span{
                width: 60px;
                text-align: right;
            }
            div{
                flex: 1;
            }
        }
    }
}

</style>