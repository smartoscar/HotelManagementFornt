<template>
  <!-- 搜索区域 -->
  <div class="search">
    <span>用户名：</span>
    <el-input
      size="small"
      v-model="searchData.username"
      placeholder="请输入用户名"
      style="width: 180px"
    />
    <span>角色：</span>
    <el-select v-model="searchData.roleId" class="m-2" clearable>
      <el-option
        v-for="item in roleDatas"
        :key="item.id"
        :label="item.roleName"
        :value="item.id"
      />
    </el-select>
    <el-button size="small" type="success" @click="loadTable">查询</el-button>
    <el-button size="small" type="primary" @click="openDrawar = true"
      >添加</el-button
    >
  </div>
  <!-- 华丽的分割线 -->
  <div><el-divider /></div>
  <!-- 表格区域 -->
  <el-table :data="tableData" style="width: 100%" size="mini">
    <el-table-column prop="id" label="编号" width="100" />
    <el-table-column prop="username" label="用户名" width="100" />
    <el-table-column prop="photo" label="头像" width="100" >
      <template #default="scope">
        <el-image v-if="scope.row.photo"
          style="width: 50px; height: 50px"
          :src="fileUrl + scope.row.photo"
          fit="cover"
        />
        <img v-if="!scope.row.photo" src="../../assets/img/headImg.webp" style="width: 50px; height: 50px" />
      </template>
    </el-table-column>
    <el-table-column prop="nickname" label="昵称" width="140" />
    <el-table-column prop="roleName" label="角色" width="100" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" type="warning" @click="handleEdit(scope.row)">
          编辑
        </el-button>
          <el-popconfirm v-if="checkPermis('admin:delete')"
            title="确认删除?"
            @confirm="handleDelete(scope.row.id)"
            cancel-button-text="取消"
            confirm-button-text="确认"
          >
            <template #reference>
              <el-button size="small" type="danger"> 删除 </el-button>
            </template>
          </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <div class="pagination">
    <el-pagination
      :currentPage="page.currentPage"
      :page-size="page.pageSize"
      :page-sizes="page.pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 抽屉区域 -->
  <el-drawer
    v-model="openDrawar"
    :title="isAdd ? '添加用户' : '修改用户'"
    direction="rtl"
    size="30%"
    :before-close="drawerClose"
  >
    <div class="editItem">
      <span>头像：</span>
      <div>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="adminData.photo" :src="fileUrl + adminData.photo" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
    </div>
    <div class="editItem">
      <span>用户名：</span>
      <div>
        <el-input
          size="small"
          v-model="adminData.username"
          :readonly="!isAdd"
        />
      </div>
    </div>
    <div class="editItem" v-if="isAdd">
      <span>密码：</span>
      <div>
        <el-input
          size="small"
          v-model="adminData.password"
          placeholder="请输入密码"
          type="password"
        />
      </div>
    </div>
    <div class="editItem" v-if="isAdd">
      <span>确认密码：</span>
      <div>
        <el-input
          size="small"
          v-model="adminData.confirmPassword"
          placeholder="请再次输入密码"
          type="password"
        />
      </div>
    </div>
    <div class="editItem">
      <span>昵称：</span>
      <div>
        <el-input
          size="small"
          v-model="adminData.nickname"
          placeholder="请输入昵称"
        />
      </div>
    </div>
    <div class="editItem">
        <span>角色：</span>
        <el-select v-model="adminData.roleId" class="m-2" placeholder="Select">
        <el-option
            v-for="item in roleDatas"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
        />
        </el-select>
    </div>
    <div class="editItem">
      <span></span>
      <div>
        <el-button size="small" type="primary" @click="submitEdit">
          提交
        </el-button>
        <el-button size="small" type="default" @click="clearEdit">
          清空
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
// 导入ELEMENTPLUS 图标
import { Plus } from '@element-plus/icons-vue';
// 导入组合式API
import { reactive, toRefs } from "vue";
// 导入自定义全局变量
import { $defaultValues, ADMIN_UPLOAD_URL, FILE_SERVER_URL } from "../../config/conster";
// 导入用户相关API
import { pageUsers, userAdd, userEdit, userDelete, } from "../../api/admin";
// 导入角色相关API
import { roleList } from "../../api/role";
// 导入消息框
import { $msg_e } from '../../utils/msg'
// 导入消息框
import { $checkPermission } from '../../utils/permit'
// 导入文件上传方法
import { $beforeUpload } from '../../utils/fileUpload'
// 导入全局状态管理对象
import {useStore} from 'vuex'


