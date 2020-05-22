<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="我的日报" name="first">
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
              type="date"
              placeholder="开始时间"
              range-separator="-"
            ></el-date-picker> 至
            <el-date-picker
              v-model="searchParams.EndTime"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              type="date"
              range-separator="-"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="未解决问题">
            <el-select v-model="searchParams.hasPro">
              <el-option value="0" label="没有"></el-option>
              <el-option value="1" label="有"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重要程度:">
            <GetPlatformDict
              :dictType="'importantStatus'"
              :value="searchParams.importantStatus"
              :snycModel.sync="searchParams.importantStatus"/>
          </el-form-item>
          <el-form-item label="关联方式">
            <el-select v-model="searchParams.associationType">
              <el-option label="关联工作" :value="1"></el-option>
              <el-option label="关联项目" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择项目" v-if="searchParams.associationType===0">
            <projectSelect
              @selectData="selectData"
              :value="searchParams.projectId"
              :snycModel.sync="searchParams.projectId"
            />
          </el-form-item>
          <el-form-item label="选择工作" v-if="searchParams.associationType===1">
            <GetPlatformDict
              :dictType="'relatedWork'"
              :value="searchParams.relatedWork"
              :snycModel.sync="searchParams.relatedWork"/>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
        <el-col :span="24">
          <div class="fr">
            <el-button type="primary" @click="writeDaily" class="reateBtn" v-if="permButton('510301')">写日报</el-button>
            <el-button type="primary" @click="importExcel">日报批量导入</el-button>
          </div>
        </el-col>
        <el-card
          width="100%"
          class="personCard"
          v-if="reportData.length>0"
          v-for="item in reportData"
          :key="item.id">
          <el-col :span="24" class="reportInfo">
            <el-col :span="2" style="width: 50px">
              <img src="@/assets/avatar.png" @error="errorImg($event,'avatar')" alt="">
            </el-col>
            <el-col :span="22">
              <strong>{{item.hstoneEmployee.name}}
                <span class="name" v-if="item.hstoneEmployee">
                  <template v-for="val in item.hstoneEmployee.hstoneEmployeePosition">
                    {{val.organization.fullName}} -
                    <span v-for="v in val.positionDictionarys">{{v.value}};</span>
                  </template>
                </span>
              </strong>
            </el-col>
            <el-col :span="22" style="margin-top: 3px">
              <span>{{item.reportTime}}日报</span>
              <span v-if="item.createTime" style="margin-left: 16px;color: #B4B4B4">{{item.createTime | dateFormatYmdHms('-')}}</span>
              <span @click="receiveRange(item)" style="color: #409EFF;margin-left: 16px;cursor: pointer" v-if="permButton('510309')">接收范围</span>
            </el-col>
            <a class="del" @click="del(item.id)"><i class="el-icon-delete"></i><span v-if="permButton('510302')">删除</span> </a>
          </el-col>
          <el-col :span="24">
            <el-col :span="19" class="line2">
              <span v-if="item.associationType === 0">
                <el-tag size="medium" style="padding: 0px 10px"><template v-if="item.hstoneProject">{{item.hstoneProject.projectName}}</template></el-tag>
                <span type="success" style="margin-left: 16px">关联计划：无</span>
              </span>
              <span v-if="item.associationType === 1">
                <el-tag size="medium" type="success" style="padding: 0px 10px"><template v-if="item.relatedWorkDictionary">{{item.relatedWorkDictionary.value}}</template></el-tag>
                <span style="margin-left: 16px">关联项目：无</span>
              </span>
              <span>事项名称：{{item.workTopic}}</span>
              <span>耗时:{{item.takeTime}}h</span>
              <span>完成度：{{item.completionStatus}}</span>
              <span @click="fileInfo(item.hstoneFileEntityRelas)">
                <el-link><i class="el-icon-folder-opened"></i> 附件：{{item.hstoneFileEntityRelas.length}}个</el-link>
              </span>
            </el-col>
          </el-col>
          <el-col :span="24" class="description" v-if="item.describle">
            <span>工作描述：{{item.describle}}</span>
          </el-col>
          <el-col :span="24" class="description" v-if="item.problem">
            <span>存在问题：{{item.problem}}</span>
          </el-col>
          <el-col :span="24" class="description" v-if="item.solve">
            <span>解决办法：{{item.solve}}</span>
          </el-col>
          <el-col :span="24" class="description" v-if="item.help">
            <span>所需帮助：{{item.help}}</span>
          </el-col>
          <el-col :span="24" class="read" v-if="item.readEmployees.length !== 0">
            <span class="haveread"><i class="el-icon-success"></i> <span>{{item.readEmployees.length}}人已读</span></span>
            <el-avatar class="header-img" :size="40" :src="headImg(item.headImg)" :key="v.id" v-for="(v,n) in item.readEmployees"></el-avatar>
          </el-col>
          <el-col :span="24">
            <commentReplys :mainId="item.id" :comments="replyFn(item.hstoneWorkDayReportComments)" @success="refreshTable"></commentReplys>
          </el-col>
        </el-card>
        <div v-if="reportData.length === 0" style="clear: both">
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
    <el-dialog :visible.sync="fileDialog" title="附件详情" width="600px" >
      <el-form ref="addJob" style="padding: 0px 12px 0 12px;" label-width="100px">
        <el-row>
          <v-doc-list :list="fileList"></v-doc-list>
        </el-row>
      </el-form>
      <div slot="footer" class="dialogFooter">
        <el-button @click="fileDialog = false">关闭</el-button>
      </div>
    </el-dialog>
    <importOrgExcel :ishow="importExcelShow" ref="importExcel" :uploadPath="uploadPath" :templateId="templateId" :title="importTitle" @success="refreshTable"></importOrgExcel>
    <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' :topicId = 'topicId' @success="refreshTable"/>
    <el-dialog :visible.sync="receiveDialog" title="接收范围" width="800px" >
      <el-row>
        <el-tabs v-model="activeName">
          <el-tab-pane :label="'接收人'" name="first">
            <el-table
              :data="allEmp"
              align="center"
              style="width: 100%;margin: 0px">
              <el-table-column
                  prop="name"
                  label="姓名"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="lastTime"
                  label="职称"
                  align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.hstoneEmployeePosition">
                    <template v-for="v in scope.row.hstoneEmployeePosition">
                      <template v-for="(val,n) in v.positionDictionarys">
                        {{val.value}}<span v-if="(n+1) !== v.positionDictionarys.length">;</span>
                      </template>
                    </template>
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="'已读'" name="second">
            <el-table
                :data="readEmp"
                align="center"
                style="width: 100%;margin: 0px">
              <el-table-column
                  prop="name"
                  label="姓名"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="lastTime"
                  label="职称"
                  align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.hstoneEmployeePosition">
                    <template v-for="v in scope.row.hstoneEmployeePosition">
                      <template v-for="(val,n) in v.positionDictionarys">
                        {{val.value}}<span v-if="(n+1) !== v.positionDictionarys.length">;</span>
                      </template>
                    </template>
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                  prop="organizationName"
                  align="center"
                  label="阅读时间">
                <template slot-scope="scope">
                  <span v-if="scope.row.modifyTime">{{scope.row.modifyTime | dateFormatYmdHms}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="'未读'" name="third">
            <el-table
                :data="noReadEmp"
                align="center"
                style="width: 100%;margin: 0px">
              <el-table-column
                  prop="name"
                  label="姓名"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="lastTime"
                  label="职称"
                  align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.hstoneEmployeePosition">
                    <template v-for="v in scope.row.hstoneEmployeePosition">
                      <template v-for="(val,n) in v.positionDictionarys">
                        {{val.value}}<span v-if="(n+1) !== v.positionDictionarys.length">;</span>
                      </template>
                    </template>
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <div slot="footer" class="dialogFooter">
        <el-button @click="receiveDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { dateFormatYmdHms } from "util";
import { reportPage, reportDel, reportRange } from "@/api/report";
import ContentDialog from './ContentDialog'
export default {
  components: {
      ContentDialog
  },
  data() {
    return {
      token: getUser().token,
      allEmp: [],
      readEmp: [],
      noReadEmp: [],
      fileDialog: false,
      receiveDialog: false,
      activeName: 'first',
      attachmentFiles: [],
      dialogHandleType: 'add',
      importExcelShow: false,
      uploadPath: '/api/dispatch/pc/510305',
      importTitle: '批量导入人员',
      templateId: 'c3e9a4ca9be546bbad777be7927d51dd',
      topicId: '',
      fileList: [],
      reportData: [],
      searchParams: {
        page: 1,
        size: 10,
        startTime: "",
        EndTime: "",
        hasPro: null,
        importantStatus: null,
        associationType: null,
        projectId: null,
        relatedWork: null,
        token: getUser().token
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
    importExcel() {
      this.$refs['importExcel'].show()
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
            await reportDel(params)
            vm.$message.success('删除成功')
            vm.fetchTableData()
        }, _.noop)
    },
    replyFn(v) {
        let arr = v
        arr.forEach(function (val) {
            val.inputShow = false
        })
        return arr
    },
    fileInfo(v) {
      let vm = this
      vm.fileList = []
      v.forEach(function (key) {
        vm.fileList.push({
          name: key.fileName,
          originalName: key.fileName,
          fileName: key.fileName,
          fileId: key.fileId,
          part: key.part,
          uniqueCode: key.fileCode
        })
      })
      vm.fileDialog = true
    },
    refreshTable (v) {
      let vm = this
      vm.searchParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
    },
    selectData(v) {
      console.log(v)
    },
    headImg (src) {
      src = src || require('@/assets/avatar.png');
      return src
    },
    writeDaily(v) {
      let vm = this
      vm.dialogHandleType = 'add'
      vm.$refs['dialog'].show()
    },
    // 搜索
    onSearch() {
      console.log(this.searchParams)
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
    async receiveRange(v){
      let vm = this
      let params = {
        id:v.id,
        token: getUser().token
      }
      vm.receiveDialog = true
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      try {
        let {data} = await reportRange(params)
        vm.allEmp = data.allEmp
        vm.readEmp = data.readEmp
        vm.noReadEmp = data.noReadEmp
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    // 附件上传
    onUploadConfirms(v) {
      if (this.uploadType === "video") {
        this.videoFiles = v;
      } else if (this.uploadType === "tvVideo") {
        this.tvFiles = v;
      } else {
        this.attachmentFiles = v;
      }
    },
    showUploaders(type) {
      this.uploadType = type;
      if (type === "video") {
        this.$refs["uploaders"].show(this.videoFiles);
      }
      if (type === "tvVideo") {
        this.$refs["uploaders"].show(this.tvFiles);
      }
      if (type === "attachment") {
        this.$refs["uploaders"].show(this.attachmentFiles);
      }
    },
    // 重置
    Reset() {
      this.searchParams = {
        page: 1,
        size: 10,
        startTime: "",
        EndTime: "",
        hasPro: null,
        importantStatus: null,
        associationType: null,
        projectId: null,
        relatedWork: null,
        token: getUser().token
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
        let data = await reportPage(vm.searchParams)
        vm.reportData = data.data
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
