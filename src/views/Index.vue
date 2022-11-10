<template>
    Index
</template>
<script>
import {onBeforeMount} from 'vue'
import {loginAuto} from '../api/admin'
import {useRouter} from 'vue-router'
export default {
    name: 'Index',
    setup(){
        let $router = useRouter()
        // 页面挂载之前判断是否存有账户和密码
        onBeforeMount(async () => {
            let isLogin = await loginAuto()
            if(isLogin) {
                // 跳转到布局页
                $router.push('/layout')
            } else {
                // 跳转到登录页
                $router.push('/login')
            }
        })
    }
}
</script>
<style scoped lang='scss'>

</style>