export default {
  name: "Admin",
  setup() {
    // 返回一个全局状态管理对象
    let $store = useStore()
    // 获取用户权限
    let userPermit = $store.state.admin.userPermission;

    let checkPermis = (permitCode) => {
      return $checkPermission(permitCode, userPermit);
    }

    let data = reactive({
      // 角色下拉列表数据
      roleDatas: [],
      // 表格数据
      tableData: [],
      // 是否打开抽屉
      openDrawar: false,
      // 是否是添加操作
      isAdd: true,
      // 表单数据
      adminData: {
        username: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        roleId: 0,
        // 上传成功后的图片地址
        photo:'',
      },
      // 查询条件
      searchData: {
        username: '',
        roleId: 0,
        // 第几页
        pageIndex: 1,
        // 每页条数
        pageSize: 10,
      },
      // 分页组件
      page: {
        // 可选择每页条数下拉列表数据
        pageSizes: $defaultValues.PAGE.PAGE_SIZES,
        // 当前页
        currentPage: 1,
        // 当前每页条数
        pageSize: 10,
        // 总条数
        total: 0,
      },
      // 文件上传地址
      uploadUrl: ADMIN_UPLOAD_URL,
      fileUrl: FILE_SERVER_URL,
    });
    
    // 获取查询条件中角色下拉列表的数据
    let loadSelect = async () => {
        let res = await roleList();
        data.roleDatas = res.data
        data.roleDatas.unshift({id:0, roleName:'请选择角色'})
    }
    loadSelect()

    // 改变分页条数处理方法
    let handleSizeChange = (val) => {
      data.page.pageSize = val;
      data.searchData.pageSize = val;
      loadTable();
    };

    // 选择页码处理方法
    let handleCurrentChange = (val) => {
      data.searchData.pageIndex = val;
      loadTable();
    };

    // 加载表格数据
    let loadTable = async () => {
      let res = await pageUsers(data.searchData);
      let result = res.data;
      data.tableData = result.records;
      data.page.currentPage = result.current;
      data.page.total = result.total;
    };

    // 执行加载表格数据
    loadTable();

    // TODO 获取权限列表，供选择为上级角色
    // 验证表单
    // 编辑表单
    let submitEdit = async () => {
      let success = false;
      // 判断执行添加还是修改
      if (data.isAdd) {
        success = await userAdd(data.adminData);
      } else {
        success = await userEdit(data.adminData);
      }
      // 成功则刷新表格数据
      if (success) {
        loadTable();
      }
    };

    // 执行修改方法
    let handleEdit = (row) => {
      // 将添加模式修改为编辑模式
      data.isAdd = false;
      // 打开抽屉
      data.openDrawar = true;
      // 获取编辑的行数据，赋值给表单数据
      data.adminData = { ...row };
    };

    // 删除行数据
    let handleDelete = async (id) => {
      let success = await userDelete(id);
      if (success) {
        loadTable();
      }
    };

    // 关闭编辑抽屉事件
    let drawerClose = () => {
      // 关闭抽屉
      data.openDrawar = false;
      data.isAdd = true;
      // 表单清空
      clearEdit();
    };

    let clearEdit = () => {
      // 表单清空
      data.adminData = {
        username: data.isAdd?'':data.adminData.username,
        password: '',
        confirmPassword: '',
        nickname: '',
        roleId: 0,
        photo: '',
      };
    }

    // 文件上传之前
    let beforeAvatarUpload = (file) => {
      return $beforeUpload(file)
    }
    // 文件上传成功后
    let handleAvatarSuccess = (res, file) => {
      data.adminData.photo = res.data
    }

    return {
      ...toRefs(data),
      submitEdit,
      drawerClose,
      handleEdit,
      handleDelete,
      handleSizeChange,
      handleCurrentChange,
      loadTable,
      clearEdit,
      handleAvatarSuccess,
      beforeAvatarUpload,
      checkPermis,
    };
  },
};
</script>
<style scoped lang='scss'>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader{
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  text-align: center;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  height: 178px;
}

</style>