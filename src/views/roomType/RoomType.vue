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
    <el-table-column prop="name" label="房型名称" width="120" />
    <el-table-column prop="bedNum" label="床位数量" width="100" />
    <el-table-column prop="price" label="房型价格" width="100" />
    <el-table-column prop="isEnable" label="是否启用" width="100">
        <template #default="scope">
            <el-switch size="small" v-model="scope.row.isEnable" :active-value="1" :inactive-value="0" @change="handleSwitch(scope.row.id)"/>
        </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" type="warning" @click="handleEdit(scope.row)">
          编辑
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
    :title="isAdd ? '添加房型' : '修改房型'"
    direction="rtl"
    size="40%"
    :before-close="drawerClose"
  >
    <div class="editItem">
      <span>房型名称：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.name"
          placeholder="请输入房型名称"
        />
      </div>
    </div>
    <div class="editItem">
      <span>床位数量：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.bedNum"
          placeholder="请输入床位数量"
        />
      </div>
    </div>
    <div class="editItem">
      <span>房型价格：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.price"
          placeholder="请输入房型价格"
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
      <span>房型描述：</span>
      <div>
        <!-- <el-input
          v-model="formData.description"
          placeholder="请输入房型描述"
          :rows="5"
          maxlength="150"
          type="textarea"
          show-word-limit
        /> -->
        <QuillEditor v-if="openDrawar" theme="snow" contentType="html" v-model:content="formData.description" style="height:300px"/>
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
import { reactive, toRefs } from "vue"
import { listRoomType, addRoomType, editRoomType, deleteRoomType, enableRoomType } from "../../api/roomType.js"
import { $msg_e } from "@/utils/msg"

export default {
  name: "RoomType",
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
        name:'',
        bedNum: '',
        price: '',
        isEnable: 0,
        description: '',
      },
    });

    // 加载表格数据
    let loadTable = async () => {
      let res = await listRoomType();
      data.tableData = res.data;
    };
    // 执行加载表格数据
    loadTable();

    // 编辑表单
    let submitEdit = async () => {
      let success = false;
      // 判断执行添加还是修改
      if (data.isAdd) {
        success = await addRoomType(data.formData);
        clearFormData()
      } else {
        success = await editRoomType(data.formData);
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
      let success = await deleteRoomType(id);
      if (success) {
        loadTable();
      }
    };

    // 停用启用
    let handleSwitch = async (id) => {
      await enableRoomType(id)
    }

    // 关闭编辑抽屉事件
    let drawerClose = () => {
      // 关闭抽屉
      data.openDrawar = false;
      data.isAdd = true;
      clearFormData()
    };

    let clearFormData = () => {
      // 表单清空
      data.formData = {
        name:'',
        bedNum: '',
        price: '',
        isEnable: 0,
        description: '',
      }
      // 清空富文本编辑器内容
      document.querySelector('.ql-editor').innerHTML=""
    }

    return {
      ...toRefs(data),
      submitEdit,
      drawerClose,
      handleEdit,
      handleDelete,
      handleSwitch,
    };
  },
};
</script>
<style scoped lang='scss'>
</style>