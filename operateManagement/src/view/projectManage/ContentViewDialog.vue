<template>
  <el-dialog
    :visible.sync="visible"
    title="查看项目详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="1040px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="项目详情" name="first">
        <el-row>
          <el-form ref="myForm" label-width="140px" style="padding: 0 10px;">
            <el-col :span="12">
              <el-form-item label="项目名称：">
                <div class="view-content">{{project.project_add_params.projectName}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目类型：">
                <div class="view-content">{{project.project_add_params.projectType | dict('projectType')}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人：">
                <div class="view-content">{{project.project_add_params.employeeName}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间：">
                <div class="view-content">{{project.project_add_params.settingTime}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交付时间：">
                <div class="view-content">{{project.project_add_params.deliveryTime}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目资金：">
                <div class="view-content">{{project.project_add_params.projectFunding}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目状态：">
                <div class="view-content">{{project.project_add_params.projectStatus | dict('projectStatus')}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区：">
<!--                <div class="view-content">{{project.project_add_params.regionId}}</div>-->
                <placeSelect @selectPlace="placeChange" :value="placeVal" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目资金说明：">
                <div class="view-content" v-html="project.project_add_params.hstoneProjectRichEdits[0].content"></div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目需要解决问题：">
                <div class="view-content" v-html="project.project_add_params.hstoneProjectRichEdits[1].content"></div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目目标效果：">
                <div class="view-content" v-html="project.project_add_params.hstoneProjectRichEdits[2].content"></div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="明确需求：">
                <div class="view-content" v-html="project.project_add_params.hstoneProjectRichEdits[3].content"></div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目说明：">
                <div class="view-content" v-html="project.project_add_params.hstoneProjectRichEdits[4].content"></div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="推动基础：" style="margin-bottom: 10px">
                <el-checkbox-group v-model="checkedList">
                  <el-checkbox v-for="v in typesData" :label="v.value" disabled :key="v.value">{{v.value}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label-width="65px">
                <div class="view-content" v-html="project.project_add_params.hstoneProjectRichEdits[5].content"></div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-col :span="24" v-if="project.project_add_params.hstoneFileEntityRelas.length > 0">
                <el-form-item label="项目附件：">
                  <v-doc-list :list="project.project_add_params.hstoneFileEntityRelas"></v-doc-list>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" style="border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;">
              <span>业主信息</span>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业主方：">
                <div class="view-content">
                  {{project.project_add_params.cooperationInfos[0].name}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址信息：">
                <div class="view-content">
                  {{placeVals[0]}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址：">
                <div class="view-content">
                  {{project.project_add_params.cooperationInfos[0].detailedAddress}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="关系人：">
                <div class="personList" v-for="(item,n) in project.ownerList" :key="item.id + n" v-if="item.id">
                  <el-card shadow="hover">
                    <p>
                      <span>{{item.name}}</span>
                      <span style="padding: 0px 10px;">
                    <span v-if="item.sex === 1">男</span>
                    <span v-else>女</span>
                  </span>
                      <span :title="item.duty">{{item.duty}}</span>
                    </p>
                    <p>
                      <span >电话：{{item.telephone}}</span>
                    </p>
                    <p><span :title="item.remark">备注：{{item.remark}}</span></p>
                  </el-card>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;">
              <span>合作信息</span>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业主方：">
                <div class="view-content">
                  {{project.project_add_params.cooperationInfos[1].name}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址：">
                <div class="view-content">
                  {{project.project_add_params.cooperationInfos[1].detailedAddress}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="关系人：">
                <div class="personList" v-for="item in project.cooperList" :key="item.id" v-if="item.id">
                  <el-card shadow="hover">
                    <p>
                      <span>{{item.name}}</span>
                      <span style="padding: 0px 10px;">
                    <span v-if="item.sex === 1">男</span>
                    <span v-else>女</span>
                  </span>
                      <span :title="item.duty">{{item.duty}}</span>
                    </p>
                    <p>
                      <span >电话：{{item.telephone}}</span>
                    </p>
                    <p><span :title="item.remark">备注：{{item.remark}}</span></p>
                  </el-card>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合作支撑：" style="margin-bottom: 10px">
                <el-checkbox-group v-model="checkedLists">
                  <el-checkbox v-for="(v,n) in advantageData" :label="v.value" disabled :key="n">{{v.value}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label-width="65px">
                <div class="view-content" v-html="project.project_add_params.cooperationInfos[1].cooperationSupportDetails"></div>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="合同详情" name="second">
        <el-card class="table information" v-for="item in contractData" :key="item.id" shadow="never">
          <el-row>
            <el-col class="line1" :span="24">
              <span>
                <el-tag type="success">{{item.contractStatus | dict('contractStatus')}}</el-tag>
                <!--<el-tag type="danger" v-else>已失效</el-tag>-->
                <el-tag type="success" style="margin-left: 5px">{{project.project_add_params.projectName}}</el-tag>
              </span>
              <span style="max-width: 405px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.name}}</span>
              <!--<span>业主方：<template v-if="item.cooperationInfos.length>0">{{item.cooperationInfos[0].name}}</template></span>-->
              <!--<span>合作方：<template v-if="item.cooperationInfos.length>0">{{item.cooperationInfos[1].name}}</template></span>-->
              <span>创建人：<template v-if="item.employee">{{item.employee.name}}</template></span>
              <span>创建时间：{{item.createTime}}</span>
            </el-col>
            <el-col class="line2" :span="24">
              <el-col :span="8">签订对象:{{item.creatorEmployee.name}}</el-col>
              <el-col :span="8">负责人:{{item.signTime}}</el-col>
              <el-col :span="8">签订时间:{{item.signTime}}</el-col>
              <el-col :span="9">到期时间:{{item.expireTime}}</el-col>
              <el-col :span="9" style="border-right: 0px">收款时间:{{item.receivablesTime}}</el-col>
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
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" @click="visible = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getPlaceParent } from '@/api/common'
import { getUser, getDict } from '@/utils/auth'
import { contractPageDetails } from "@/api/project";
import { mapState } from 'vuex'
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      placeVal: [],
      placeVals: [],
      projectId: '',
      checkedList: [],
      checkedLists: [],
      advantageData: [],
      contractData: [],
      searchParams: {
        page: 1,
        size: 10,
        projectId: '',
        total: 0
      },
      typesData: [
        {value: '商务推动',id: '1'},
        {value: '模式推动',id: '2'},
        {value: '成本推动',id: '3'},
        {value: '产品和技术推动',id: '4'},
      ],
      activeName: 'first',
      token: getUser().token,
    }
  },
  computed: {
    ...mapState([
        'project'
    ]),
  },
  created() {},
  methods: {
    async getPlaceParent(v){
      let params = {
        id: v,
        levelNum: 0,
        token: getUser().token
      }
      this.placeVals = []
      let { data } = await getPlaceParent(params)
      console.log(this.placeVal)
      this.placeVals.push(data.parentsNameStr)
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.serchParams.regionId = v[v.length-1].value
    },
    onOpen () {

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
    async fetchTableData() {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      vm.searchParams.token = getUser().token
      vm.searchParams.projectId = vm.projectId
      try {
        let data = await contractPageDetails(vm.searchParams)
        vm.contractData = data.data
        vm.searchParams.total = data.total
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    async setFormDatas (data) {
      let vm = this
      vm.projectId = data.id
      await vm.$store.dispatch('project_one_fn', vm)
      vm.project.ownerList = []
      vm.project.cooperList = []
      let val =  vm.project.project_add_params.cooperationInfos[0]
      let vals = vm.project.project_add_params.cooperationInfos[1]
      let datas = vm.project.project_add_params
      if(val) {
          vm.getPlaceParents(datas.regionId)
          vm.getPlaceParent(val.regionId)
          if(val.participants.length > 0){
              val.participants.forEach(function (v) {
                  vm.project.ownerList.push({
                      id: v.customer.id,
                      name: v.customer.name,
                      company: v.customer.company,
                      duty: v.customer.duty,
                      telephone: v.customer.telephone,
                      sex: v.customer.sex,
                      remark: v.customer.remark,
                      regionId: v.customer.regionId
                  })
              })
          }
      }
      if(vals) {
          if(vals.participants.length > 0){
              vals.participants.forEach(function (v) {
                  vm.project.cooperList.push({
                      id: v.customer.id,
                      name: v.customer.name,
                      company: v.customer.company,
                      duty: v.customer.duty,
                      telephone: v.customer.telephone,
                      sex: v.customer.sex,
                      remark: v.customer.remark,
                      regionId: v.customer.regionId
                  })
              })
          }
      }
      let str = this.project.project_add_params.hstoneProjectRichEdits[5].types
      vm.checkedList = []
      vm.typesData.forEach(function (v) {
          if(str){
              if(str.indexOf(v.id)!==-1) {
                  vm.checkedList.push(v.value)
              }
          }
      })
      vm.advantageData = getDict().filter(item => item.type === "advantageType")
      let strs = vm.project.project_add_params.cooperationInfos[1].advantageType
      vm.advantageData.forEach(function (v) {
          if(strs) {
              if (strs.indexOf(v.id) !== -1) {
                  vm.checkedLists.push(v.value)
              }
          }
      })
      vm.fetchTableData();
    },
    async getPlaceParents(v){
        let params = {
            id: v,
            levelNum: 0,
            token: getUser().token
        }
      this.placeVal = []
        let { data } = await getPlaceParent(params)
        this.placeVal.push(data.parentsNameStr)
    },
  }
}
</script>

<style lang="scss" scoped>
  .detail-wrap {
    font-size: 16px;
    padding-left: 30px;
  }
  .view-content{
    min-height: 40px;
    word-break:break-all
  }
  .detail-item {
    line-height: 40px;

    &__label {
      color: #666;
    }

    &__value {
      color: #333;
    }
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
    p{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .el-card{
      height: 140px;
    }
  }
  .addUser {
    font-size: 45px;
    text-align: center;
    height: 140px;
    line-height: 100px;
  }
</style>
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

