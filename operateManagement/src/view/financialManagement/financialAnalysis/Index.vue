<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="财务分析" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
        >
          <!--<el-form-item label="财务日期：">-->
            <!--<el-date-picker-->
                <!--v-model="searchParams.gatheringStartTime"-->
                <!--type="date"-->
                <!--placeholder="选择日期"-->
                <!--value-format="yyyy-MM-dd"-->
            <!--&gt;</el-date-picker>-->
            <!--<span> - </span>-->
            <!--<el-date-picker-->
                <!--v-model="searchParams.gatheringEndTime"-->
                <!--type="date"-->
                <!--placeholder="选择日期"-->
                <!--value-format="yyyy-MM-dd"-->
            <!--&gt;</el-date-picker>-->
          <!--</el-form-item>-->
           <el-form-item label="项目类型：">
            <GetPlatformDict  :dictType = "'projectType'" :value="searchParams.projectType" :snycModel.sync="searchParams.projectType"></GetPlatformDict>
           </el-form-item>
<!--          <el-form-item label="项目负责人：" prop="employeeId">-->
<!--              <el-input v-model="searchParams.employeeId" placeholder="请输入项目负责人"></el-input>-->
<!--          </el-form-item>-->
            <el-form-item label="项目负责人:">
                <memberSelect :snycModel.sync="searchParams.employeeId" :value="searchParams.employeeId"/>
            </el-form-item>
<!--          <el-form-item label="项目状态：" prop="projectStatus">-->
<!--            <el-select v-model="searchParams.projectStatus" placeholder="请选择">-->
<!--              <el-option-->
<!--                      v-for="item in options"-->
<!--                      :key="item.id"-->
<!--                      :label="item.name"-->
<!--                      :value="item.id">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
            <el-form-item label="项目状态:">
                <GetPlatformDict :dictType = "'projectStatus'" :value="searchParams.projectStatus" :snycModel.sync="searchParams.projectStatus"></GetPlatformDict>
            </el-form-item>
          <!--<el-form-item label="关联方式">-->
            <!--<el-select v-model="searchParams.associationType">-->
              <!--<el-option label="关联工作" :value="1"></el-option>-->
              <!--<el-option label="关联项目" :value="0"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="选择项目" v-if="searchParams.associationType===0">-->
            <!--<projectSelect-->
                    <!--:value="searchParams.projectId"-->
                    <!--:snycModel.sync="searchParams.projectId"-->
            <!--/>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="选择工作" v-if="searchParams.associationType===1">-->
            <!--<GetPlatformDict-->
                    <!--:dictType="'relatedWork'"-->
                    <!--:value="searchParams.relatedWork"-->
                    <!--:snycModel.sync="searchParams.relatedWork"-->
            <!--/>-->
          <!--</el-form-item>-->
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
<!--        <el-col :span="2">-->
<!--          <el-button type="primary" @click="addPlan" class="reateBtn">创建费用记录</el-button>-->
<!--        </el-col>-->
        <el-table border :data="expenseRecordData">
<!--           <el-table-column label="财务状态" :show-overflow-tooltip="true" width="100px" prop="financialStatus" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <span v-if="scope.row.financialStatus === 0">有效</span>-->
<!--              <span v-else>无效</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            label="所属项目"
            :show-overflow-tooltip="true"
            width="200px"
            prop="name"
            align="center"
          ></el-table-column>
          <el-table-column
            label="预期总金额"
            :show-overflow-tooltip="true"
            prop="projectFunding"
            width="150px"
            align="center"
          ></el-table-column>
          <el-table-column
                  label="项目预期收益"
                  :show-overflow-tooltip="true"
                  prop="expectedEarnings"
                  width="150px"
                  align="center"
          ></el-table-column>
          <el-table-column
                  label="收款总金额"
                  :show-overflow-tooltip="true"
                  prop="gatheringTotal"
                  width="100px"
                  align="center"
          >
