<template>
    <!-- 搜索区域 -->
    <div class="search">
      <span>客房名称：</span>
      <div style="width:130px">
        <el-input size="small" v-model="searchData.name" placeholder="请输入客房名称" />
      </div>
      <span>客房状态：</span>
      <div style="width:130px">
        <el-select v-model="searchData.status" class="m-2" size="small">
          <el-option
            v-for="item in roomStatus"
            :key="item.roomStatus"
            :label="item.roomStatusName"
            :value="item.roomStatus"
          />
        </el-select>
      </div>
      <span>客房类型：</span>
      <div style="width:130px">
        <el-select v-model="searchData.roomTypeId" class="m-2" size="small">
          <el-option
            v-for="item in roomTypeForSearch"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
          </el-select>
        </div>
      <el-button size="small" type="success" @click="loadTable">
        查询
      </el-button>
      <el-button size="small" type="primary" @click="openDrawar = true">
        添加
      </el-button>
    </div>
    <!-- 华丽的分割线 -->
    <div><el-divider /></div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column prop="code" label="房号" width="120" />
      <el-table-column prop="name" label="名称" width="120" />
      <el-table-column prop="roomTypeName" label="类型" width="130" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column prop="status" label="状态" width="100" >
        <template #default="scope">
          <el-tag class="ml-2" type="success" v-if="scope.row.status == 1">空闲</el-tag>
          <el-tag class="ml-2" v-if="scope.row.status == 2">预定</el-tag>
          <el-tag class="ml-2" type="warning" v-if="scope.row.status == 3">入住</el-tag>
          <el-tag class="ml-2" type="danger" v-if="scope.row.status == 4">维修</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isEnable" label="是否启用" width="100">
          <template #default="scope">
              <el-switch size="small" v-model="scope.row.isEnable" :active-value="1" :inactive-value="0" @change="handleSwitch(scope.row.id)"/>
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="warning" @click="handleImg(scope.row)">
            图片
          </el-button>
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
    <!-- 分页插件 -->
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
      :title="isAdd ? '添加客房' : '修改客房'"
      direction="rtl"
      size="40%"
      :before-close="drawerClose"
    >
    <div class="editItem">
        <span>房号：</span>
        <div>
          <el-input
            size="small"
            v-model="formData.code"
            placeholder="请输入房号"
          />
        </div>
      </div>
      <div class="editItem">
        <span>房名：</span>
        <div>
          <el-input
            size="small"
            v-model="formData.name"
            placeholder="请输入客房名称"
          />
        </div>
      </div>
      <div class="editItem">
        <span>价格：</span>
        <div>
          <el-input
            size="small"
            v-model="formData.price"
            placeholder="请输入房型价格"
          />
        </div>
      </div>
      <div class="editItem">
        <span>状态：</span>
        <div>
          <el-select v-model="formData.status" class="m-2" clearable>
            <el-option
              v-for="item in roomStatus" v-show="item.roomStatus != 2 && item.roomStatus != 3 && item.roomStatus != 4"
              :key="item.roomStatus"
              :label="item.roomStatusName"
              :value="item.roomStatus"
            />
          </el-select>
        </div>
      </div>
      <div class="editItem">
        <span>类型：</span>
        <div>
          <el-select v-model="formData.roomTypeId" class="m-2" clearable>
            <el-option
              v-for="item in roomTypeForModify"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <div class="editItem">
        <span>是否启用：</span>
        <div>
          <el-switch size="small" v-model="formData.isEnable" :active-value="1" :inactive-value="0"/>
        </div>
      </div>
      <div class="editItem">
        <span>描述：</span>
        <div>
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
    <!-- 图片弹框 -->
    <el-dialog v-model="imgListDialogVisible" :title="'图片上传-' + roomImgData.name" @close="imgList=[]">
      <el-upload
        list-type="picture-card"
        :limit="8"
        v-model:file-list="imgList"
        :action="uploadUrl"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="imgDialogVisible" width="50%">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%"/>
      </el-dialog>

    </el-dialog>
  </template>
  <script>
  import { reactive, toRefs } from "vue"
  import { listRoom, addRoom, editRoom, deleteRoom, enableRoom, listRoomImg, addRoomImg, deleteRoomImg,} from "../../api/room.js"
  import { listRoomTypeForEnable } from "../../api/roomType.js"
  import { $defaultValues, ROOM_STATUS, FILE_SERVER_URL, ADMIN_UPLOAD_URL } from '../../config/conster'
  // 导入文件上传方法
  import { $beforeUpload } from '../../utils/fileUpload'

  export default {
    name: "RoomType",
    setup() {
      let data = reactive({
        // ===========  列表处理  ==========
        // 查询条件
        searchData: {
          status: 0,
          roomTypeId: 0,
          // 第几页
          pageIndex: 1,
          // 每页条数
          pageSize: 10,
        },
        // 表格数据
        tableData: [],
        // 客房状态
        roomStatus: ROOM_STATUS,
        // 添加修改客房类型下拉数据
        roomTypeForModify:[],
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
        // ===========  编辑处理  ==========
        // 是否打开抽屉
        openDrawar: false,
        // 是否是添加操作
        isAdd: true,
        // 查询条件客房类型下拉数据
        roomTypeForSearch:[],
        // 添加修改表单数据
        formData: {
          id:'',
          code:'',
          name:'',
          price: '',
          status: 0,
          roomTypeId: 0,
          isEnable: 0,
          description: '',
        },

        // ===========  图片处理  ==========
        // 图片上传数据
        roomImgData:{
          id:'',
          name:'',
        },
        // 是否显示图片弹窗
        imgListDialogVisible: false,
        // 图片墙图片数据
        imgList:[],
        // 点开具体图片的url
        dialogImageUrl:'',
        // 图片弹框是否可见
        imgDialogVisible: false,
        // 文件上传地址
        uploadUrl: ADMIN_UPLOAD_URL,
        // 文件服务地址
        fileUrl: FILE_SERVER_URL,
      });

      // 获取房型下拉列表数据
      let fetchRoomTypeList = async () => {
        let roomTypeRes = await listRoomTypeForEnable();
        roomTypeRes.data.unshift({id:0, name:'请选择'})
        // 设置查询用的下拉框数据
        data.roomTypeForSearch = roomTypeRes.data
        // 设置添加修改用的下拉框数据
        data.roomTypeForModify = roomTypeRes.data
      }
      fetchRoomTypeList();
      
      // 加载表格数据
      let loadTable = async () => {
        let res = await listRoom(data.searchData);
        data.tableData = res.data.records
        data.page.total = res.data.total;
      };
      // 执行加载表格数据
      loadTable();

          // 改变分页条数处理方法
      let handleSizeChange = (val) => {
        // 查询用每页条数更改
        data.searchData.pageSize = val
        // 分页插件每页条数更改
        data.page.pageSize = val
        loadTable();
      };

      // 选择页码处理方法
      let handleCurrentChange = (val) => {
        // 查询用当前页更改
        data.searchData.pageIndex = val;
        // 分页插件当前页更改
        data.page.currentPage = val;
        loadTable();
      };
  
      // 编辑表单
      let submitEdit = async () => {
        let success = false;
        // 判断执行添加还是修改
        if (data.isAdd) {
          success = await addRoom(data.formData);
          if (success) {
            clearFormData()
          }
        } else {
          success = await editRoom(data.formData);
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
        let success = await deleteRoom(id);
        if (success) {
          loadTable();
        }
      };

      // 启用停用房间
      let handleSwitch = async (id) => {
        await enableRoom(id)
      }

      // 打开图片弹框
      let handleImg = async (row) => {
        data.roomImgData.name = row.name
        data.roomImgData.id = row.id
        // 获取图片列表
        let res = await listRoomImg(data.roomImgData.id)
        // 添加图片服务器域名前缀
        Array.from(res.data).forEach(e => {
          e.url = FILE_SERVER_URL + e.url
        })
        data.imgList = res.data
        data.imgListDialogVisible = true;
      }

      // 预览图片
      let handlePictureCardPreview = (uploadFile) => {
        data.dialogImageUrl = uploadFile.url
        data.imgDialogVisible = true
      }

      // 文件上传之前
      let beforeAvatarUpload = (file) => {
        return $beforeUpload(file)
      }
      // 文件上传成功后
      let handleAvatarSuccess = async (res, file) => {
        // 将图片url数据保存到后台DB
        await addRoomImg({roomId: data.roomImgData.id, url: res.data})
      }
      // 删除图片
      let handleRemove = async (file) => {
        let res = await deleteRoomImg(file.id)
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
          id:'',
          name:'',
          price: '',
          status: 0,
          roomTypeId: 0,
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
        loadTable,
        handleSizeChange,
        handleCurrentChange,
        handleImg,
        handlePictureCardPreview,
        beforeAvatarUpload,
        handleAvatarSuccess,
        handleRemove,
      };
    },
  };
  </script>
  <style scoped lang='scss'>
  </style>