<template>
    <div class="box">
        <div>
            <p>
                <el-image
                    style="width: 150px; height: 150px"
                    :src="fileUrl + $store.state.admin.loginUser.photo"
                    fit="cover"
                />
            </p>
            <p>用户名：{{$store.state.admin.loginUser.username}}</p>
            <p>昵称：{{$store.state.admin.loginUser.nickname}}</p>
            <p>角色：{{$store.state.admin.loginUser.roleName}}</p>
            <p>最后登录时间：{{$store.state.admin.loginUser.lastLoginTime}}</p>
        </div>
    </div>
</template>
<script>
import { FILE_SERVER_URL } from "../../config/conster";
export default {
    name:'Mine',
    setup() {
        let fileUrl = FILE_SERVER_URL;
        return { fileUrl}
    }
}
</script>
<style scoped lang='scss'>

</style>