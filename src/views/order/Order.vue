<template>
  <!-- 搜索区域 -->
  <div class="search">
    <div>
      <span>订单号：</span>
      <div style="width: 130px">
        <el-input
          size="small"
          v-model="searchData.orderId"
          placeholder="请输入订单号"
        />
      </div>
      <span>房型：</span>
      <div style="width: 150px">
        <el-select
          v-model="searchData.roomTypeId"
          class="m-2"
          size="small"
          @change="changeRoomTypeForSearch"
        >
          <el-option
            v-for="item in roomTypesForSearch"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <span>房号：</span>
      <div style="width: 130px">
        <el-select v-model="searchData.roomCode" class="m-2" size="small">
          <el-option
            v-for="item in roomsForSearch"
            :key="item.code"
            :label="item.code + '-' + item.name"
            :value="item.code"
          />
        </el-select>
      </div>
    </div>
    <div>
      <span>入住日：</span>
      <div>
        <el-date-picker
          v-model="bookDateForSearch"
          @change="changeBookDateForSearch"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          value-format="YYYY-MM-DD"
        />
      </div>
      <span>实际入住日：</span>
      <div>
        <el-date-picker
          v-model="checkinDateForSearch"
          @change="changeCheckinDateForSearch"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        />
      </div>
      <div>
        <el-button size="small" type="success" @click="loadTable">
          查询
        </el-button>
        <el-button size="small" type="primary" @click="openDrawar = true"
          >添加</el-button
        >
      </div>
    </div>
  </div>
  <!-- 华丽的分割线 -->
  <div><el-divider /></div>
  <!-- 表格区域 -->
  <el-table :data="tableData" style="width: 100%" size="mini">
    <el-table-column prop="orderId" label="订单号" width="180" />
    <el-table-column prop="roomCode" label="房间号" width="70" />
    <el-table-column prop="days" label="预定天数" width="80" />
    <el-table-column prop="startDate" label="入住日" width="110" />
    <el-table-column prop="endDate" label="退房日" width="110" />
    <el-table-column prop="checkinTime" label="实际入住日" width="170">
      <template #default="scope">
        {{ dateTimeFormater(scope.row.checkinTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="checkoutTime" label="实际退房日" width="170">
      <template #default="scope">
        {{ dateTimeFormater(scope.row.checkoutTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" width="70">
      <template #default="scope">
        <el-tag class="ml-2" type="success" v-if="scope.row.status == 1"
          >预定</el-tag
        >
        <el-tag class="ml-2" v-if="scope.row.status == 2">付款</el-tag>
        <el-tag class="ml-2" type="danger" v-if="scope.row.status == 3">取消</el-tag>
        <el-tag class="ml-2" type="warning" v-if="scope.row.status == 4"
          >入住</el-tag
        >
        <el-tag class="ml-2" type="danger" v-if="scope.row.status == 5"
          >退房</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column prop="amount" label="金额" width="80" />
    <el-table-column prop="settlementAmount" label="结算金额" width="100" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" type="warning" @click="handleEdit(scope.row)">
          编辑
        </el-button>
        <el-button size="small" type="warning" @click="handleProcess(scope.row.id, 3)">
          取消
        </el-button>
        <el-button
          size="small"
          type="warning"
          @click="handleProcess(scope.row.id, 4)"
        >
          入住
        </el-button>
        <el-popconfirm
          title="是否进行结算?"
          @confirm="handleProcess(scope.row.id, 5)"
          cancel-button-text="取消"
          confirm-button-text="确认"
        >
          <template #reference>
            <el-button size="small" type="danger"> 结算 </el-button>
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
    :title="isAdd ? '添加订单' : '修改订单'"
    direction="rtl"
    size="40%"
    :before-close="drawerClose"
  >
    <div class="editItem" v-if="!isAdd">
      <span>订单号：</span>
      <div>
        <el-input size="small" v-model="formData.orderId" readonly />
      </div>
    </div>
    <div class="editItem">
      <span>顾客电话：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.phone"
          placeholder="请输入顾客电话"
        />
      </div>
    </div>
    <div class="editItem">
      <span>证件类型：</span>
      <div>
        <el-select v-model="formData.identifyType" class="m-2" clearable>
          <el-option :key="0" :value="0" label="请选择" />
          <el-option :key="1" :value="1" label="身份证" />
          <el-option :key="2" :value="2" label="居住证" />
          <el-option :key="3" :value="3" label="护照" />
        </el-select>
      </div>
    </div>
    <div class="editItem">
      <span>证件号：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.identifyId"
          placeholder="请输入押金"
        />
      </div>
    </div>
    <div class="editItem">
      <span>房型：</span>
      <div>
        <el-select
          v-model="formData.roomType"
          class="m-2"
          clearable
          @change="changeRoomTypeForModify"
        >
          <el-option
            v-for="item in roomTypesForModify"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>
    <div class="editItem">
      <span>房号：</span>
      <div>
        <el-select v-model="formData.roomCode" class="m-2" clearable>
          <el-option
            v-for="item in roomsForModify"
            :key="item.code"
            :label="item.code + '-' + item.name"
            :value="item.code"
          />
        </el-select>
      </div>
    </div>
    <div class="editItem">
      <span>押金：</span>
      <div>
        <el-input
          size="small"
          v-model="formData.deposit"
          placeholder="请输入押金"
        />
      </div>
    </div>
    <div class="editItem">
      <span>日期：</span>
      <div>
        <el-date-picker
          v-model="bookDateForModify"
          @change="changeBookDateForModify"
          type="daterange"
          range-separator="~"
          start-placeholder="入住时间"
          end-placeholder="退房时间"
          size="small"
          value-format="YYYY-MM-DD"
        />
      </div>
    </div>
    <div class="editItem">
      <span>总价：</span>
      <div>
        <el-input size="small" v-model="formData.amount" />
      </div>
    </div>
    <div class="editItem">
      <span>结算金额：</span>
      <div>
        <el-input size="small" v-model="formData.settlementAmount" />
      </div>
    </div>
    <div class="editItem">
      <span>实际日期：</span>
      <div>
        <el-date-picker
          v-model="checkinDateForModify"
          @change="changeCheckinDateForModify"
          type="datetimerange"
          range-separator="~"
          start-placeholder="入住时间"
          end-placeholder="退房时间"
          size="small"
          value-format="YYYY-MM-DD"
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
import { reactive, toRefs, computed } from "vue";
import { $defaultValues } from "../../config/conster";
import {
  listRoomOrder,
  addRoomOrder,
  editRoomOrder,
  processRoomOrder,
} from "../../api/roomOrder";
import { listRoomTypeForEnable } from "../../api/roomType.js";
import { listRoomNoPage, oneRoomByCode } from "../../api/room.js";
import { oneCustomer } from "../../api/customer.js";
import { dateTimeFormat } from "../../utils/dateTimeFormat";

export default {
  name: "Order",
  setup() {
    let data = reactive({
      // 查询条件
      searchData: {
        orderId: "",
        roomCode: "",
        status: "",
        roomTypeId: "",
        startDate: "",
        endDate: "",
        checkinTime: "",
        checkoutTime: "",
      },
      // 表格数据
      tableData: [],
      roomTypesForSearch: [],
      roomsForSearch: [],
      roomTypesForModify: [],
      roomsForModify: [],
      // ================  编辑 ================
      // 是否打开抽屉
      openDrawar: false,
      isAdd: true,
      bookDateForSearch: [],
      checkinDateForSearch: [],
      bookDateForModify: [],
      checkinDateForModify: [],
      // 添加修改表单数据
      formData: {
        id: "",
        orderId: "",
        roomType: "",
        roomCode: "",
        deposit: "",
        startDate: "",
        endDate: "",
        amount: "",
        settlementAmount: "",
        checkinTime: "",
        checkoutTime: "",
        days: "",
        phone: "",
        identifyId: "",
        identifyType: "",
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: $defaultValues.PAGE.PAGE_SIZES,
        total: 0,
      },
    });

    // 由于后台LocalDateTime设置jsonFormat后出现bad request错误
    // 此处日期时间格式化在前端进行
    let dateTimeFormater = (time) => {
      if (time) {
        return dateTimeFormat(time);
      } else {
        return "";
      }
    };

    // 加载房型下拉
    let loadRoomType = async () => {
      let res = await listRoomTypeForEnable();
      data.roomTypesForSearch = res.data;
      data.roomTypesForModify = res.data;
    };
    loadRoomType();

    // 查询条件房型下拉联动客房下拉
    let changeRoomTypeForSearch = async (val) => {
      data.searchData.roomCode = "";
      let res = await listRoomNoPage(val);
      data.roomsForSearch = res.data;
    };

    // 编辑页面房型下拉联动客房下拉
    let changeRoomTypeForModify = async (val) => {
      data.formData.roomCode = "";
      let res = await listRoomNoPage(val);
      data.roomsForModify = res.data;
    };

    // 加载表格数据
    let loadTable = async () => {
      let res = await listRoomOrder(data.searchData);
      data.tableData = res.data.records;
      data.page.total = res.data.total;
    };
    // 执行加载表格数据
    loadTable();

    // 改变分页条数处理方法
    let handleSizeChange = (val) => {
      // 查询用每页条数更改
      data.searchData.pageSize = val;
      // 分页插件每页条数更改
      data.page.pageSize = val;
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

    // 日期时间控件数组数据分配到对应的表单数据
    let changeBookDateForSearch = (val) => {
      data.searchData.startDate = val[0];
      data.searchData.endDate = val[1];
    };
    let changeCheckinDateForSearch = (val) => {
      data.searchData.checkinTime = val[0];
      data.searchData.checkoutTime = val[1];
    };
    let changeBookDateForModify = (val) => {
      data.formData.startDate = val[0];
      data.formData.endDate = val[1];
    };
    let changeCheckinDateForModify = (val) => {
      data.formData.checkinTime = val[0];
      data.formData.checkoutTime = val[1];
    };

    // 抽屉表单内容提交，添加或者修改
    let submitEdit = async () => {
      let success = false;
      if (data.isAdd) {
        success = await addRoomOrder(data.formData);
        if (success) {
          clearFormData();
        }
      } else {
        success = await editRoomOrder(data.formData);
      }
      // 成功则刷新表格数据
      if (success) {
        loadTable();
      }
    };

    // 点击编辑打开修改页面
    let handleEdit = async (row) => {
      data.openDrawar = true;
      data.isAdd = false;
      console.log(row);
      // 表单回填
      data.formData = row;
      data.bookDateForModify.push(row.startDate);
      data.bookDateForModify.push(row.endDate);
      data.checkinDateForModify.push(row.checkinTime);
      data.checkinDateForModify.push(row.checkoutTime);

      // 获取顾客信息
      let customerRes = await oneCustomer(row.customerId);
      data.formData.phone = customerRes.data.phone;
      data.formData.identifyId = customerRes.data.identifyId;
      data.formData.identifyType = customerRes.data.identifyType;

      // 获取客房房型, 以及房型对应的客房下拉数据
      let roomRes = await oneRoomByCode(row.roomCode);
      data.formData.roomType = roomRes.data.roomTypeId;
      let roomsRes = await listRoomNoPage(data.formData.roomType);
      data.roomsForModify = roomsRes.data;
    };

    // 取消，入住，结算
    let handleProcess = async (id, status) => {
      let r = await processRoomOrder({id, status});
      loadTable();
    };

    // 抽屉关闭清空表单
    let drawerClose = () => {
      data.openDrawar = false;
      clearFormData();
    };

    // 清空表单
    let clearFormData = () => {
      data.formData = {
        id: "",
        orderId: "",
        roomType: "",
        roomCode: "",
        deposit: "",
        startDate: "",
        endDate: "",
        amount: "",
        settlementAmount: "",
        checkinTime: "",
        checkoutTime: "",
        days: "",
        phone: "",
        identifyId: "",
        identifyType: "",
      };
      data.bookDateForModify = [];
      data.checkinDateForModify = [];
    };

    return {
      ...toRefs(data),
      changeRoomTypeForSearch,
      changeRoomTypeForModify,
      loadTable,
      handleSizeChange,
      handleCurrentChange,
      changeBookDateForSearch,
      changeCheckinDateForSearch,
      changeBookDateForModify,
      changeCheckinDateForModify,
      submitEdit,
      dateTimeFormater,
      drawerClose,
      handleEdit,
      handleProcess,
    };
  },
};
</script>
<style scoped lang='scss'>
</style>