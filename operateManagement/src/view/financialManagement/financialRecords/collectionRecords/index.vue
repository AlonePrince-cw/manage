<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="收款记录" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
        >
          <el-form-item label="收款时间：">
            <el-date-picker
              v-model="searchParams.gatheringStartTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span> - </span>
            <el-date-picker
              v-model="searchParams.gatheringEndTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="金额范围:" class="meneyArea">
            <el-input v-model="searchParams.gatheringStartAmount" placeholder="请输入金额"></el-input>
            <span> - </span>
            <el-input v-model="searchParams.gatheringEndAmount" placeholder="请输入金额"></el-input>
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
              :snycModel.sync="searchParams.projectId"
            />
          </el-form-item>
          <el-form-item label="选择工作" v-if="searchParams.associationType===1">
            <GetPlatformDict
              :dictType="'relatedWork'"
              :value="searchParams.relatedWork"
              :snycModel.sync="searchParams.relatedWork"
            />
          </el-form-item>
<!--           <el-form-item label="财务状态：" prop="financialStatus">-->
<!--            <el-select v-model="searchParams.financialStatus" placeholder="请选择">-->
<!--              <el-option-->
<!--                v-for="item in options"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <!-- <el-form-item label="报销人：" prop="employeeId">
            <el-input v-model="searchParams.employeeId" placeholder="请输入报销人"></el-input>
          </el-form-item> -->
            <!-- <el-col :span="12">
          <el-form-item label="费用类型：">
            <div class="view-content">{{searchParams.expenseType | dict("expenseType")}}</div>
          </el-form-item>
        </el-col> -->
           <!-- <el-form-item label="费用类型：">
            <GetPlatformDict  :dictType = "'expenseType'" :value="searchParams.expenseType" :snycModel.sync="searchParams.expenseType"></GetPlatformDict>
           </el-form-item> -->
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
          <el-col :span="24">
              <div class="fl">
                  <el-button type="primary" @click="addPlan" class="reateBtn" v-if="permButton('71010301')">创建收款记录</el-button>
                  <el-button type="primary" @click="importExcel" class="reateBtn" v-if="permButton('71010308')">导入</el-button>
              </div>
          </el-col>
        <el-table border :data="expenseRecordData">
           <el-table-column label="财务状态" :show-overflow-tooltip="true" width="210px" prop="financialStatus" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.financialStatus === 0">有效</span>
              <span v-else>无效</span>
            </template>
          </el-table-column>
          <el-table-column
            label="收款时间"
            :show-overflow-tooltip="true"
            width="150px"
            prop="gatheringTime"
            align="center"
          ></el-table-column>
          <el-table-column
            label="收款金额"
            :show-overflow-tooltip="true"
            prop="gatheringAmount"
            width="150px"
            align="center"
          ></el-table-column>
          <el-table-column label="关联项目" :show-overflow-tooltip="true" align="center" width="150px">
            <template slot-scope="scope">
              <span v-if="scope.row.associationType === 0">{{scope.row.hstoneProject.projectName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="关联工作" :show-overflow-tooltip="true" width="150px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.associationType === 1">{{scope.row.relatedWorkDictionary.value}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
         <el-table-column
            label="操作人"
            :show-overflow-tooltip="true"
            width="150px"
            prop="creatorEmployee.name"
            align="center"
          >
          </el-table-column>
          <el-table-column
                  label="备注"
                  :show-overflow-tooltip="true"
                  width="220px"
                  prop="details"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  label="附件"
                  :show-overflow-tooltip="true"
                  width="80px"
                  align="center"
          >
            <template slot-scope="scope">
              <!--              <span>{{upLoad.length}}个</span>-->
              <div class="form-uploader">
                <!--                <div class="form-uploader-result">-->
                <div class="uploaded-number" @click="fileInfo(scope.row.hstoneFileEntityRelas)">{{scope.row.hstoneFileEntityRelas.length}}个
                </div>
                <!--                  <img class="img-cover"  alt="">-->
                <!--                </div>-->
              </div>
            </template>
          </el-table-column>
            <!-- <el-table-column
            label="费用类型"
            :show-overflow-tooltip="true"
            width="200px"
            prop="expenseType"
            align="center"
          >
         <template slot-scope="scope">
           {{scope.row.expenseType | dict("expenseType")}}
         </template>
          </el-table-column> -->
          <el-table-column label="操作" width="300px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="check(scope.row)" v-if="permButton('71010302')">查看</el-button>
              <el-button size="small" type="text" @click="update(scope.row)" v-if="permButton('71010303')">编辑</el-button>
              <el-button
                @click="validChange(scope.row)"
                v-if="scope.row.financialStatus === 0"
                size="small"
                type="text"
                style="color: red;cursor: pointer"
              ><span v-if="permButton('71010307')">设置失效</span></el-button>
              <el-button @click="validChange(scope.row)" v-else size="small" type="text"><span v-if="permButton('71010307')">设置有效</span></el-button>
            </template>
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
      <ContentDialog ref="dialog" :dialogHandleType="dialogHandleType" @success="refreshTable" />
      <ContentViewDialog ref="checkDialog"></ContentViewDialog>
      <el-dialog :visible.sync="fileDialog" title="附件详情" width="600px">
        <el-form ref="addJob" style="padding: 0px 12px 0 12px;" label-width="100px">
          <el-row>
            <v-doc-list :list="upLoad"/>
          </el-row>
        </el-form>
        <div slot="footer" class="dialogFooter">
          <el-button @click="fileDialog = false">关闭</el-button>
        </div>
      </el-dialog>
      <importOrgExcel :ishow="importExcelShow" ref="importExcel" :uploadPath="uploadPath" :templateId="templateId" :title="importTitle" @success="refreshTable"></importOrgExcel>
    </el-tabs>
  </div>
</template>
<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { addCollectionRecords, costEffective } from "@/api/collectionRecords";
import ContentDialog from "./ContentDialog";
import ContentViewDialog from "./ContentViewDialog";
export default {
  name: "collectionRecords",
  components: {
    ContentDialog,
    ContentViewDialog
  },
  data() {
    return {
      projectProp: null,
      token: getUser().token,
      dialogHandleType: "add",
      fileDialog:false,
      importExcelShow: false,
      uploadPath: '/api/dispatch/pc/71010308',
      importTitle: '批量导入收款记录',
      // templateId: '40fed3892647417cae880e67e6dde4f6', //140正式环境
      templateId: '742f9545da664637bcb2f7c69a2dc324',
      expenseRecordData: [],
      upLoad:[],
      searchParams: {
        page: 1,
        size: 10,
        total: 0,
        gatheringStartTime:"",//收款开始时间
        gatheringEndTime:"",//收款结束
        gatheringStartAmount:"",//收款开始金额
        gatheringEndAmount:"",//收款结束金额
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
    };
  },
  created() {
    this.fetchTableData();
  },

  methods: {
    fileInfo (v) {
      let vm = this
      vm.upLoad = []
      console.log(v)
      v.forEach(function (key) {
        vm.upLoad.push({
          fileName: key.fileName,
          fileId: key.fileId,
          part: key.part,
          uniqueCode: key.fileCode
        })
      })
      vm.fileDialog = true
    },
    permButton(v){
      let f = ''
      if(getPerm().indexOf(v) === -1){
        f = false
      }else {
        f = true
      }
      return f
    },
    importExcel() {
      this.$refs['importExcel'].show()
    },
    // 设置有效/失效
    validChange(v) {
      console.log(v);
      let vm = this;
      vm.$confirm(
              `确定要设置为${v.financialStatus === 0 ? "失效" : "有效"}？`,
        "提示",
        {
          type: "warning"
        }
      ).then(async () => {
        vm.isValidParams = {
          id: v.id,
          financialStatus: v.financialStatus === 0 ? 1 : 0,
          token: getUser().token
        };
        const loading = this.$loading({
          lock: true,
          text: "正在设置..."
        });
        try {
          await costEffective(vm.isValidParams);
          vm.$message.success("设置成功");
          vm.fetchTableData();
        } catch (err) {
          console.log(err);
        } finally {
          loading.close();
        }
      }, _.noop);
    },

    edit(v) {},
    //查看
    check(row) {
      let vm = this;
      vm.dialogHandleType = "check";
      vm.$refs["checkDialog"].setFormDatas(row);
      vm.$refs["checkDialog"].show();
      console.log(row);
    },
    // 编辑
    update(row) {
      let vm = this;
      vm.dialogHandleType = "edit";
      vm.$refs["dialog"].setFormDatas(row);
      vm.$refs["dialog"].show();
    },
    addPlan(v) {
      let vm = this;
      vm.dialogHandleType = "add";
      vm.$refs["dialog"].show(v);
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
        let data = await addCollectionRecords(vm.searchParams);
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
        financialStatus: "", //财务状态
        invoiceTime: "", //发生开始时间
        occurEndTime: "", //	发生结束时间
        invoiceStartAmount: "", //金额开始时间
        invoiceEndAmount: "", //	金额结束时间
        projectId: "", //	关联项目id
        relatedWork: "", //	关联工作
        employeeId: "", //	负责人id
        // financialStatus: "", //	有效状态
        expenseType: "", //	费用类型
        associationType: null,
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