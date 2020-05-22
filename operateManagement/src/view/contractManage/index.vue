<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="合同管理" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;">
          <el-form-item label="合同名称:">
            <el-input v-model="searchParams.name" placeholder="请输入合同名称"></el-input>
          </el-form-item>
          <el-form-item label="签订对象:">
            <memberSelect :snycModel.sync="searchParams.customerId" :value="searchParams.customerId"/>
          </el-form-item>
          <el-form-item label="负责人:">
            <memberSelect :snycModel.sync="searchParams.employeeId" :value="searchParams.employeeId"/>
          </el-form-item>
          <el-form-item label="选择项目">
            <projectSelect
              @selectData="selectData"
              :value="searchParams.projectId"
              :snycModel.sync="searchParams.projectId"/>
          </el-form-item>
          <el-form-item label="合同状态">
            <GetPlatformDict
              :dictType="'contractStatus'"
              :value="searchParams.contractStatus"
              :snycModel.sync="searchParams.contractStatus"/>
          </el-form-item>
          <el-form-item label="签订时间：">
            <el-date-picker
                v-model="searchParams.signStartTime"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
                v-model="searchParams.signEndTime"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="到期时间：">
            <el-date-picker
                v-model="searchParams.expireStartTime"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
                v-model="searchParams.expireEndTime"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="收款时间：">
            <el-date-picker
                v-model="searchParams.receivablesStartTime"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
                v-model="searchParams.receivablesEndTime"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
        <el-row class="mb-20">
          <div class="fr">
            <el-button type="primary" @click="writeDaily" class="reateBtn" v-if="permButton('8101')">创建合同</el-button>
          </div>
        </el-row>
        <el-card class="table information" v-for="item in contractData" :key="item.id" shadow="never">
          <el-row>
            <el-col class="line1" :span="24">
              <span>
                <el-tag type="success">{{item.contractStatus | dict('contractStatus')}}</el-tag>
                <!--<el-tag type="danger" v-else>已失效</el-tag>-->
                <el-tag type="success" style="margin-left: 5px">{{item.project.projectName}}</el-tag>
              </span>
              <span style="max-width: 405px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.name}}</span>
              <!--<span>业主方：<template v-if="item.cooperationInfos.length>0">{{item.cooperationInfos[0].name}}</template></span>-->
              <!--<span>合作方：<template v-if="item.cooperationInfos.length>0">{{item.cooperationInfos[1].name}}</template></span>-->
              <span>创建人：<template v-if="item.employee">{{item.employee.name}}</template></span>
              <span>创建时间：{{item.createTime | dateFormatYmdHms}}</span>
            </el-col>
            <el-col class="line2" :span="24">
              <el-col :span="7">签订对象:{{item.creatorEmployee.name}}</el-col>
              <el-col :span="6">负责人:{{item.signTime}}</el-col>
              <el-col :span="6">签订时间:{{item.signTime}}</el-col>
              <el-col :span="7">到期时间:{{item.expireTime}}</el-col>
              <el-col :span="7">收款时间:{{item.receivablesTime}}</el-col>
              <el-col :span="9" class="work" style="border-right: none">
                <!--<span @click="information(item)">详情</span>-->
                <!--<span>操作日志</span>-->
                <span @click="edit(item)"  v-if="permButton('8103')">编辑</span>
                <!--<span @click="validChange(item)" v-if="item.isValid === 0" style="color: red;cursor: pointer">设置失效</span>-->
                <!--<span @click="validChange(item)" v-else>设置有效</span>-->
              </el-col>
            </el-col>
          </el-row>
        </el-card>
        <div v-if="contractData.length === 0" style="clear: both">
          <el-divider content-position="center">查询数据为空</el-divider>
        </div>
        <Pager
          :total="searchParams.total"
          :pageTotalChange="handleSizeChange"
          :size="searchParams.size"
          :current="searchParams.page"
          :pageChange="pageChange"></Pager>
      </el-tab-pane>
    </el-tabs>
    <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { dateFormatYmdHms } from "util";
