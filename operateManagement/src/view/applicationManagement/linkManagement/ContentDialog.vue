<template>
  <el-dialog :visible.sync="visible" :title="title" width="1100px" @open="onOpen" class="myDialog">
    <el-form
      ref="serchParams"
      :model="serchParams"
      :rules="rules"
      label-width="140px"
      style="padding: 0 10px;"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称:">
            <projectSelect
                    @selectData="selectData"
                    :value="serchParams.projectId"
                    :snycModel.sync="serchParams.projectId"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地区:" prop="regionId" v-if="dialogHandleType === 'add'">
              <placeSelect @selectPlace="placeChange" :value="placeVal" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目类型:"  v-if="dialogHandleType === 'add'">
            <GetPlatformDict :dictType = "'projectType'" :value="serchParams.projectType" :snycModel.sync="serchParams.projectType" disabled></GetPlatformDict>
          </el-form-item>
        </el-col>
      </el-row>



      <el-row>
        <div class="maxBox">
        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%">
<!--          <el-table-column-->
<!--                  type="selection"-->
<!--                  align="center"-->
<!--                  width="80">-->
<!--          </el-table-column>-->
          <el-table-column label="序号"
                  align="center"
                  width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sortNum" placeholder="序号" maxlength="5"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="链接名" align="center" width="270">
            <template slot-scope="scope">
              <el-form :model="scope.row" :rules="rules">
                <el-form-item prop="name">
                  <el-input v-show="true" v-model="scope.row.name" style="margin-top: 20px;" placeholder="请输入链接名" maxlength="50"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="访问地址" align="center" width="270">
            <template slot-scope="scope">
              <el-form :model="scope.row" :rules="rules">
                <el-form-item prop="url">
                  <el-input v-show="true" v-model="scope.row.url" style="margin-top: 20px;" placeholder="请输入访问地址" maxlength="50"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="说明" align="center" width="340">
            <template slot-scope="scope">
              <el-form :model="scope.row" :rules="rules">
                <el-form-item prop="details">
                  <el-input v-show="true" v-model="scope.row.details" style="margin-top: 20px;" placeholder="请输入说明"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                      size="mini"
                      type="danger"
                      @click="deleteData(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
          <div style="margin-top: 20px;margin-left: 500px">
            <el-button @click="addObjData">添加</el-button>
          </div>
      </el-row>
      <el-row style="margin-top: 30px;">
        <div class="maxBox">
        <el-table
                ref="multipleTable"
                :data="tableDatas"
                tooltip-effect="dark"
                style="width: 100%">
