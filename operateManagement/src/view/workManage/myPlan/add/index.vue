<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane :label="title" name="first">
        <div class="myFromInfo">
          <el-form
            ref="form"
            :model="fromParams"
            :rules="rules"
            label-width="140px">
              <el-row class="conBox">
                <el-col :span="24" class="header">
                  <span>基本信息</span>
                </el-col>
                <el-row class="infoBox">
                  <el-col :span="12">
                    <el-form-item label="计划时间" prop="planTime">
                      <el-date-picker
                        v-model="fromParams.planTime"
                        type="date"
                        :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="计划名称" prop="name">
                      <el-input v-model="fromParams.name" :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="重要程度" prop="importantStatus">
                      <GetPlatformDict
                        :dictType="'importantStatus'"
                        :value="fromParams.importantStatus"
                        :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0"
                        :snycModel.sync="fromParams.importantStatus"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="关联方式" prop="associationType">
                      <el-select v-model="fromParams.associationType" :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0">
                        <el-option label="关联工作" :value="1"></el-option>
                        <el-option label="关联项目" :value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="选择项目" v-if="fromParams.associationType===0" prop="projectId">
                      <projectSelect
                        :value="fromParams.projectId"
                        :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0"
                        :snycModel.sync="fromParams.projectId"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="选择工作" v-if="fromParams.associationType===1" prop="relatedWork">
                      <GetPlatformDict
                        :dictType="'relatedWork'"
                        :value="fromParams.relatedWork"
                        :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0"
                        :snycModel.sync="fromParams.relatedWork"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-col :span="24" class="header">
                  <span>计划事项</span>
                </el-col>
                <el-row class="infoBox">
                  <el-col :span="24" class="btns">
                    <template v-if="$route.name === 'addPlan' || fromParams.planStatus === 1">
                      <el-button type="danger" @click="delItem" v-if="permButton('510104')">删除事项</el-button>
                      <el-button type="success" @click="addItem">添加事项</el-button>
                    </template>
                    <template v-if="$route.name === 'editPlan' && fromParams.planStatus === 0">
                      <el-button type="danger" @click="infoStatus(101)" v-if="permButton('510108')">终止计划</el-button>
                      <el-button type="warning" @click="infoStatus(100)" v-if="permButton('510108')">恢复计划</el-button>
                      <el-button type="success" @click="infoStatus(102)" v-if="permButton('510108')">计划完成</el-button>
                    </template>
                  </el-col>
                  <el-table border :data="fromParams.hstoneWorkPlanInfos" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="45" align="center"></el-table-column>
                    <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>
                    <el-table-column label="内容标题" :show-overflow-tooltip="true" width="180px" prop="info" align="center"></el-table-column>
                    <el-table-column label="耗时" :show-overflow-tooltip="true" prop="takeTime" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.takeTime}}h</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" :show-overflow-tooltip="true" prop="infoStatus" align="center">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.infoStatus === '100' || scope.row.infoStatus === 100">正常</el-tag>
                        <el-tag type="success" v-if="scope.row.infoStatus === '102' || scope.row.infoStatus === 102">完成</el-tag>
                        <el-tag type="danger" v-if="scope.row.infoStatus === '101' || scope.row.infoStatus === 101">终止</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--<Pager-->
                    <!--v-if="$route.name !== 'addPlan'"-->
                    <!--:total="searchParams.total"-->
                    <!--:pageTotalChange="handleSizeChange"-->
                    <!--:size="searchParams.size"-->
                    <!--:current="searchParams.page"-->
                    <!--:pageChange="pageChange"></Pager>-->
                </el-row>
                <el-col :span="24" class="header">
                  <span>其他信息</span>
                </el-col>
                <el-row class="infoBox">
                  <el-col :span="24">
                    <el-form-item label="验收标准:" label-width="145px" prop="criterion">
                      <el-input type="textarea" v-model="fromParams.criterion" :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="计划依据:" v-if="$route.name === 'editPlan' && fromParams.planStatus === 0">
                      <v-doc-list :list="attachmentFiles"></v-doc-list>
                    </el-form-item>
                    <el-form-item label="计划依据:" v-else>
                      <div class="form-uploader">
                        <div class="form-uploader-button" @click="showUploaders('attachment')">
                          <div><i class="form-uploader-icon el-icon-plus"></i></div>
                          <div>上传</div>
                        </div>
                        <div class="form-uploader-result" v-if="attachmentFiles.length > 0">
                          <div class="uploaded-number">{{attachmentFiles.length}}个</div>
                          <img class="img-cover" src="@/assets/word.jpeg" alt="">
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="计划接收人:" class="planResevied" prop="hstoneWorkPlanRevices">
                      <membersSelect :value="receivesData" @selectData="selectDatas" :disabled="$route.name === 'editPlan' && fromParams.planStatus === 0"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="dz-dialog-footer">
                  <el-button class="button" type="primary" @click="$router.back()">返回</el-button>
                  <el-button class="button" type="primary" @click="handleAdd(true)" v-if="$route.name === 'addPlan'">提交计划</el-button>
                  <el-button class="button" type="success" @click="handleAdd(false)" v-if="$route.name === 'addPlan'">保存草稿</el-button>
                  <el-button class="button" type="primary" @click="handleEdit(true)" v-if="$route.name === 'editPlan' && fromParams.planStatus !== 0">保存修改</el-button>
                  <el-button class="button" type="success" @click="handleEdit(false)" v-if="$route.name === 'editPlan' && fromParams.planStatus !== 0">保存草稿</el-button>
                </el-row>
              </el-row>
          </el-form>
          <el-dialog :visible.sync="addItemDialog" title="添加事项" width="500px" >
            <el-form style="padding: 0px 12px 0 12px;" ref="setManager" label-width="85px" :rules="addItemRules" :model="addItemParams">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="内容标题:" prop="info">
                    <el-input v-model="addItemParams.info"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="耗时(h):" prop="takeTime">
                    <el-input-number v-model="addItemParams.takeTime" controls-position="right" :min="0"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="事项状态:" prop="infoStatus">
                    <GetPlatformDict :dictType = "'infoStatus'" :value="addItemParams.infoStatus" :snycModel.sync="addItemParams.infoStatus"></GetPlatformDict>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialogFooter">
              <el-button type="primary" @click="saveItem">提交</el-button>
            </div>
          </el-dialog>
          <Uploader
            ref="uploaders"
            :title="'附件上传'"
            target="meta"
            :limt="10"
            :token="token"
            :file-type="'0'"
            @confirm="onUploadConfirms"/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { planAdd, planEdit, planDetails, planStatus } from '@/api/plan'
  import _ from 'lodash'

  export default {
    name: 'addpPlan',
    data () {
      return {
        action: this.$store.state.uploadAction,
        fromParams: {
          planTime: '',
          name: '',
          importantStatus: null,
          associationType: '',
          projectId: '',
          relatedWork: null,
          criterion: '',
          planStatus: '',
          hstoneWorkPlanRevices: [],
          hstoneFileEntityRelas: [],
          hstoneWorkPlanInfos: [

          ],
          token: getUser().token
        },
        searchParams: {
          page: 1,
          size: 10,
          total: 0,
        },
        addItemParams: {
          info: '',
          takeTime: '',
          // sortNum: '',
          infoStatus: ''
        },
        changePlansStatus: {
          hstoneWorkPlanInfos: '',
          infoStatus: '',
          token: getUser().token
        },
        addItemDialog: false,
        targerName: 'first',
        uploadType: "",
        checkedData: [],
        rules: {
          planTime: [
            { required: true, message: '请选择计划时间', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请填写计划名称', trigger: 'blur' }
          ],
          importantStatus: [
            { required: true, message: '请选择重要程度', trigger: 'blur' }
          ],
          associationType: [
            { required: true, message: '请选择关联类型', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '请选择关联项目', trigger: 'blur' }
          ],
          relatedWork: [
            { required: true, message: '请选择关联工作', trigger: 'blur' }
          ],
          criterion: [
            { required: true, message: '验收标准不能为空', trigger: 'blur' }
          ],
          hstoneWorkPlanRevices: [
            { required: true,type: 'array', message: '请选择计划接收人', trigger: 'blur' }
          ],
        },
        addItemRules: {
          info: [
            { required: true, message: '计划标题不能为空', trigger: 'blur' }
          ],
          takeTime: [
            { required: true, message: '事项耗时不能为空', trigger: 'blur' }
          ],
          // sortNum: [
          //   { required: true, message: '事项序号不能为空', trigger: 'blur' }
          // ],
          infoStatus: [
            { required: true, message: '请选择事项状态', trigger: 'blur' }
          ],
        },
        receivesData: [],
        videoFiles: [],
        tvFiles: [],
        attachmentFiles: [],
        token: getUser().token,
      }
    },
    computed: {
      fileType() {
        return META_FILE_TYPES[this.uploadType];
      },
      title () {
        return this.$route.name === 'addPlan' ? '创建计划' : this.$route.name === 'editPlan' ? '修改计划' : '查看计划详情'
      },
    },
    watch: {
      projectProp (val) {
        if (val) {
          this.setData(val)
        }
      }
    },
    created () {
      let vm = this
      if(vm.$route.name === 'editPlan'){
        vm.fetchDicts()
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
      async infoStatus(val) {
        let vm = this
        // vm.changePlansStatus.infoStatus = v
        if(vm.checkedData.length === 0){
          vm.$message.error('请勾选事项')
          return false
        }
        vm.changePlansStatus.hstoneWorkPlanInfos = []
        vm.checkedData.forEach(function (v) {
          vm.changePlansStatus.hstoneWorkPlanInfos.push({id: v.id, infoStatus: val})
        })
        const loading = vm.$loading({
          lock: true,
          text: '正在设置事项状态...'
        });
        try {
          await planStatus(vm.changePlansStatus)
          vm.$message.success('设置成功')
          vm.fetchDicts()
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
      addItem() {
        let vm = this
        vm.addItemParams = {
          info: '',
          takeTime: '',
          // sortNum: '',
          infoStatus: ''
        }
        vm.addItemDialog = true
      },
      async handleAdd (v) {
        let vm = this
        vm.loading = true
        if(v){
          vm.fromParams.planStatus = 0
        }else{
          vm.fromParams.planStatus = 1
        }
        const loading = vm.$loading({
          lock: true,
          text: '正在新增计划...'
        });
        vm.fromParams.hstoneFileEntityRelas = [];
        vm.attachmentFiles.forEach(function (v) {
          vm.fromParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: '06'
          })
        })
        try {
          vm.$refs['form'].validate().then( async() => { // 表单验证
            await planAdd(vm.fromParams)
            vm.$router.back()
            vm.$message.success('添加成功')
            vm.loading = false
          })
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
      selectDatas(receives) {
        let vm = this
        vm.receivesData = receives;
        vm.fromParams.hstoneWorkPlanRevices = []
        receives.forEach(key => {
          vm.fromParams.hstoneWorkPlanRevices.push({
            employeeId: key
          });
        });
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
      async fetchTableData() {
        let vm = this
        const loading = vm.$loading({
          lock: true,
          text: '正在查询...'
        });
        try {
          let data = await planPage(vm.searchParams)
          vm.fromParams.hstoneWorkPlanInfos = data.data
          vm.searchParams.total = data.total
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
      handleSelectionChange(v) {
        console.log(v)
        this.checkedData = v
      },
      delItem() {
        let vm = this
        if(vm.checkedData.length === 0){
          vm.$message.error('请勾选要删除的事项')
          return false
        }
        for(var i=vm.fromParams.hstoneWorkPlanInfos.length-1;i>=0;i--){
          let sortNum = vm.fromParams.hstoneWorkPlanInfos[i].sortNum
          vm.checkedData.forEach(function (key) {
            if(sortNum === key.sortNum){
              vm.fromParams.hstoneWorkPlanInfos.splice(i,1)
            }
          })
        }
      },
      showUploaders (type) {
        this.uploadType = type
        if (type === 'video') {
          this.$refs['uploaders'].show(this.videoFiles)
        }
        if (type === 'tvVideo') {
          this.$refs['uploaders'].show(this.tvFiles)
        }
        if (type === 'attachment') {
          this.$refs['uploaders'].show(this.attachmentFiles)
        }
      },
      async setData(data) {
        // 回显数据
      },
      async fetchDicts() {
        let vm = this
        const loading = vm.$loading({
          lock: true,
          text: '正在查询...'
        });
        try {
          let params = {
            id: vm.$route.params.id,
            token: getUser().token
          }
          vm.attachmentFiles = []
          let {data} = await planDetails(params)
          if (data.hstoneFileEntityRelas.length > 0) {
            data.hstoneFileEntityRelas.forEach(key => {
              vm.attachmentFiles.push({
                id: key.id,
                name: key.fileName,
                originalName: key.fileName,
                fileName: key.fileName,
                fileId: key.fileId,
                part: key.part,
                uniqueCode: key.fileCode
              })
            })
          }
          if(data.hstoneWorkPlanRevices.length>0){
            data.hstoneWorkPlanRevices.forEach(function (key){
              vm.receivesData.push(key.employeeId)
            })
          }

          vm.fromParams = {
            id: data.id,
            planTime: data.planTime,
            name: data.name,
            importantStatus: data.importantStatus.toString(),
            associationType: data.associationType,
            projectId: data.projectId?data.projectId:'',
            relatedWork: data.relatedWork?data.relatedWork.toString():'',
            criterion: data.criterion,
            planStatus: data.planStatus,
            hstoneWorkPlanRevices: data.hstoneWorkPlanRevices,
            hstoneFileEntityRelas: vm.attachmentFiles,
            hstoneWorkPlanInfos: data.hstoneWorkPlanInfos,
            token: getUser().token
          }
          vm.loading = false
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
      async handleEdit (v) {
        let vm = this
        vm.loading = true
        if(v){
          vm.fromParams.planStatus = 0
        }else{
          vm.fromParams.planStatus = 1
        }
        const loading = vm.$loading({
          lock: true,
          text: '正在修改计划...'
        });
        vm.fromParams.hstoneFileEntityRelas = [];
        vm.attachmentFiles.forEach(function (v) {
          vm.fromParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: '06'
          })
        })
        try {
          vm.$refs['form'].validate().then( async() => { // 表单验证
            vm.fromParams.hstoneWorkPlanRevices = []
            vm.receivesData.forEach(function (key) {
              vm.fromParams.hstoneWorkPlanRevices.push({
                employeeId: key
              });
            })
            await planEdit(vm.fromParams)
            vm.$router.back()
            vm.$message.success('修改成功')
          })
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
      saveItem() {
        let vm = this
        vm.fromParams.hstoneWorkPlanInfos.push(_.cloneDeep(vm.addItemParams))
        vm.fromParams.hstoneWorkPlanInfos.forEach(function (v,n) {
          v.sortNum = parseInt(n + 1)
        })
        vm.addItemDialog = false
      },
      async onUploadConfirms (v) {
        let vm = this
        if (vm.uploadType === 'video') {
          vm.videoFiles = v
        } else if (vm.uploadType === 'tvVideo') {
          vm.tvFiles = v
        } else{
          vm.attachmentFiles = v
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .id-match {
    margin-top: 30px;
    padding-left: 200px;

    &-label {
      margin-right: 12px;
    }
  }

  .warn {
    margin-bottom: 30px;
    text-align: center;
  }
  .myFromInfo{
    .x-pagination {
      padding-left: 0px;
    }
    .conBox {
      width: 1100px;margin: 40px auto;padding: 0px 30px 30px 0px;
      .header {
        border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;
      }
      .infoBox {
        width: 1000px;margin: 40px auto;padding: 30px 30px 0px 0px;
        .btns{
          margin-bottom: 16px;
        }
      }
    }
    .dz-dialog-footer {
      text-align: center;
    }
  }
</style>
<style>
  .myFromInfo .el-date-editor{
    width: 100%;
  }
  .myFromInfo .el-input-number{
    width: 100%;
  }
  .myFromInfo .el-select{
    width: 100%;
  }
  .myFromInfo .el-input-number .el-input__inner{
    text-align: left;
  }
</style>
