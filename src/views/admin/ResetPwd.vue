<template>
  <div class="box">
    <div class="editItem">
      <span>原始密码：</span>
      <div>
        <el-input
          size="small"
          v-model="oldPassword"
          placeholder="请输入原始密码"
          type="password"
        />
      </div>
    </div>
    <div class="editItem">
      <span>新密码：</span>
      <div>
        <el-input
          size="small"
          v-model="newPassword"
          placeholder="请输入新密码"
          type="password"
        />
      </div>
    </div>

    <div class="editItem">
      <span>确认密码：</span>
      <div>
        <el-input
          size="small"
          v-model="confirmPassword"
          placeholder="请再次输入密码"
          type="password"
        />
      </div>
    </div>
    <div class="editItem">
      <span></span>
      <div>
        <el-button size="small" type="primary" @click="resetPass">
          提交
        </el-button>
        <el-button size="small" type="primary" @click="clearForm">
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { resetPassword } from "../../api/admin";
import { useStore } from "vuex";
export default {
  name: "ResetPwd",
  setup() {
    // 返回一个全局状态管理对象
    let $store = useStore();

    let params = reactive({
      username: $store.state.admin.loginUser.username,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    let clearForm = () => {
      params.oldPassword = "";
      params.newPassword = "";
      params.confirmPassword = "";
    };

    let resetPass = async () => {
      console.log(params);
      await resetPassword(params);
    };

    return { ...toRefs(params), resetPass, clearForm };
  },
};
</script>
<style scoped lang='scss'>
.box {
  width: 500px;
}
</style>