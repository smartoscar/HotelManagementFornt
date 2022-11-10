<template>
  <!-- 搜索区域 -->
  <div class="search">
    <el-button size="small" type="primary" @click="openDrawar = true">
      添加
    </el-button>
  </div>
  <!-- 华丽的分割线 -->
  <div><el-divider /></div>
  <!-- 表格区域 -->
  <el-table :data="tableData" style="width: 100%" size="mini">
    <el-table-column prop="id" label="编号" width="100" />
    <el-table-column prop="roleName" label="角色名" width="100" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" type="warning" @click="handleEdit(scope.row)">
          编辑
        </el-button>
        <el-button size="small" type="warning" @click="handleEditPermission(scope.row)">
          权限
        </el-button>
        <el-popconfirm
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
  <!-- 抽屉区域 -->
  <el-drawer
    v-model="openDrawar"
    :title="isAdd ? '添加角色' : '修改角色'"
    direction="rtl"
    size="30%"
    :before-close="drawerClose"
  >
    <div class="editItem">
      <span>角色名称：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.roleName"
          placeholder="请输入角色名"
        />
      </div>
    </div>
    <div class="editItem">
      <span></span>
      <div>
        <el-button size="small" type="primary" @click="submitEdit">
          提交
        </el-button>
      </div>
    </div>
  </el-drawer>
  <!-- 权限树弹框区域 -->
  <el-dialog v-model="showRoleResource" :title="'角色权限编辑-' + editPermissionRole.roleName">
    <el-tree
      ref="treeRef"
      :data="permissions"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :default-checked-keys="rolePermissions"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showRoleResource = false">取消</el-button>
        <el-button type="primary" @click="updateRoleResource">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs, ref } from "vue"
import { roleList, roleAdd, roleEdit, roleDelete, 
  editRolePermission, rolePermissionList } from "../../api/role"
import { $msg_e } from "@/utils/msg"

export default {
  name: "Role",
  setup() {
    let data = reactive({
      // 表格数据
      tableData: [],
      // 是否打开抽屉
      openDrawar: false,
      // 是否是添加操作
      isAdd: true,
      // 表单数据
      formData: {
        roleName: "",
      },
      // 权限列表是否打开
      showRoleResource: false,
      // 修改角色权限发送的权限
      editPermissionRole:{
        id: '',
        roleName: '',
      },
      // 角色权限数据
      permissions:[],
      // 角色权限数据
      rolePermissions:[],
    });

    const treeRef = ref(null)

    // 加载表格数据
    let loadTable = async () => {
      let res = await roleList();
      data.tableData = res.data;
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
        success = await roleAdd(data.formData);
      } else {
        success = await roleEdit(data.formData);
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
      data.formData = { ...row };
    };

    let handleEditPermission = (row)=>{
      // 打开对话框之前，先清空数据，以免上一次打开对话框的数据展示到此次页面中
      data.permissions = []
      data.rolePermissions = []
      // 将当前行roleId进行存储
      console.log(row);
      data.editPermissionRole.id = row.id
      data.editPermissionRole.roleName = row.roleName
      let res = rolePermissionList(row.id).then(res => {
        // 权限树数据
        data.permissions = res.data.resourceList
        // 将title改为label
        data.permissions = JSON.parse(JSON.stringify(res.data.resourceList).replace(/"title"/g,'"label"'))
        // 角色权限数据
        console.log(res.data.roleResourceList);
        data.rolePermissions = res.data.roleResourceList.map(item => {
          return item.id;
        })
        data.showRoleResource = true
        // 以下设置方法无法在树创建时一并赋值
        // if(treeRef.value) {
        //   treeRef.value.setCheckedKeys(data.rolePermissions, true)
        // }
      })
    }

    // 更新权限
    let updateRoleResource = async () => {
      let params = treeRef.value.getCheckedNodes(false, true).map(item => {
        return item.id;
      })
      let res = await editRolePermission(params, data.editPermissionRole.id)
      if(res.status == 1){
        $msg_e(res.msg)
      } else {
        data.showRoleResource = false
      }
    }

    // 删除行数据
    let handleDelete = async (id) => {
      let success = await roleDelete(id);
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
      data.formData = {
        id: "",
        roleName: "",
      };
    };

    return {
      ...toRefs(data),
      treeRef,
      submitEdit,
      drawerClose,
      handleEdit,
      handleDelete,
      handleEditPermission,
      updateRoleResource,
    };
  },
};
</script>
<style scoped lang='scss'>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>