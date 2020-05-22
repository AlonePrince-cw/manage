<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="惩罚记录" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;">
          <el-form-item label="惩罚人员:">
            <memberSelect :snycModel.sync="searchParams.awardsEmployeeId" :value="searchParams.awardsEmployeeId"/>
          </el-form-item>
          <el-form-item label="惩罚部门:">
            <organizationSelect @selectChange="orgChange" :value="searchParams.awardsOrganizationId"/>
          </el-form-item>
          <el-form-item label="惩罚时间:">
            <el-date-picker
              v-model="searchParams.startTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="开始时间"
              range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
              v-model="searchParams.endTime"
              value-format="yyyy-MM-dd"
              :picker-options="endPickerOptions"
              type="date"
              placeholder="结束时间"
              range-separator="-">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="标题:">
            <el-input v-model="searchParams.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
        <el-col :span="24">
          <div class="fr">
            <el-button type="primary" @click="createRewards" class="reateBtn" v-if="permButton('11030201')">创建惩罚</el-button>
          </div>
        </el-col>
        <el-table border :data="tableData">
          <el-table-column label="惩罚标题" :show-overflow-tooltip="true" width="180px" prop="title" align="center"></el-table-column>
          <el-table-column label="惩罚来源" :show-overflow-tooltip="true" prop="organizationId" align="center">
            <template slot-scope="scope">
              {{scope.row.source.fullName}}
            </template>
          </el-table-column>
          <el-table-column label="惩罚对象" :show-overflow-tooltip="true" prop="awardsPunishId" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.awardsPunishType === 1">{{scope.row.employee.name}}</span>
              <span v-if="scope.row.awardsPunishType === 0">{{scope.row.organization.fullName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="惩罚原因" :show-overflow-tooltip="true" prop="cause" align="center"></el-table-column>
          <el-table-column label="惩罚内容" :show-overflow-tooltip="true" prop="causeInfo" align="center"></el-table-column>
          <el-table-column label="惩罚时间" :show-overflow-tooltip="true" prop="awardsPunishTime" align="center" width="150"></el-table-column>
          <el-table-column label="操作" width="250px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="check(scope.row)" v-if="permButton('11030202')">查看</el-button>
              <el-button size="small" type="text" @click="update(scope.row)" v-if="permButton('11030203')">编辑</el-button>
              <!--<el-button size="small" type="text">操作日志</el-button>-->
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
    </el-tabs>
    <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
    <ContentViewDialog ref="checkDialog"/>
  </div>
</template>

<script>
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { dateFormatYmdHms } from "util";
import { penaltyPage, penaltyDel } from "@/api/rewardManage";
import ContentDialog from './ContentDialog'
import ContentViewDialog from './ContentViewDialog'
export default {
  components: {
      ContentDialog, ContentViewDialog
  },
  data() {
    return {
      token: getUser().token,
      fileDialog: false,
      dialogHandleType: 'add',
      tableData: [],
      searchParams: {
        page: 1,
        size: 10,
        awardsEmployeeId: '',
        awardsOrganizationId: '',
        startTime: '',
        endTime: '',
        title: '',
      },
      targerName: "first",
      endPickerOptions: {
        disabledDate: (time) => {
          if (this.searchParams.awardsPunishStartTime) {
            return time.getTime() < new Date(this.searchParams.awardsPunishStartTime).getTime()
          } else {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        }
      },
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
    check(v){
      let vm = this
      vm.dialogHandleType = 'check'
      vm.$refs['checkDialog'].show()
      vm.$refs['checkDialog'].setFormDatas(v)
    },
    update(v){
      let vm = this
      vm.dialogHandleType = 'edit'
      vm.$refs['dialog'].show()
      vm.$refs['dialog'].setFormDatas(v)
    },
    orgChange(v) {
      this.searchParams.awardsOrganizationId = v.id;
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
          await penaltyDel(params)
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
    createRewards(v) {
      let vm = this
      vm.dialogHandleType = 'add'
      vm.$refs['dialog'].show()
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
        awardsEmployeeId: '',
        awardsOrganizationId: '',
        startTime: '',
        endTime: '',
        title: '',
      };
      this.fetchTableData();
    },
    async fetchTableData() {
      let vm = this
      vm.searchParams.token = vm.token
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      try {
        let data = await penaltyPage(vm.searchParams)
        vm.tableData = data.data
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
.el-table {
  margin: 20px;
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
