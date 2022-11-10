<template>
  <!-- 搜索区域 -->
  <div class="search">
    <el-button size="small" type="primary" @click="openDrawar = true">
      添加
    </el-button>
  </div>
  <!-- 华丽的分割线 -->
  <div><el-divider /></div>
  <!-- 面包屑 -->
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in parentIds" :key="item.id">
        <a @click="clickBreadcrumb(item.id)">{{item.title}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 华丽的分割线 -->
  <div><el-divider /></div>
  <!-- 表格区域 -->
  <el-table
    :data="tableData"
    style="width: 100%"
    size="mini"
    @row-click="rowClick"
  >
    <el-table-column prop="id" label="编号" width="60" />
    <el-table-column prop="title" label="标题" width="100" />
    <el-table-column prop="isEnable" label="是否启用" width="100" >
      <template #default="scope">
        <el-tag class="ml-2" type="success" v-if="scope.row.isEnable == 1">是</el-tag>
        <el-tag class="ml-2" type="danger" v-if="scope.row.isEnable == 0">否</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="isMenu" label="是否菜单" width="100" >
      <template #default="scope">
        <el-tag class="ml-2" type="success" v-if="scope.row.isMenu == 1">是</el-tag>
        <el-tag class="ml-2" type="danger" v-if="scope.row.isMenu == 0">否</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="isLeaf" label="是否叶子" width="100" >
      <template #default="scope">
        <el-tag class="ml-2" type="success" v-if="scope.row.isLeaf == 1">是</el-tag>
        <el-tag class="ml-2" type="danger" v-if="scope.row.isLeaf == 0">否</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="permissionCode" label="权限码" width="180" />
    <el-table-column prop="href" label="链接" width="180" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          size="small"
          type="warning"
          @click.stop="handleEdit(scope.row)"
        >
          编辑
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click.stop="handleDelete(scope.row.id)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 抽屉区域 -->
  <el-drawer
    v-model="openDrawar"
    :title="isAdd ? '添加权限 父权限: ' + (formData.parentTitle == '' ? '权限管理': formData.parentTitle) : '修改权限'"
    direction="rtl"
    size="30%"
    :before-close="drawerClose"
  >
    <div class="editItem">
      <span>标题：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.title"
          placeholder="请输入标题"
        />
      </div>
    </div>
    <div class="editItem">
      <span>链接：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.href"
          placeholder="请输入链接"
        />
      </div>
    </div>
    <div class="editItem">
      <span>是否启用：</span>
      <div>
        <el-switch size="small" v-model="formData.isEnable" :active-value="1" :inactive-value="0"/>
      </div>
    </div>
    <div class="editItem">
      <span>是否菜单：</span>
      <div>
        <el-select v-model="formData.isMenu" class="m-2" clearable>
          <el-option key="" label="请选择" value=""/>
          <el-option key="0" label="否" value="0"/>
          <el-option key="1" label="是" value="1"/>
        </el-select>
      </div>
    </div>
    <div class="editItem">
      <span>是否叶子：</span>
      <div>
        <el-select v-model="formData.isLeaf" class="m-2" clearable>
          <el-option key="" label="请选择" value=""/>
          <el-option key="0" label="否" value="0"/>
          <el-option key="1" label="是" value="1"/>
        </el-select>
      </div>
    </div>
    <div class="editItem">
      <span>权限码：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.permissionCode"
          placeholder="请输入权限码"
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
</template>
  <script>
import { reactive, toRefs } from "vue";
import { resourceList, resourceAdd, resourceEdit, resourceDelete } from "../../api/resource";

export default {
  name: "Resource",
  setup() {
    let data = reactive({
      // 权限父id，用于查询加载对应权限ID的子权限列表
      parentId: 0,
      // 表格数据
      tableData: [],
      // 是否打开增加修改的抽屉
      openDrawar: false,
      // 是否是添加操作
      isAdd: true,
      // 表单数据
      formData: {
        id: '',
        title: '',
        href: '',
        isEnable: '',
        isMenu: '',
        isLeaf: '',
        permissionCode: '',
        parentId: '',
        parentTitle: '',
      },
      // 面包屑数组
      parentIds: [{ title: "权限管理", id: 0 }],
    });

    // 加载表格数据
    let loadTable = async () => {
      let res = await resourceList(data.parentId);
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
        // 将当前列表父ID传入
        data.formData.parentId = data.parentId
        success = await resourceAdd(data.formData);
      } else {
        success = await resourceEdit(data.formData);
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

    // 删除行数据
    let handleDelete = async (id) => {
      let success = await resourceDelete(id)
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
        title: "",
        href: "",
        isEnable: "",
        isMenu: "",
        isLeaf: "",
        permissionCode: "",
        parentId: "",
        parentTitle: '',
      };
    };

    // 行点击进入子权限列表
    let rowClick = (row) => {
      // 判断面包屑是否已经存在该层级
      let isIncludes = false;
      data.parentIds.some((ele) => {
        if (ele.id == row.id) {
          isIncludes = true;
        }
      });
      // 不存在则放入面包屑
      if (!isIncludes) {
        data.parentIds.push({title: row.title, id: row.id});
      }
      // 根据点击行的权限ID查询子权限
      data.parentId = row.id;
      data.formData.parentTitle = row.title 
      loadTable();
    };

    // 面包屑点击处理方法
    let clickBreadcrumb = (id) => {
        // 获取点击的面包屑的索引
        let index = data.parentIds.findIndex((ele) => {
            return ele.id === id;
        });
        // 移除该面包屑及后面的内容
        data.parentIds = data.parentIds.slice(0, index + 1)
        // 重新加载权限列表
        data.parentId = data.parentIds[index].id;
        data.formData.parentTitle = data.parentIds[index].title
        loadTable();
    }

    return {
      ...toRefs(data),
      submitEdit,
      drawerClose,
      handleEdit,
      handleDelete,
      rowClick,
      clickBreadcrumb,
    };
  },
};
</script>
<style scoped lang='scss'>
.breadcrumb {
  margin: 10px;
}
</style>