<!--              <template slot-scope="scope">-->
<!--                  <span @click="addPlan"><span style="color: #00a0e9">{{scope.row.gatheringTotal}}</span></span>-->
<!--              </template>-->
          </el-table-column>
          <el-table-column
                  label="开票总金额"
                  :show-overflow-tooltip="true"
                  prop="invoiceTotal"
                  width="100px"
                  align="center"
          >
<!--              <template slot-scope="scope">-->
<!--                  <span @click="addPlan"><span style="color: #00a0e9">{{scope.row.invoiceTotal}}</span></span>-->
<!--              </template>-->
          </el-table-column>
          <el-table-column
                  label="费用总金额"
                  :show-overflow-tooltip="true"
                  prop="expenseTotal"
                  width="100px"
                  align="center"
          >
              <template slot-scope="scope">
                  <span @click="addPlan(scope.row)"><span style="color: #00a0e9">{{scope.row.expenseTotal}}</span></span>
              </template>
          </el-table-column>
          <el-table-column
                  label="坏账总金额"
                  :show-overflow-tooltip="true"
                  prop="badDebtCostTotal"
                  width="100px"
                  align="center"
          >
<!--              <template slot-scope="scope">-->
<!--                  <span @click="addPlan"><span style="color: #00a0e9">{{scope.row.badDebtCostTotal}}</span></span>-->
<!--              </template>-->
          </el-table-column>
          <el-table-column
                  label="成本总金额"
                  :show-overflow-tooltip="true"
                  prop="costTotal"
                  width="100px"
                  align="center"
          >
<!--              <template slot-scope="scope">-->
<!--                  <span @click="addPlan"><span style="color: #00a0e9">{{scope.row.costTotal}}</span></span>-->
<!--              </template>-->
          </el-table-column>
          <el-table-column
                  label="人工总金额"
                  :show-overflow-tooltip="true"
                  prop="artificialCost"
                  width="150px"
                  align="center"
          ></el-table-column>
          <el-table-column
                  label="税务支出总额"
                  :show-overflow-tooltip="true"
                  prop="taxSpendingTotal"
                  width="150px"
                  align="center"
          >
<!--              <template slot-scope="scope">-->
<!--                  <span @click="addPlan"><span style="color: #00a0e9">{{scope.row.taxSpendingTotal}}</span></span>-->
<!--              </template>-->
          </el-table-column>
          <el-table-column
                  label="税务收入总额"
                  :show-overflow-tooltip="true"
                  prop="taxIncomeTotal"
                  width="150px"
                  align="center"
          >
<!--              <template slot-scope="scope">-->
<!--                  <span @click="addPlan"><span style="color: #00a0e9">{{scope.row.taxIncomeTotal}}</span></span>-->
<!--              </template>-->
          </el-table-column>
          <el-table-column
                  label="预计税金"
                  :show-overflow-tooltip="true"
                  prop="expectedTaxTotal"
                  width="131px"
                  align="center"
          >
<!--              <template slot-scope="scope">-->
<!--                  <span @click="addPlan"><span style="color: #00a0e9">{{scope.row.expectedTaxTotal}}</span></span>-->
<!--              </template>-->
          </el-table-column>
        </el-table>
        <Pager
          :total="searchParams.total"
          :pageTotalChange="handleSizeChange"
          :size="searchParams.size"
          :current="searchParams.page"
          :pageChange="pageChange"
        ></Pager>
      </el-tab-pane>
<!--      <ContentDialog ref="dialog" :dialogHandleType="dialogHandleType" @success="refreshTable" />-->
    </el-tabs>
      <el-dialog
              :visible.sync="visible"
              :title="title"
              width="800px"
              class="myDialog"
              v-if="permButton('710202')"
      >

          <!--    <div style="display:flex;justify-content: space-between;align-items: center;">-->
          <el-table :data="gridData" style="width: 600px;margin-left: 75px">
              <el-table-column property="date" label="金额类型" width="250" prop="expenseTypeDictionary.value"></el-table-column>
              <el-table-column property="name" label="总金额" width="250" prop="detailsTotal"></el-table-column>
              <el-table-column property="address" label="所占比例" prop="probability">
                  <template slot-scope="scope"><span>{{(scope.row.probability) * 100}}%</span></template>
              </el-table-column>
