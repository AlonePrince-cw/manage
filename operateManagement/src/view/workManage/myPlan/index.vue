<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="我的计划" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
        >
          <el-form-item label="时间范围：">
            <el-date-picker
              v-model="searchParams.startTime"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
              type="date"
              range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
              v-model="searchParams.endTime"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              type="date"
              range-separator="-"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="关联方式">
            <el-select v-model="searchParams.associationType">
              <el-option label="关联工作" :value="1"></el-option>
              <el-option label="关联项目" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择项目" v-if="searchParams.associationType===0">
            <projectSelect
              :value="searchParams.projectId"
              :snycModel.sync="searchParams.projectId"/>
          </el-form-item>
          <el-form-item label="选择工作" v-if="searchParams.associationType===1">
            <GetPlatformDict
              :dictType="'relatedWork'"
              :value="searchParams.relatedWork"
              :snycModel.sync="searchParams.relatedWork"/>
          </el-form-item>
          <el-form-item label="计划事项：" prop="info">
            <el-input v-model="searchParams.info" placeholder="请输入计划事项"></el-input>
          </el-form-item>
          <el-form-item label="计划名称：" prop="name">
            <el-input v-model="searchParams.name" placeholder="请输入计划名称"></el-input>
          </el-form-item>
          <el-form-item label="计划状态：" prop="planStatus">
            <el-select v-model="searchParams.planStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重要程度:">
            <GetPlatformDict
              :dictType="'importantStatus'"
              :value="searchParams.importantStatus"
              :snycModel.sync="searchParams.importantStatus"/>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
        <el-col :span="24">
          <div class="fr">
            <el-button type="primary" @click="addPlan" class="reateBtn" v-if="permButton('510101')">创建计划</el-button>
          </div>
        </el-col>
        <el-table border :data="planData">
          <el-table-column label="计划时间" :show-overflow-tooltip="true" width="120px" prop="name" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.planTime">{{scope.row.planTime | dateFormat('yyyy-MM-dd')}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" :show-overflow-tooltip="true" prop="submitTime" align="center"  width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.submitTime">{{scope.row.submitTime}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="计划人" :show-overflow-tooltip="true" prop="organizationName" align="center" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.hstoneEmployee">{{scope.row.hstoneEmployee.name}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="所属组织" :show-overflow-tooltip="true" prop="organizationId" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.hstoneEmployee.hstoneEmployeePosition">
               <span v-for="(v,n) in scope.row.hstoneEmployee.hstoneEmployeePosition" :key="v.id">
                 {{v.organization.fullName + (n < scope.row.hstoneEmployee.hstoneEmployeePosition.length - 1 ? ';' : '')}}
               </span>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="相关项目" :show-overflow-tooltip="true" prop="entryTime" width="100px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.project">
               {{scope.row.project.projectName}}
              </span>
              <span v-else>{{scope.row.relatedWorkDictionary.value}}</span>
            </template>
          </el-table-column>
          <el-table-column label="计划名称" :show-overflow-tooltip="true" prop="name" align="center"></el-table-column>
          <el-table-column label="重要程度" :show-overflow-tooltip="true" width="100px" prop="workStatus" align="center">
            <template slot-scope="scope">
              {{scope.row.importantStatus | dict('importantStatus')}}
            </template>
          </el-table-column>
          <el-table-column label="完成情况" :show-overflow-tooltip="true" width="100px" prop="workStatus" align="center">
            <template slot-scope="scope">
              {{scope.row.infoCount}}/{{scope.row.terminationCount}}/{{scope.row.completeCount}}
            </template>
          </el-table-column>
          <el-table-column label="耗时" :show-overflow-tooltip="true" width="100px" prop="takeAllTime" align="center">
            <template slot-scope="scope">
              {{scope.row.takeAllTime}}h
            </template>
          </el-table-column>
          <el-table-column label="计划状态" :show-overflow-tooltip="true" width="100px" prop="workStatus" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.planStatus === 0">提交</span>
              <span v-else>未提交</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="check(scope.row)" v-if="permButton('510102')">查看</el-button>
              <el-button size="small" type="text" @click="edit(scope.row)" v-if="permButton('510103')">编辑</el-button>
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
      <ContentViewDialog ref="checkDialog"/>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { planPage, planDel } from "@/api/plan";
import ContentViewDialog from './ContentViewDialog'
export default {
  components: {
    ContentViewDialog
  },
  data() {
    return {
      token: getUser().token,
      dialogHandleType: 'add',
      planData: [],
      options: [
        {
          name: '提交',
          id: '0'
        },
        {
          name: '未提交',
          id: '1'
        }
      ],
      searchParams: {
        page: 1,
        size: 10,
        total:0,
        startTime: "",
        endTime: "",
        info: '',
        name: '',
        planStatus: '',
        importantStatus: null,
        associationType: null,
        projectId: null,
        relatedWork: null,
        token: getUser().token,
      },
      targerName: "first",
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
    // del (v) {
    //   let vm = this
    //   let params = {
    //     id: v,
    //     token: getUser().token
    //   }
    //   vm.$confirm(`是否删除？`, '提示', {
    //     type: 'warning'
    //   }).then(async () => {
    //     await reportDel(params)
    //     vm.$message.success('删除成功')
    //     vm.fetchTableData()
    //   }, _.noop)
    // },
    edit(v) {
      let vm = this
      vm.$router.push({path: '/business/workManage/editPlan/' + v.id})
    },
    check(v) {
      let vm = this
      vm.$refs['checkDialog'].setFormDatas(v)
      vm.$refs['checkDialog'].show()
    },
    addPlan(v) {
      let vm = this
      console.log(v)
      vm.$router.push({path: '/business/workManage/addPlan/' + getNode().id})
    },
    // 搜索
    onSearch() {
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
        total:0,
        startTime: "",
        endTime: "",
        info: '',
        name: '',
        planStatus: '',
        importantStatus: null,
        associationType: null,
        projectId: null,
        relatedWork: null,
        token: getUser().token,
      };
      this.fetchTableData();
    },
    async fetchTableData() {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      try {
        let data = await planPage(vm.searchParams)
        vm.planData = data.data
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

<style lang="scss" scoped>
.reportInfo {
    position: relative;
    .del{
        position: absolute;
        right: 0px;
        top: 0px;
        color: #f56c6c;
    }
}
.searchBtn {
  float: right;
  .el-button {
    margin-left: 15px;
  }
}

.btn {
  text-align: center;
  .el-button {
    padding: 10px 30px;
  }
}
.el-card {
  .el-button {
    margin: 0px;
  }
}
.search {
  padding: 10px;
  height: 190px;
  border-bottom: 1px solid #c1c1c1;
  .el-input,
  .el-select {
    width: 150px;
    .el-button {
      position: relative;
      background-color: royalblue;
      left: 50px;
    }
  }
  .el-col {
    height: 50px;
  }
}
.selectWork {
  position: relative;
  left: -25px;
}
.work {
  position: relative;
  left: -10px;
}
.description {
  border-bottom: 1px solid #c1c1c1;
  padding: 10px;
  margin: 10px 0px;
}

.message {
  padding: 10px 0px;
  span {
    color: cornflowerblue;
  }
}
.replay {
  padding-right: 10px;
  margin-bottom: 10px;
}
.addFile {
  width: 100%;
  height: 150px;
  padding: 15px;
  border: 1px solid #eeeeee;
  img {
    width: 120px;
    height: 120px;
  }
}
.personCard {
  img {
    position: relative;
    top: -3px;
    width: 40px;
    height: 40px;
    border: 1px solid #eeeeee;
    border-radius: 40px;
  }
}
.read {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #c1c1c1;
}
.haveread {
  padding: 0px 10px;
  font-size: 16px;
  float: left;
  .el-icon-success {
    float: left;
    font-size: 36px;
    display: inline-block;
    height: 36px;
    width: 36px;
  }
  span{color: cornflowerblue;display: inline-block;height: 36px;line-height: 36px;padding: 0px 10px;float: left;}
}
.line2{margin-top: 10px}
.line2>span {
  border-right: 1px solid #eeeeee;
  padding: 5px 10px;
}
.line2>span:last-child{
  border: none;
}
.file {
  position: relative;
  top: 10px;
}
.el-card {
  margin: 10px 0px;
}
.btn {
  .el-button {
    margin-right: 15px;
  }
}
.reateBtn {
  margin-bottom: 15px;
}
</style>
<style>
  .el-card__body{
    overflow: hidden;
  }
</style>
