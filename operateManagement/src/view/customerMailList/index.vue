<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      ref="tabs">
      <el-tab-pane label="客户通讯录" name="first">
        <!-- 组织管理筛选 -->
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
          :model="searchParams">
          <el-form-item label="姓名:">
            <el-input v-model="searchParams.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="所在地区:">
            <placeSelect @selectPlace="placeChange" :value="placeVal"/>
          </el-form-item>
          <el-form-item label="公司名称:">
            <el-input v-model="searchParams.company" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="searchParams.telephone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onRest">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row class="mb-20">
          <div class="fr">
            <el-button type="primary" @click="addCustomer" v-if="permButton('2101')">创建客户</el-button>
          </div>
        </el-row>
        <!-- 组织管理列表 -->
        <!--<vue-ueditor-wrap v-model="value" :config="config"></vue-ueditor-wrap>-->
        <el-table border :data="customerData">
          <el-table-column prop="name" label="姓名" width="150px" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column prop="company" label="公司" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column prop="duty" label="职务" width="150px" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column prop="region.name" label="地区" width="150px" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column prop="telephone" label="联系电话" width="200px" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column prop="count" label="关联项目数量"  width="200px" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="check(scope.row)" v-if="permButton('2102')">查看</el-button>
              <el-button size="small" type="text" @click="update(scope.row)" v-if="permButton('2103')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pager
          :total="searchParams.total"
          :pageTotalChange="handleSizeChange"
          :size="searchParams.size"
          :current="searchParams.page"
          :pageChange="pageChange"></Pager>
      </el-tab-pane>
      <!-- 设置负责人 -->
      <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
      <ContentViewDialog ref="checkDialog"></ContentViewDialog>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { getCustomerPage } from '@/api/customerMailList'
import ContentViewDialog from './ContentViewDialog'
import ContentDialog from './ContentDialog'
export default {
  name: 'organization',
  components: {
    ContentDialog, ContentViewDialog
  },
  beforeUpdate() {},
  data() {
    return {
      placeVal: [],
      activeName: 'first',
      dialogHandleType: 'add',
      searchParams: {
        name: '',
        regionTreeCode: null,
        id: null,
        company: '',
        telephone: '',
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      },
      customerData: []
    };
  },
  created(){
    this.fetchTableData()
  },
  methods: {
    permButton(v){
      let f = ''
      if(getPerm().indexOf(v) === -1){
        f = false
      }else {
        f = true
      }
      return f
    },
    // 选择查询组织ID
    orgChanges(v){
      this.searchParams.id = v.id;
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.searchParams.regionTreeCode = v[v.length-1].treeCode
    },
    handleSizeChange(v) {
      this.searchParams.size = v;
      this.fetchTableData();
    },
    pageChange(v) {
      this.searchParams.page = v;
      this.fetchTableData();
    },
    async fetchTableData() {
        let vm = this
        let data = await getCustomerPage(vm.searchParams)
        vm.customerData = data.data
        vm.searchParams.total = data.total
    },
    // 搜索
    onSearch() {
      this.searchParams.page = 1;
      this.fetchTableData();
    },
    // 重置
    onRest() {
      let vm = this;
      vm.searchParams.regionTreeCode = null;
      vm.searchParams.id = null;
      vm.searchParams.company='';
      vm.searchParams.telephone='';
      vm.searchParams.name = '';
      vm.searchParams.page = 1;
      vm.placeVal = [];
      vm.fetchTableData()
    },
    addCustomer() {
      let vm = this
      vm.dialogHandleType = 'add'
      vm.$refs['dialog'].show()
    },
    refreshTable (v) {
      let vm = this
      vm.$refs['dialog'].hide()
      vm.searchParams.page = 1
      vm.fetchTableData()
    },
    // 查看
    check(row) {
      let vm = this
      vm.dialogHandleType = 'check'
      vm.$refs['checkDialog'].setFormDatas(row)
      vm.$refs['checkDialog'].show()
    },
    update(row) {
      let vm = this
      vm.dialogHandleType = 'edit'
      vm.$refs['dialog'].setFormDatas(row)
      vm.$refs['dialog'].show()
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
