<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      ref="tabs"
    >
      <el-tab-pane label="薪酬管理" name="first">
        <!-- 组织管理筛选 -->
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
          :model="formParams">
          <el-form-item label="调薪日期:">
            <el-date-picker
                v-model="formParams.wageAdjustmentStartTime"
                value-format="yyyy-MM-dd"
                type="datetime"
                placeholder="调薪开始日期"
                default-time="00:00:00"
                range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
                v-model="formParams.wageAdjustmentEndTime"
                value-format="yyyy-MM-dd"
                type="datetime"
                placeholder="调薪结束日期"
                default-time="23:59:59"
                range-separator="-"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="员工名称:">
            <memberSelect :snycModel.sync="formParams.employeeId" :value="formParams.employeeId"/>
          </el-form-item>
          <el-form-item label="性别:">
            <el-select v-model="formParams.sex">
              <el-option value="1" label="男">男</el-option>
              <el-option value="2" label="女">女</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门:">
            <organizationSelect @selectChange="orgChange" :value="formParams.organizationId"/>
          </el-form-item>
          <el-form-item label="薪资标准:" class="num">
            <el-input v-model.number="formParams.salaryStandardStart" type="number"/> 至
            <el-input v-model.number="formParams.salaryStandardEnd" type="number"/>
          </el-form-item>
          <el-form-item label="人力成本:" class="num">
            <el-input v-model.number="formParams.humanCostStart" type="number"/> 至
            <el-input v-model.number="formParams.humanCostEnd" type="number"/>
          </el-form-item>
          <el-form-item class="searchBtn fr">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onRest">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row class="mb-20">
          <div class="fr">
            <el-button type="primary" @click="createPay" v-if="permButton('110502')">创建薪酬</el-button>
          </div>
        </el-row>
        <el-table
                border
                :data="organizationData"
                style="width: 100%">
         <el-table-column prop="fullName" label="序号" type="index" :show-overflow-tooltip="true" align="center" width="60px"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="员工姓名">
                  <span>{{ props.row.employee.name }}</span>
                </el-form-item>
                <el-form-item label="计薪结束日期">
                  <span v-if="props.row.finishDate">{{props.row.finishDate}}</span>
                  <span v-else>--</span>
                </el-form-item>
                <el-form-item label="性别">
                  <span v-if="props.row.employee.sex === 1">男</span>
                  <span v-else>女</span>
                </el-form-item>
                <el-form-item label="部门">
                  <span>
                    <template v-if="props.row.employee.hstoneEmployeePosition.length>0">
                          <span v-for="(tem,n) in props.row.employee.hstoneEmployeePosition">
                            {{tem.organization.fullName}}
                            <span v-if="props.row.employee.hstoneEmployeePosition.length !== (n+1)">;</span>
                          </span>
                    </template>
                    <template v-else>
                      --
                    </template>
                  </span>
                </el-form-item>
                <el-form-item label="职务">
                  <span>
                      <template v-if="props.row.employee.hstoneEmployeePosition.length>0">
                          <template v-for="(tem,s) in props.row.employee.hstoneEmployeePosition">
                            <span v-if="tem.positionDictionarys.length>0">
                              <span v-for="(v,n) in tem.positionDictionarys" :key="v.id">
                                <span v-if="n!==0 || s !== 0">; </span>{{v.value}}
                              </span>
                            </span>
                          </template>
                      </template>
                     <template v-else>
                      --
                    </template>
                  </span>
                </el-form-item>
                <el-form-item label="薪资标准">
                  <span>{{ props.row.salaryStandard }}</span>
                </el-form-item>
                <el-form-item label="人力成本(元/小时)">
                  <span>{{ props.row.humanCost }}</span>
                </el-form-item>
                <el-form-item label="说明">
                 <span v-if="props.row.details">{{props.row.details}}</span>
                  <span v-else>--</span>
                </el-form-item>
                <el-form-item label="调薪时间">
                  <span> {{props.row.modifyTime | dateFormatYmdHms}}</span>
                </el-form-item>
                <el-form-item label="人力成本(元/小时)">
                  <span>{{ props.row.humanCost }}</span>
                </el-form-item>
                <el-form-item label="操作人">
                  <span v-if="props.row.creator">{{props.row.creator.name}}</span>
                  <span v-else>--</span>
                </el-form-item>
                <el-form-item label="调薪次数">
                  <span v-if="props.row.frequency">{{props.row.frequency}}</span>
                  <span v-else>--</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="applyDate" :show-overflow-tooltip="true" label="计薪开始日期" align="center" width="110px">
            <template slot-scope="scope">
              <span v-if="scope.row.applyDate">{{scope.row.applyDate}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="finishDate" :show-overflow-tooltip="true" label="计薪结束日期" align="center" width="110px">
                      <template slot-scope="scope">
                        <span v-if="scope.row.finishDate">{{scope.row.finishDate}}</span>
                        <span v-else>--</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="employee" :show-overflow-tooltip="true" label="员工姓名" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.employee">{{scope.row.employee.name}}</span>
                        <span v-else>--</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="regionName" :show-overflow-tooltip="true" label="性别" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.employee.sex === 1">男</span>
                        <span v-else>女</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" :show-overflow-tooltip="true" label="部门" align="center">
                      <template slot-scope="scope">
                        <template v-if="scope.row.employee.hstoneEmployeePosition.length>0">
                          <span v-for="(tem,n) in scope.row.employee.hstoneEmployeePosition">
                            {{tem.organization.fullName}}
                            <span v-if="scope.row.employee.hstoneEmployeePosition.length !== (n+1)">;</span>
                          </span>
                        </template>
                        <template v-else>
                          --
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="employeeName" :show-overflow-tooltip="true" label="职务" align="center">
                      <template slot-scope="scope">
                        <template v-if="scope.row.employee.hstoneEmployeePosition.length>0">
                          <template v-for="(tem,s) in scope.row.employee.hstoneEmployeePosition">
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
                    <el-table-column prop="salaryStandard" :show-overflow-tooltip="true" label="薪资标准" align="center"></el-table-column>
                    <el-table-column prop="humanCost" :show-overflow-tooltip="true" label="人力成本(元/小时)" align="center" width="140px"></el-table-column>
                    <el-table-column prop="details" :show-overflow-tooltip="true" label="说明" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.details">{{scope.row.details}}</span>
                        <span v-else>--</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="modifyTime" :show-overflow-tooltip="true" label="调薪时间" align="center" width="160px">
                      <template slot-scope="scope">
                        {{scope.row.modifyTime | dateFormatYmdHms}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="employeeName" :show-overflow-tooltip="true" label="操作人" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.creator">{{scope.row.creator.name}}</span>
                        <span v-else>--</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="employeeName" :show-overflow-tooltip="true" label="调薪次数" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.frequency">{{scope.row.frequency}}</span>
                        <span v-else>--</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120px">
                      <template slot-scope="scope">
                        <el-button size="small" type="text" v-if="showTime(scope.row) && !scope.row.finishDate" @click="update(scope.row)"><span v-if="permButton('110502')">编辑</span></el-button>
                        <el-button size="small" type="text" v-if="!scope.row.finishDate" @click="changeSalary(scope.row)"><span v-if="permButton('110503')">调薪</span></el-button>
                        <el-button size="small" type="text" @click="check(scope.row)">日志</el-button>
                      </template>
                    </el-table-column>
        </el-table>
        <Pager
          :total="formParams.total"
          :pageTotalChange="handleSizeChange"
          :size="formParams.size"
          :current="formParams.page"
          :pageChange="pageChange"></Pager>
      </el-tab-pane>
      <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
      <ContentViewDialog ref="checkDialog"></ContentViewDialog>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { salaryPage, orgSetManager } from '@/api/salary'
import ContentViewDialog from './ContentViewDialog'
import ContentDialog from './ContentDialog'
import * as moment from 'moment';
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
      setPeople: false,
      setManagerParams: {
        organizationId: '',
        organizationName: '',
        employeeId: '',
        level: 1,
        token: getUser().token
      },
      formParams: {
        wageAdjustmentStartTime: '',
        wageAdjustmentEndTime: '',
        salaryStandardStart: '',
        salaryStandardEnd: '',
        humanCostStart: '',
        humanCostEnd: '',
        organizationId: '',
        sex: '',
        employeeId: '',
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      },
      organizationData: [],
      rules: {
        employeeId: [{ required: true, message: "请选择员工", trigger: "blur" }]
      },
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
    showTime(v){
      let d = new Date(v.applyDate).getTime()
      let j = new Date(moment(Date.now()).format('YYYY-MM-DD')).getTime()
      if(d >= j){
        return true
      }else {
        return false
      }
    },
    orgChange(v) {
      this.formParams.organizationId = v.id;
    },
    submitSet() {
      let vm = this
        vm.$refs['setManager'].validate().then(async () => { // 表单验证
          const loading = this.$loading({
            lock: true,
            text: '正在设置...'
          })
          try {
            await orgSetManager(vm.setManagerParams)
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
    // 选择查询组织ID
    orgChanges(v){
      this.formParams.id = v.id;
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.formParams.regionTreeCode = v[v.length-1].treeCode
    },
    handleSizeChange(v) {
      this.formParams.size = v;
      this.fetchTableData();
    },
    pageChange(v) {
      this.formParams.page = v;
      this.fetchTableData();
    },
    async fetchTableData() {
        let vm = this
        let data = await salaryPage(vm.formParams)
        vm.organizationData = data.data
        vm.formParams.total = data.total
    },
    // 搜索
    onSearch() {
      this.formParams.page = 1;
      this.fetchTableData();
    },
    // 重置
    onRest() {
      let vm = this;
      vm.formParams = {
        wageAdjustmentStartTime: '',
        wageAdjustmentEndTime: '',
        salaryStandardStart: '',
        salaryStandardEnd: '',
        humanCostStart: '',
        humanCostEnd: '',
        organizationId: '',
        sex: '',
        employeeId: '',
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      }
      vm.fetchTableData()
    },
    createPay() {
      let vm = this
      vm.dialogHandleType = 'add'
      vm.$refs['dialog'].show()
    },
    refreshTable (v) {
      let vm = this
      vm.formParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
    },
    set(row) {
      let vm = this
      vm.setManagerParams.organizationId = row.id
      vm.setManagerParams.organizationName = row.name
      if(row.hstoneOrganizationPrincipals.length>0){
        vm.setManagerParams.employeeId = row.hstoneOrganizationPrincipals[0].hstoneEmployee.id
      }else {
        vm.setManagerParams.employeeId = ''
      }
      vm.setPeople = true
    },
    // 查看
    check(row) {
      let vm = this
      vm.dialogHandleType = 'check'
      vm.$refs['checkDialog'].setFormDatas(row)
      vm.$refs['checkDialog'].show()
    },
    changeSalary(row) {
      let vm = this
      vm.dialogHandleType = 'check'
      vm.$refs['dialog'].setFormDatas(row)
      vm.$refs['dialog'].show()
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

<style lang="scss">
  .dz-toolbar .num .el-input__inner{
    padding-right: 0px;
  }
   .demo-table-expand {
     font-size: 0;
     margin-left: 320px;
   }
  .demo-table-expand label {
    width: 130px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  /*el-form demo-table-expand el-form--label-left el-form--inline*/
</style>