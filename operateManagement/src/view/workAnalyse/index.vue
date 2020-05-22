<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="工作分析" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;">
          <el-form-item label="姓名:">
            <memberSelect :snycModel.sync="searchParams.employeeId" :value="searchParams.employeeId"/>
          </el-form-item>
          <el-form-item label="组织:">
            <organizationSelect @selectChange="orgChange" :value="searchParams.organizationId"/>
          </el-form-item>
          <el-form-item label="时间范围:">
            <el-date-picker
              v-model="searchParams.startTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
              v-model="searchParams.endTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择项目:">
            <projectSelect
              @selectData="selectData"
              :value="searchParams.projectId"
              :snycModel.sync="searchParams.projectId"/>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
        <el-col :span="24">
          <div class="headTitle">
            工时总合: <span class="name"> {{countData.totalTime}}h</span>
            人工成本: <span class="name"> {{countData.sumCost}}</span>
            参与人数: <span class="name"> {{countData.totalEmp}}</span>
            项目数: <span class="name"> {{countData.totalPro}}</span>
          </div>
        </el-col>
        <el-table border :data="tableData">
          <el-table-column label="相关项目/工作" :show-overflow-tooltip="true" prop="hstoneProject.projectName" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.projectId">
               {{scope.row.hstoneProject.projectName}}
              </span>
              <span v-else>{{scope.row.relatedWorkDictionary.value}}</span>
            </template>
          </el-table-column>
          <el-table-column label="员工名称" :show-overflow-tooltip="true" prop="hstoneEmployee.name" align="center"></el-table-column>
          <el-table-column label="职务" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.hstoneEmployee.hstoneEmployeePosition.length>0">
                <template v-for="(tem,s) in scope.row.hstoneEmployee.hstoneEmployeePosition">
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
          <el-table-column label="所属组织" :show-overflow-tooltip="true" prop="organizationId" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.hstoneEmployee.hstoneEmployeePosition">
                <template v-if="scope.row.hstoneEmployee.hstoneEmployeePosition.length>0">
                 <span v-for="(v,n) in scope.row.hstoneEmployee.hstoneEmployeePosition" :key="v.id">
                   {{v.organization.fullName}}
                 </span>
                </template>
                <template v-else>
                  --
                </template>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="工时" :show-overflow-tooltip="true" prop="entryTime" width="150px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.totalTime">
               {{scope.row.totalTime}}h
              </span>
            </template>
          </el-table-column>
          <el-table-column label="人工成本" :show-overflow-tooltip="true" prop="totalCost" align="center" width="200"></el-table-column>
        </el-table>
        <Pager
          :total="searchParams.total"
          :pageTotalChange="handleSizeChange"
          :size="searchParams.size"
          :current="searchParams.page"
          :pageChange="pageChange"></Pager>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode } from "@/utils/auth";
import { workAnalyse, workAnalyseTotal } from "@/api/common";
export default {
  components: {
  },
  data() {
    return {
      token: getUser().token,
      tableData: [],
      searchParams: {
        page: 1,
        size: 10,
        startTime: "",
        endTime: "",
        projectId: null,
        employeeId: '',
        organizationId: '',
        token: getUser().token,
      },
      countData:{
        sumCost: '',
        totalEmp: '',
        totalPro: '',
        totalTime: ''
      },
      targerName: "first",
    }
  },
  created() {
    this.fetchTableData();
    this.workAnalyseCount();
  },
  methods: {
    orgChange(v) {
      this.searchParams.organizationId = v.id;
    },
    selectData(v) {
      console.log(v)
    },
    // 搜索
    onSearch() {
      this.searchParams.page = 1;
      this.workAnalyseCount();
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
        startTime: "",
        EndTime: "",
        projectId: null,
        employeeId: '',
        organizationId: '',
        token: getUser().token,
      };
      this.fetchTableData();
      this.workAnalyseCount();
    },
    async fetchTableData() {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      try {
        let data = await workAnalyse(vm.searchParams)
        vm.tableData = data.data
        vm.searchParams.total = data.total
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    async workAnalyseCount() {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      let params = {
        employeeId: vm.searchParams.employeeId,
        organizationId: vm.searchParams.organizationId,
        projectId: vm.searchParams.projectId,
        startTime: vm.searchParams.startTime,
        endTime: vm.searchParams.endTime,
        token: getUser().token,
      }
      try {
        let data = await workAnalyseTotal(params)
        vm.countData = data
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .headTitle{
    padding-bottom: 16px;
    padding-left: 10px;
    color: #606266;
    .name{
      margin-right: 45px;
      font-weight: bold;
      color: #F56C6C;
    }
    .date{
      color: #606266;
      font-weight: bold;
    }
  }
</style>