<!--          <el-table-column-->
<!--                  type="selection"-->
<!--                  align="center"-->
<!--                  width="80">-->
<!--          </el-table-column>-->
          <el-table-column label="序号"
                           align="center"
                           width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sortNum" placeholder="序号" maxlength="5"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="下载渠道" align="center" width="270">
            <template slot-scope="scope">
              <el-form :model="scope.row" :rules="rules">
                <el-form-item prop="name">
                  <el-input v-show="true" v-model="scope.row.name" style="margin-top: 20px;" placeholder="请输入链接名" maxlength="50"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="下载地址" align="center" width="270">
            <template slot-scope="scope">
              <el-form :model="scope.row" :rules="rules">
                <el-form-item prop="url">
                  <el-input v-show="true" v-model="scope.row.url" style="margin-top: 20px;" placeholder="请输入访问地址" maxlength="50"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="说明" align="center" width="340">
            <template slot-scope="scope">
              <el-form :model="scope.row" :rules="rules">
                <el-form-item prop="details">
                  <el-input v-show="true" v-model="scope.row.details" style="margin-top: 20px;" placeholder="请输入说明"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                      size="mini"
                      type="danger"
                      @click="deleteDatas(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
        <div style="margin-top: 20px;margin-left: 500px">
          <el-button @click="addObjDatas">添加</el-button>
        </div>
      </el-row>
    </el-form>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button
        class="button"
        type="primary"
        @click="handleAdd()"
        v-if="dialogHandleType === 'add' && permButton('71010816')"
      >确认创建</el-button>
      <el-button
        class="button"
        type="primary"
        @click="handleEdit()"
        v-if="dialogHandleType === 'edit' && permButton('71010817')"
      >保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from "@/mixins/dialog";
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { newProjectLink,odifyProjecmtLinks} from "@/api/application";
import { getPlaceParent } from '@/api/common'
import _ from "lodash";
const emptyForm = {
  projectType:null,
  regionTreeCode:'',
  regionId:'',
  projectId:"",
};
export default {
  mixins: [DialogMixin],
  props: {
    dialogHandleType: {
      type: String,
      default: "add"
    },
    dialogType: {
      type: String,
      default: "text"
    },
  },
  data() {
    return {
      sortNum:'',
      tableData: [],
      tableDatas:[],
      rules: {
      },
      serchParams: _.clone(emptyForm),
      token: getUser().token,
      menuNode: null,
      placeVal: []
    };
  },
  created() {},
  computed: {
    title() {
      return this.dialogHandleType === "add"
        ? "创建项目"
        : this.dialogHandleType === "edit"
        ? "项目修改"
        : "创建项目";
    }
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
    async getPlaceParent(v){
      let params = {
        id: v,
        levelNum: 0,
        token: getUser().token
      }
      let { data } = await getPlaceParent(params)
      this.placeVal.push(data.parentsNameStr)
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.serchParams.regionId = v[v.length-1].value
    },
    selectData (v) {
      this.serchParams.projectId = v.id
      this.serchParams.projectType = v.projectType
      this.getPlaceParent(v.regionId)
    },
    addObjData(){
      this.tableData.push({
        sortNum:'',
        type:0,
        name:"",
        url:"",
        details:""
      })
    },
    addObjDatas(){
      this.tableDatas.push({
        sortNum:'',
        type:1,
        name:"",
        url:"",
        details:""
      })
    },
    deleteDatas(index,row){
      this.tableDatas.splice(index, 1)
    },
    deleteData(v,a){
      console.log(v,a)
      this.tableData.splice(v, 1)
    },
    // permButton(v){
    //   let f = ''
    //   if(getPerm().indexOf(v) === -1){
    //     f = false
    //   }else {
    //     f = true
    //   }
    //   return f
    // },
    onOpen() {
      if (this.dialogHandleType === "add") {
        this.serchParams = Object.assign({}, emptyForm);
        this.tableData = [];
        this.tableDatas = [];
        this.placeVal = [];
        this.attachmentFiles = [];
        this.$nextTick(() => {
          this.$refs["serchParams"].clearValidate();
        });
      }
    },
    async setFormDatas(data) {
      console.log(data)
      let vm = this;
      // vm.getPlaceParent(project.regionId)
      vm.placeVal = [];
      vm.serchParams = {
        projectId: data.projectId,
        projectType:data.projectType,
      };
      if (data.projectLinks.length > 0) {
        vm.tableData = [];
        vm.tableDatas = [];
        data.projectLinks.forEach(key => {
         console.log(key)
          if(key.type === 0){
            vm.tableData.push(key)
          }
      if(key.type === 1){
        vm.tableDatas.push(key)
      }
        });
      }
    },
    async onUploadConfirms(v) {
      let vm = this;
      if (vm.uploadType === "video") {
        vm.videoFiles = v;
      } else if (vm.uploadType === "tvVideo") {
        vm.tvFiles = v;
      } else {
        vm.attachmentFiles = v;
      }
    },
    handleAdd() {
      let vm = this;
      console.log(vm.sortNum)
      const parmes = {
        token:getUser().token,
        projectId:vm.serchParams.projectId,
        projectLinkJson:[]
      }
      vm.tableData.forEach((element)=>{
        if (element.type === 0){
          parmes.projectLinkJson.push(element)
        }
      })
      vm.tableDatas.forEach((v)=>{
        if(v.type === 1){
          parmes.projectLinkJson.push(v)
        }
      })
      parmes.projectLinkJson = JSON.stringify(parmes.projectLinkJson)
      vm.loading = true;
      vm.$refs.serchParams.validate().then(async () => {
        await newProjectLink(parmes);
        vm.loading = false;
        vm.$message.success("创建成功");
        vm.$emit("success");
      });
    },
    handleEdit() {
      let vm = this;
      const parmesData = {
        token:getUser().token,
        projectId:vm.serchParams.projectId,
        sortNum:vm.sortNum,
        projectLinkJson:[]
      }
      vm.tableData.forEach((element)=>{
        if (element.type === 0){
          parmesData.projectLinkJson.push(element)
        }
      })
      vm.tableDatas.forEach((v)=>{
        if(v.type === 1){
          parmesData.projectLinkJson.push(v)
        }
      })
      parmesData.projectLinkJson = JSON.stringify(parmesData.projectLinkJson)
      vm.loading = true;
      vm.$refs.serchParams.validate().then(async () => {
        await odifyProjecmtLinks(parmesData);
        vm.loading = false;
        vm.$message.success("修改成功");
        vm.$emit("success");
      });
    },
    }
};
</script>
<style lang="scss">
  .maxBox{
    max-height: 400px;
    width: 100%;
    overflow-x:hidden;
    overflow-y:scroll;table-layout: fixed;word-wrap:break-word;word-break:break-all;
  }
  .el-table--scrollable-x .el-table__body-wrapper{
    overflow-x:hidden;
  }
.myDialog {
  .el-dialog__body {
    padding-left: 0px;
  }
  .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
  .el-date-editor {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
