<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      ref="tabs"
    >
      <el-tab-pane label="员工管理" name="first">
        <!-- 组织管理筛选 -->
        <el-form
          class="dz-toolbar"
          :inline="true"
          style="padding: 20px 12px 0 12px;"
          :model="memberManageParams">
          <el-form-item label="姓名:">
            <el-input v-model="memberManageParams.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="入职时间:" >
            <el-date-picker v-model="entrTime" @change="entrTimechange" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" range-separator=" - " value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="离职时间:" >
            <el-date-picker v-model="resignationTime" @change="resignationTimeChange" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" range-separator=" - " value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="人员状态:">
            <GetPlatformDict :dictType = "'workStatus'" :value="memberManageParams.workStatus" :snycModel.sync="memberManageParams.workStatus"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="所属部门:">
            <organizationSelect @selectChange="orgChange" :value="memberManageParams.organizationId"/>
          </el-form-item>
          <el-form-item label="职务:">
            <GetPlatformDict :dictType = "'position'" :value="memberManageParams.position" :snycModel.sync="memberManageParams.position"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="memberManageParams.phone" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onRest">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
        <el-row class="mb-20">
          <div class="fr">
            <el-button type="primary" class="create" @click="createStaff" v-if="permButton('110201')">创建员工</el-button>
          </div>
        </el-row>
        <!-- 组织管理列表 -->
        <el-table border :data="memberManageData">
          <el-table-column label="姓名" :show-overflow-tooltip="true" width="180px" prop="name" align="center"></el-table-column>
          <el-table-column label="职务" :show-overflow-tooltip="true" prop="positionName" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.hstoneEmployeePosition.length>0">
                <template v-for="(tem,s) in scope.row.hstoneEmployeePosition">
                  <span v-if="tem.positionDictionarys.length>0">
                    <span v-for="(v,n) in tem.positionDictionarys" :key="v.id">
                      <span v-if="n!==0 || s !== 0">; </span>{{v.value}}
                    </span>
                  </span>
                </template>
              </template>
              <template v-else>--</template>
            </template>
          </el-table-column>
          <el-table-column label="所属部门" :show-overflow-tooltip="true" prop="organizationName" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.hstoneEmployeePosition.length>0">
                <span v-for="(tem,n) in scope.row.hstoneEmployeePosition">
                  {{tem.organization.fullName}}<span v-if="scope.row.hstoneEmployeePosition.length !== (n+1)">;</span>
                </span>
              </template>
              <template v-else>
                --
              </template>
            </template>
          </el-table-column>
          <el-table-column label="手机号" :show-overflow-tooltip="true" prop="phone" align="center" width="150"></el-table-column>
          <el-table-column label="入职时间" :show-overflow-tooltip="true" prop="entryTime" width="100px" align="center"></el-table-column>
          <el-table-column label="离职时间" :show-overflow-tooltip="true" width="100px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.resignationTime">{{scope.row.resignationTime}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="人员状态" :show-overflow-tooltip="true" width="100px" prop="workStatus" align="center">
            <template slot-scope="scope">
              {{scope.row.workStatus | dict('workStatus')}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="set(scope.row)" v-if="permButton('110207')">职务设置</el-button>
              <el-button size="small" type="text" @click="check(scope.row)" v-if="permButton('110204')">查看</el-button>
              <el-button size="small" type="text" @click="update(scope.row)" v-if="permButton('110202')">编辑</el-button>
              <!--<el-button size="small" type="text">操作日志</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <Pager
          :total="memberManageParams.total"
          :pageTotalChange="handleSizeChange"
          :size="memberManageParams.size"
          :current="memberManageParams.page"
          :pageChange="pageChange"></Pager>
      </el-tab-pane>
      <!-- 设置负责人 -->
      <el-dialog :visible.sync="setPeople" title="设置负责人" width="820px" >
        <el-form ref="addJob" style="padding: 0px 12px 0 12px;" label-width="100px" :model="setJobParams">
          <el-row>
            <el-divider></el-divider>
            <el-form-item style="text-align: center;" label-width="0px">
              <span style="font-size: 18px;"><span>员工姓名:</span> {{setEmployeeName}}</span>
            </el-form-item>
          </el-row>
          <el-row
            v-for="(domains, n) in setJobParams.domains"
            :key="domains.key">
            <el-divider v-if="n !== 0"></el-divider>
            <div style="padding-right: 85px;position: relative">
              <el-col :span="12" >
                <el-form-item
                  :label="'所属部门:'"
                  :prop="'domains.' + n + '.organizationId'"
                  :rules="{required: true, message: '所属部门不能为空', trigger: 'blur'}">
                  <organizationSelect :snycModel.sync="domains.organizationId" :value="domains.organizationId"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="'职务设置:'"
                  :prop="'domains.' + n + '.position'"
                  class="positionList"
                  :rules="{required: true, type: 'array', message: '职务不能为空', trigger: 'blur'}">
                  <GetPlatformDict :dictType = "'position'" :multiple="true" @selectChange = "selectChange" :value="domains.position" :snycModel.sync="domains.position"></GetPlatformDict>
                </el-form-item>
              </el-col>
              <el-button @click.prevent="removeDomain(n)" style="position: absolute;right: 0">删除</el-button>
            </div>
          </el-row>
          <el-row>
            <el-divider></el-divider>
            <el-form-item style="text-align: center" label-width="0px">
              <el-button @click="addDomain">新增职务</el-button>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialogFooter">
          <el-button type="primary" @click="submitSet">提交</el-button>
        </div>
      </el-dialog>
      <ContentViewDialog ref="checkDialog"></ContentViewDialog>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { memberManagePage, memberSetManager } from '@/api/member'
import ContentViewDialog from './ContentViewDialog'
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  name: 'organization',
  components: {
      ContentViewDialog
  },
  beforeUpdate() {},
  data() {
    return {
      placeVal: [],
      resignationTime: '',
      entrTime: '',
      activeName: 'first',
      dialogHandleType: 'add',
      setPeople: false,
      setEmployeeId: '',
      setEmployeeName: '',
      setJobParams:{
        domains: [
          {
            organizationId: '',
            position: [],
          }
        ]
      },
      setDutiesParams: {
          HstoneEmployeePosition: [],
          token: getUser().token
      },
      memberManageParams: {
        page: 1,
        size: 10,
        total: 0,
        name: '',
        entryStartTime:'',
        // 入职开始时间
        entryEndTime:'',
        // 入职结束时间
        resignationStartTime:'',
        // 离职开始时间
        resignationEndTime:'',
        //
        workStatus: null,
        organizationId:'',
        phone:'',
        position: null,
        token: getUser().token
      },
      memberManageData: [],
      rules: {
        member: [{ required: true, message: "请选择员工", trigger: "blur" }]
      },
    };
  },
  computed: {
    ...mapState([
        'member'
    ]),
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
    removeDomain(n) {
        let vm = this
        if (vm.setJobParams.domains.length !== 0) {
            vm.setJobParams.domains.splice(n, 1)
        } else {
            vm.$message.warning('不能删除全部')
        }
    },
    addDomain() {
      this.setJobParams.domains.push(
        {
          organizationId: '',
          position: [],
        }
      );
    },
    selectChange(v){
      console.log(v)
    },
    orgChange(v) {
      this.memberManageParams.organizationId = v.id;
    },
    resignationTimeChange(v){
      this.memberManageParams.resignationStartTime = v[0];
      this.memberManageParams.resignationEndTime = v[1];
    },
    entrTimechange(v){
      this.memberManageParams.entryStartTime = v[0];
      this.memberManageParams.entryEndTime = v[1];
    },
    submitSet() {
      let vm = this
      let ary = []
      let repeat = false
      vm.$refs['addJob'].validate().then(async () => { // 表单验证
        vm.setDutiesParams.HstoneEmployeePosition = _.cloneDeep(vm.setJobParams.domains)
        vm.setDutiesParams.HstoneEmployeePosition.forEach(function (v) {
          v.employeeId = vm.setEmployeeId
          ary.push(v.organizationId)
          v.position = v.position.join(',')
        })
        var nary = ary.sort();
        for(var i = 0; i < nary.length - 1; i++) {
          if(nary[i] == nary[i + 1]) {
            repeat = true
          }
        }
        if(repeat){
          vm.$message.error('不能选择重复部门')
          return false
        }
        const loading = this.$loading({
            lock: true,
            text: '正在设置...'
        })
        try {
          await memberSetManager(vm.setDutiesParams)
          vm.$message.success('设置成功')
          vm.setPeople = false
          vm.fetchTableData()
        } catch (err) {
          console.log(err)
        } finally {
          loading.close()
        }
      }, _.noop)
    },
    handleSizeChange(v) {
      this.memberManageParams.size = v;
      this.fetchTableData();
    },
    pageChange(v) {
      this.memberManageParams.page = v;
      this.fetchTableData();
    },
    async fetchTableData() {
      let vm = this
      let data = await memberManagePage(vm.memberManageParams)
      data.data.forEach(function (v) {
        v.hstoneEmployeePosition.forEach(function (vv,n) {
          let attr = []
          vv.positionDictionarys.forEach(function (val) {
              attr.push(val.id)
          })
          vv.postJob = attr
        })
      })
      vm.memberManageData = data.data
      vm.memberManageParams.total = data.total
    },
    // 搜索
    onSearch() {
      this.memberManageParams.page = 1;
      this.fetchTableData();
    },
    // 重置
    onRest() {
      let vm = this;
      vm.memberManageParams= {
        page: 1,
        size: 10,
        total: 0,
        name: '',
        entryStartTime:'',
        // 入职开始时间
        entryEndTime:'',
        // 入职结束时间
        resignationStartTime:'',
        // 离职开始时间
        resignationEndTime:'',
        workStatus:null,
        organizationId:'',
        phone:'',
        position:null,
        token: getUser().token
      }
      vm.resignationTime = []
      vm.entrTime = []
      vm.fetchTableData()
    },
    createStaff() {
      let vm = this
      vm.member.imageFilesList={
        imageFiles01: [],
        imageFiles02: [],
        imageFiles03: [],
        imageFiles04: [],
        imageFiles05: [],
        imageFiles06: [],
        imageFiles07: [],
        imageFiles08: [],
        imageFiles09: [],
        imageFiles10: [],
        imageFiles11: [],
      }
      vm.member.member_add_params = {
        name: "",
        phone: "",
        sex: '',
        idCard: "",
        university: "",
        education: null,
        qqCode: "",
        marryStatus: null,
        nationality: null,
        politics: null,
        hometown: "",
        habitationAddress: "",
        homeAddress: "",
        workIntro: "",
        entryTime: "",
        resignationTime: "",
        workStatus: null,
        salaryDescription: "",
        salary: 0,
        hstoneFileEntityRelas: []
      }
      vm.$router.push('/business/memberAdd/' + this.$route.params.id)
    },
    refreshTable (v) {
      let vm = this
      vm.memberManageParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
    },
    set(row) {
      let vm = this
      vm.setEmployeeId = row.id
      vm.setEmployeeName = row.name
      vm.setPeople = true
      if(row.hstoneEmployeePosition.length === 0){
        vm.setJobParams = {
          domains: [
            {
                organizationId: '',
                position: [],
            }
          ]
        }
      }else {
        vm.setJobParams = {
          domains: []
        }
        row.hstoneEmployeePosition.forEach(function (v,n) {
          vm.setJobParams.domains.push({
              organizationId: v.organization.id,
              position: v.postJob,
          })
          vm.$forceUpdate();
        })
      }
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
      // vm.member.imageFilesList = []
      vm.$router.push('/business/memberEdit/' + row.id)
    },
  }
};
</script>
<style>
  .el-divider{
    margin-top: 0px;
    overflow: hidden;
  }
  .positionList .vue-treeselect__value-container{
    line-height: 16px;
  }
</style>
<style lang="scss" scoped>
</style>