<!--              <span>{{contentTotal}}</span>-->
          </el-table>
          <el-row slot="footer" class="dz-dialog-footer">
              <el-button class="button" type="primary" @click="handleAdd()">确认
              </el-button>
<!--              <el-button class="button" type="primary" @click="handleEdit()">查看详情-->
<!--              </el-button>-->
          </el-row>
          <!--    </div>-->
<!--          内层dialog,方便以后加详情的-->
<!--          <el-dialog-->
<!--                  width="30%"-->
<!--                  title="内层 Dialog"-->
<!--                  :visible.sync="innerVisible"-->
<!--                  append-to-body>-->
<!--          </el-dialog>-->
      </el-dialog>
  </div>
</template>
<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { financialAnalysisPage,financialAnalysisAuery } from "@/api/financialAnalysis";
// import ContentDialog from "./ContentDialog";
export default {
  name: "expenseRecord",
  components: {
  },
  data() {
    return {
      projectProp: null,
      title:'费用金额分类',
      visible:false,
      contentTotal:'',
      gridData:[],
      token: getUser().token,
      dialogHandleType: "add",
      searchParams: {
        page: 1,
        size: 10,
        total: 0,
        projectType:null,//项目类型
        employeeId:"",//项目负责人
        id:'',
        expenseTotal:'',//费用总金额
        projectStatus:null,//项目状态
        financialStatus: null, //有效状态（0-有效，1-无效）
        associationType: null, //	关联类型（0-项目，1-工作）
        projectId: null, //	关联项目id
        relatedWork: null, //	关联工作
        token: getUser().token
      },
      targerName: "first",
      options: [
        {
          name: '有效',
          id: '0'
        },
        {
          name: '无效',
          id: '1'
        }
      ],
      isValidParams: {
        id: "",
        financialStatus: ""
      },
      expenseRecordData: []
    };
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
      handleAdd(){
          this.visible = false
      },
    async addPlan(row) {
        let vm = this;
        const parmes = {
            associationType:row.associationType,
            id:row.id,
            token:getUser().token
        }
      vm.visible = true
        const loading = vm.$loading({
            lock: true,
            text: "正在查询..."
        });
        try {
            let data = await financialAnalysisAuery(parmes);
            console.log(data);
            vm.gridData = data.data;
            // vm.gridData.forEach((ele)=>{
            //     vm.contentTotal = (ele.detailsTotal / ele.expenseTotal).toString().substring(0,6)
            // })
            // console.log(typeof (vm.contentTotal)
            // )
        } catch (err) {
            console.log("页面加载失败，请刷新页面重试");
        } finally {
            loading.close();
        }
    },
    refreshTable(v) {
      let vm = this;
      vm.searchParams.page = 1;
      vm.fetchTableData();
      vm.$refs["dialog"].hide();
    },
    async fetchTableData() {
      let vm = this;
        const loading = vm.$loading({
            lock: true,
            text: "正在查询..."
        });
        try {
            console.log(this.searchParams);
            let data = await financialAnalysisPage(vm.searchParams);
            console.log(data);
            vm.expenseRecordData = data.data;
            vm.searchParams.total = data.total;
        } catch (err) {
            console.log("页面加载失败，请刷新页面重试");
        } finally {
            loading.close();
        }
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
        total: 0,
          projectType:null,//项目类型
          employeeId:"",//项目负责人
          projectStatus:'',//项目状态
        projectId: "", //	关联项目id
        relatedWork: "", //	关联工作
        employeeId: "", //	负责人id
        token: getUser().token
      };
      this.fetchTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.reportInfo {
  position: relative;
  .del {
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
  span {
    color: cornflowerblue;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0px 10px;
    float: left;
  }
}
.line2 {
  margin-top: 10px;
}
.line2 > span {
  border-right: 1px solid #eeeeee;
  padding: 5px 10px;
}
.line2 > span:last-child {
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
.el-card__body {
  overflow: hidden;
}
</style>