import { contractPage, contractDel } from "@/api/contract";
import ContentDialog from './ContentDialog'
export default {
  components: {
      ContentDialog
  },
  data() {
    return {
      token: getUser().token,
      dialogHandleType: 'add',
      fileList: [],
      contractData: [],
      targerName: "first",
      searchParams: {
        page: 1,
        size: 10,
        name: '',
        customerId: '',
        employeeId: '',
        projectId: '',
        contractStatus: null,
        signStartTime: '',
        signEndTime: '',
        expireStartTime: '',
        expireEndTime: '',
        receivablesStartTime: '',
        receivablesEndTime: '',
      },
      endPickerOptions: {
        disabledDate: (time) => {
          if (this.searchParams.signStartTime) {
            return time.getTime() < new Date(this.searchParams.signStartTime).getTime()
          } else {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        }
      }
    }
  },
  created() {
    this.fetchTableData();
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

    del (v) {
      let vm = this
      let params = {
          id: v,
          token: getUser().token
      }
      vm.$confirm(`是否删除？`, '提示', {
          type: 'warning'
      }).then(async () => {
          await reportDel(params)
          vm.$message.success('删除成功')
          vm.fetchTableData()
      }, _.noop)
    },
    refreshTable (v) {
      let vm = this
      vm.searchParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
    },
    selectData(v) {
      console.log(v)
    },
    writeDaily(v) {
      let vm = this
      vm.dialogHandleType = 'add'
      vm.$refs['dialog'].show()
    },
    edit(v) {
      let vm = this
      vm.dialogHandleType = 'edit'
      vm.$refs['dialog'].show()
      vm.$refs['dialog'].setFormDatas(v)
    },
    // 搜索
    onSearch() {
      console.log(this.searchParams)
      this.searchParams.page = 1;
      this.fetchTableData();
    },
    // 分页查询
    handleSizeChange(val) {
      let vm = this;
      vm.searchParams.size = val;
      vm.fetchTableData();
    },
    pageChange(val) {
      let vm = this;
      vm.searchParams.page = val;
      vm.fetchTableData();
    },
    // 重置
    Reset() {
      this.searchParams = {
        page: 1,
        size: 10,
        name: '',
        customerId: '',
        employeeId: '',
        projectId: '',
        contractStatus: '',
        signStartTime: '',
        signEndTime: '',
        expireStartTime: '',
        expireEndTime: '',
        receivablesStartTime: '',
        receivablesEndTime: '',
      };
      this.fetchTableData();
    },
    async fetchTableData() {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      vm.searchParams.token = getUser().token
      try {
        let data = await contractPage(vm.searchParams)
        vm.contractData = data.data
        vm.searchParams.total = data.total
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
  }
};
</script>

<style lang="scss">
  .el-divider{
    overflow: visible;
  }
  video{
    background: #000;
  }
  .personList{
    width: 300px;
    height: 140px;
    display: inline-block;
    position: relative;
    margin-right: 20px;
    .delPeople{
      display: inline-block;
      position: absolute;
      right: 16px;
      top: 16px;
      height: 20px;
      width: 20px;
      border-radius: 20px;
      margin: 0;
      padding: 0;
    }
  }
  .table {
    .el-card__body{
      overflow: hidden;
    }
  }
  .table.el-card{
    margin-bottom: 20px;
  }
  .proInfo {
    .el-select{
      width: 100%;
    }
    .el-date-editor{
      width: 100%;
    }
  }
</style>
<style lang="scss" scoped>
  .el-tab-pane {
    background-color: #ffffff;
  }
  .search {
    padding: 10px;
    height: 190px;
    border-bottom: 1px solid #c1c1c1;
    .el-input {
      width: 150px;
    }
    .placeSelect {
      width: 180px;
      float: top;
    }
    .el-row {
      height: 50px;
    }
  }
  .create {
    margin: 20px;
  }
  .cell {
    .el-button {
      padding: 5px;
      font-size: 13px;
    }
  }
  // 分页
  .el-pagination {
    margin-top: 20px;
    float: right;
    width: 750px;
    .el-pagination__total {
    }
    .el-dialog {
      height: 300px;
    }
  }
  .el-select {
    width: 150px;
  }
  .meneyArea {
    .el-input,
    .el-select {
      width: 150px;
    }
  }

  .Pic {
    border: 1px solid #eeeeee;
    height: 120px;
    width: 120px;
    position: relative;
    left: 70px;
    .el-button {
      height: 20px;
      width: 20px;
      border-radius: 20px;
      position: relative;
      left: 20px;
      top: -10px;
      padding: 0;
      margin: 0;
    }
  }
  .name {
    float: left;
  }
  .delectConfirm {
    p {
      text-align: center;
    }
  }
  .personList .el-card {
    width: 300px;
    height: 140px;
    span {
      margin: 5px;
    }
    margin-bottom: 15px;
  }
  .addUser {
    font-size: 45px;
    text-align: center;
    height: 140px;
    line-height: 100px;
  }
  .confrim {
    text-align: center;
    .el-button {
      width: 80px;
      padding: 10px;
    }
  }
  .addConfirm {
    .el-dialog__body{
      padding-left: 0px;
    }
    .el-input-number{
      width: 100%;
      .el-input__inner{
        text-align: left;
      }
    }
    .el-date-editor{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
  }
  .addBtn {
    text-align: right;
  }
  .table {
    width: 100%;
  }
  .line1,
  .line2 {
    display: flex;
    justify-content: space-between;
    float: left;
  }
  .line2 > div {
    border-right: 1px solid #c4c4c4;
    text-align: center;
    margin-top: 5px;
  }
  .line2 > div:first-child{
    text-align: left;
  }
  .line2 > div.work {
    text-align: right;
    span {
      color: green;
      cursor: pointer;
      margin-left: 5px;
    }
    span:hover{
      color: #409eff;
    }
  }
  .row2 {
    .el-input {
      width: 80px;
    }
    .el-date-editor {
      width: 220px;
    }
  }
  .information {
    img {
      border: 1px solid #eeeeee;
      height: 120px;
      width: 120px;
      position: relative;
      left: 70px;
      margin-right: 20px;
    }
  }
  .proInfo {
    .el-form-item {
      padding-top: 5px;
      .el-button {
        float: right;
      }
    }
  }
  .describe{
    background: #E8E8E8;
    padding: 16px;
  }
</style>
