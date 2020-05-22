<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="链接应用" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
        >
          <el-form-item label="项目名称:">
            <el-input v-model="serchParams.projectName" placeholder="请输入关键字搜索"></el-input>
          </el-form-item>
          <el-form-item label="项目类型:">
            <GetPlatformDict :dictType = "'projectType'" :value="serchParams.projectType" :snycModel.sync="serchParams.projectType"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="省份:" prop="regionId">
            <placeSelect @selectPlace="placeChange" :value="placeVal"/>
          </el-form-item>
          <el-form-item class="searchBtn fr">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
<!--        <el-col :span="24">-->
<!--          <div class="fl">-->
<!--            <el-button type="primary" @click="addPlan" class="reateBtn">创建项目</el-button>-->
<!--          </div>-->
<!--        </el-col>-->
        <el-table border :data="expenseRecordData">
          <el-table-column
                  label="项目名称"
                  :show-overflow-tooltip="true"
                  width="250px"
                  prop="project.projectName"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  label="项目类型"
                  :show-overflow-tooltip="true"
                  prop="project.projectTypeDictionary.value"
                  width="250px"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  label="访问地址"
                  :show-overflow-tooltip="true"
                  prop="project"
                  width="425px"
                  align="center"
          >
           <template slot-scope="scope">
             <div v-for="item in scope.row.projectLinks" :key="item.id">
<!--               <p v-if="item.type === 0"><router-link :to="item.url"><span style="color: #00b7ee">{{item.url}}</span></router-link></p>-->
                 <p v-if="item.type === 0"><a :href="item.url"><span style="color: rgb(64,158,255);text-decoration: underline">{{item.name}}</span></a></p>
             </div>
           </template>
          </el-table-column>
          <el-table-column
                  label="下载链接"
                  :show-overflow-tooltip="true"
                  prop="project"
                  width="425px"
                  align="center"
          >
            <template slot-scope="scope">
             <div v-for="item in scope.row.projectLinks" :key="item.id">
<!--               <p v-if="item.type === 1"><router-link :to="item.url"><span style="color: #00b7ee">{{item.url}}</span></router-link></p>-->
                 <p v-if="item.type === 1"><a :href="item.url"><span style="color: rgb(64,158,255);text-decoration: underline">{{item.name}}</span></a></p>
             </div>
            </template>
          </el-table-column>
          <el-table-column
                  label="地区"
                  :show-overflow-tooltip="true"
                  prop="project.regionName"
                  width="230px"
                  align="center"
          ></el-table-column>
        </el-table>
        <Pager
          :total="serchParams.total"
          :pageTotalChange="handleSizeChange"
          :size="serchParams.size"
          :current="serchParams.page"
          :pageChange="pageChange"
        ></Pager>
      </el-tab-pane>
<!--      <ContentDialog ref="dialog" :dialogHandleType="dialogHandleType" @success="refreshTable" />-->
<!--      <ContentViewDialog ref="checkDialog"></ContentViewDialog>-->
    </el-tabs>
  </div>
</template>
<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { applicationPage} from "@/api/application";
import { getPlaceParent } from '@/api/common'
// import ContentDialog from "./ContentDialog";
// import ContentViewDialog from "./ContentViewDialog";
export default {
  name: "costRecord",
  data() {
    return {
      projectProp: null,
      placeVal: [],
      token: getUser().token,
      dialogHandleType: "add",
      importExcelShow: false,
      serchParams: {
        page: 1,
        size: 10,
        total: 0,
        projectName:null,
        regionTreeCode:'',
        regionId: '',
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
    // 选择地区查询
    async getPlaceParent(v){
      let params = {
        id: v,
        levelNum: 0,
        token: getUser().token
      }
      let { data } = await getPlaceParent(params)
      this.placeVal.push(data.parentsNameStr)
    },
    placeChange(v){
      let vm = this
      console.log(v)
      // vm.serchParams.regionId = v[v.length-1].value
      vm.serchParams.regionTreeCode = v[v.length-1].treeCode
    },
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
      vm.serchParams.page = 1;
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
        console.log(this.serchParams);
        let data = await applicationPage(vm.serchParams);
        vm.expenseRecordData = data.data;
        console.log(vm.expenseRecordData)
        vm.serchParams.total = data.total;
      } catch (err) {
        console.log("页面加载失败，请刷新页面重试");
      } finally {
        loading.close();
      }
    },
    // 搜索
    onSearch() {
      this.serchParams.page = 1;
      this.fetchTableData();
    },
    // 分页查询
    handleSizeChange(val) {
      let vm = this;
      vm.serchParams.size = val;
      vm.fetchTableData();
    },
    pageChange(val) {
      let vm = this;
      vm.serchParams.page = val;
      vm.fetchTableData();
    },
    // 重置
    Reset() {
      this.serchParams = {
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      };
      this.placeVal = [];
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