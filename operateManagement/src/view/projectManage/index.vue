<template>
  <div>
    <el-tabs v-model="tabsValue" type="border-card">
      <el-tab-pane label="项目管理">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          style="padding: 20px 12px 0 12px;">
          <el-form-item label="项目名称:">
            <el-input v-model="serchParams.projectName" placeholder="请输入组织名称"></el-input>
          </el-form-item>
          <el-form-item label="地区:">
            <placeSelect @selectPlace="placeChange" :value="placeVal"/>
          </el-form-item>
          <el-form-item label="负责人:">
            <memberSelect :snycModel.sync="serchParams.employeeId" :value="serchParams.employeeId"/>
          </el-form-item>
          <el-form-item label="项目类型:">
            <GetPlatformDict :dictType = "'projectType'" :value="serchParams.projectType" :snycModel.sync="serchParams.projectType"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="时间范围:">
            <el-date-picker v-model="timeArea" @change="timeAreaChange" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" range-separator=" - " value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="金额范围:" class="meneyArea">
            <el-input v-model="serchParams.fundingStart" placeholder="请输入金额"></el-input>
            <span> - </span>
            <el-input v-model="serchParams.fundingEnd" placeholder="请输入金额"></el-input>
          </el-form-item>
          <el-form-item label="项目状态:">
            <GetPlatformDict :dictType = "'projectStatus'" :value="serchParams.projectStatus" :snycModel.sync="serchParams.projectStatus"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="有效状态:">
            <el-select v-model="serchParams.isValid">
              <el-option value="0" label="有效">有效</el-option>
              <el-option value="1" label="已失效">已失效</el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="fr">
            <el-button icon="el-icon-search" type="success" @click="onSearch">搜索</el-button>
            <el-button icon="el-icon-close" type="primary" @click="onRest">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
        <el-row class="mb-20">
          <div class="fr">
            <el-button type="primary" icon="el-icon-plus" class="create" @click="createOrg" v-if="permButton('4101')">创建项目</el-button>
          </div>
        </el-row>
        <el-card class="table information" v-for="item in projectData" :key="item.id" shadow="never">
          <el-row>
            <el-col class="line1" :span="24">
              <span>
                <el-tag type="success" v-if="item.isValid === 0">有效</el-tag>
                <el-tag type="danger" v-else>已失效</el-tag>
                <el-tag type="success" style="margin-left: 5px">{{item.projectStatus | dict('projectStatus')}}</el-tag>
              </span>
              <span style="max-width: 405px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.projectName}}</span>
              <span>业主方：<template v-if="item.cooperationInfos.length>0">{{item.cooperationInfos[0].name}}</template></span>
              <span>合作方：<template v-if="item.cooperationInfos.length>0">{{item.cooperationInfos[1].name}}</template></span>
              <span>负责人：<template v-if="item.employee">{{item.employee.name}}</template></span>
              <span>项目交付时间：{{item.deliveryTime}}</span>
            </el-col>
            <el-col class="line2" :span="24">
              <el-col :span="7">预期总额:{{item.projectFunding}}</el-col>
              <el-col :span="6">收款:{{item.gatheringTotal}}</el-col>
              <el-col :span="6">坏账:{{item.badDebtCostTotal  }}</el-col>
              <el-col :span="7">成本:{{item.costTotal}}</el-col>
              <el-col :span="7">开票:{{item.invoiceTotal}}</el-col>
              <el-col :span="7">预期收益:{{item.expectedEarnings}}</el-col>
              <el-col :span="9" class="work" style="border-right: none">
                <span @click="information(item)" v-if="permButton('4102')">详情</span>
                <!--<span>操作日志</span>-->
                <span v-if="permButton('4112')" @click="edit(item)">编辑</span>
                <span @click="validChange(item)" v-if="item.isValid === 0"><span style="color: red;cursor: pointer" v-if="permButton('4107')">设置失效</span></span>
                <span @click="validChange(item)" v-else><span v-if="permButton('4107')">设置有效</span></span>
              </el-col>
            </el-col>
          </el-row>
        </el-card>
        <div v-if="projectData.length === 0">
          <div style="padding: 30px">
            <el-divider content-position="center">查询数据为空</el-divider>
          </div>
        </div>
        <Pager :total="serchParams.total" :pageTotalChange="handleSizeChange" :size="serchParams.size" :current="serchParams.page" :pageChange="pageChange"></Pager>
      </el-tab-pane>
    </el-tabs>
    <ContentViewDialog ref="checkDialog"/>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { projectPage, projectValid } from "@/api/project";
import ContentViewDialog from './ContentViewDialog'
export default {
  components: {
      ContentViewDialog
  },
  data() {
    return {
      placeVal: [],
      tabsValue: '0',
      loading: false,
      timeArea: '',
      serchParams: {
        page: 1,
        size: 10,
        total: 0,
        projectName: '',
        regionTreeCode: '',
        employeeId: null,
        projectType: null,
        startTime: '',
        endTime: '',
        fundingStart: null,
        fundingEnd: null,
        projectStatus: null,
        isValid: null,
        token: getUser().token
      },
      isValidParams:{
          id: '',
          isValid: ''
      },
      projectData: [],
    }
  },
  created() {
    this.fetchTableData()
  },
  computed: {
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
    edit(v) {
      let vm = this
      vm.$router.push('/business/projectManage/edit/' + v.id)
    },
    createOrg(){
      let vm = this
      vm.$router.push('/business/projectManage/add/' + getNode().id)
    },
    timeAreaChange(v){
      let vm = this
      vm.serchParams.startTime = v[0]
      vm.serchParams.endTime = v[1]
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.serchParams.regionTreeCode = v[v.length-1].treeCode
    },
    // 项目详情
    information(v) {
        let vm = this
        console.log(v)
        vm.$refs['checkDialog'].setFormDatas(v)
        vm.$refs['checkDialog'].show()
    },
    onSearch() {
      let vm = this
      vm.serchParams.page = 1;
      vm.fetchTableData()
    },
    onRest() {
      this.timeArea = ''
      this.placeVal = []
      this.serchParams = {
        page: 1,
        size: 10,
        total: 0,
        projectName: '',
        regionTreeCode: '',
        employeeId: null,
        projectType: null,
        startTime: '',
        endTime: '',
        fundingStart: null,
        fundingEnd: null,
        projectStatus: null,
        isValid: null,
        token: getUser().token
      }
      this.fetchTableData()
    },
    handleSizeChange(val) {
      let vm = this
      vm.serchParams.size = val
      vm.fetchTableData()
    },
    pageChange(val) {
      let vm = this
      vm.serchParams.page = val
      vm.fetchTableData()
    },
    async fetchTableData() {
      let vm = this
      vm.loading = true
      let data = await projectPage(vm.serchParams)
        console.log(data)
      vm.projectData = data.data
      vm.serchParams.total = data.total
      vm.loading = false
    },
    // 设置有效/失效
    validChange(v) {
      let vm = this
      vm.$confirm(`确定要${v.isValid === 0?"有效":"失效"}？`, '提示', {
          type: 'warning'
      }).then(async () => {
          vm.isValidParams = {
              id: v.id,
              isValid: v.isValid === 0 ? 1 : 0,
              token: getUser().token
          }
          const loading = this.$loading({
              lock: true,
              text: '正在设置...'
          })
          try {
              await projectValid(vm.isValidParams)
              vm.$message.success('设置成功')
              vm.fetchTableData()
          } catch (err) {
              console.log(err)
          } finally {
              loading.close()
          }
      }, _.noop)
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