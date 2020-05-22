<template>
  <el-dialog
    :visible.sync="visible"
    title="计划详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="1040px">
    <el-row>
      <el-form ref="myForm" label-width="140px" style="padding: 0 10px;">
        <el-row class="conBox">
          <el-col :span="24" class="header">
            <span>基本信息</span>
          </el-col>
          <el-row class="infoBox">
            <el-col :span="12">
              <el-form-item label="计划时间" prop="planTime">
                <div class="view-content">{{fromParams.planTime}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划名称" prop="name">
                <div class="view-content">{{fromParams.name}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重要程度" prop="importantStatus">
                <div class="view-content">{{fromParams.importantStatus | dict('importantStatus')}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联方式" prop="associationType">
                <div class="view-content">
                  <span v-if="fromParams.associationType === 1">关联工作</span>
                  <span v-if="fromParams.associationType === 0">关联项目</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择项目" v-if="fromParams.associationType===0" prop="projectId">
                <div class="view-content">
                  {{fromParams.projectId}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择工作" v-if="fromParams.associationType===1" prop="relatedWork">
                <div class="view-content">
                  {{fromParams.relatedWork | dict('relatedWork')}}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24" class="header">
            <span>计划事项</span>
          </el-col>
          <el-row class="infoBox">
            <el-table border :data="fromParams.hstoneWorkPlanInfos">
              <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>
              <el-table-column label="内容标题" :show-overflow-tooltip="true" width="180px" prop="info" align="center"></el-table-column>
              <el-table-column label="耗时" :show-overflow-tooltip="true" prop="takeTime" align="center"></el-table-column>
              <el-table-column label="状态" :show-overflow-tooltip="true" prop="infoStatus" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.infoStatus === '100' || scope.row.infoStatus === 100">正常</el-tag>
                  <el-tag type="success" v-if="scope.row.infoStatus === '102' || scope.row.infoStatus === 102">完成</el-tag>
                  <el-tag type="danger" v-if="scope.row.infoStatus === '101' || scope.row.infoStatus === 101">终止</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-col :span="24" class="header">
            <span>其他信息</span>
          </el-col>
          <el-row class="infoBox">
            <el-col :span="24">
              <el-form-item label="验收标准:" label-width="145px" prop="criterion">
                <div class="view-content">
                  {{fromParams.criterion}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目附件:">
                <v-doc-list :list="attachmentFiles"></v-doc-list>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="计划接收人：" class="planResevied" prop="hstoneWorkPlanRevices">
                <membersSelect :value="receivesData" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-row>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" @click="visible = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser, getDict } from '@/utils/auth'
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      action: this.$store.state.uploadAction,
      fromParams: {
        planTime: '',
        name: '',
        importantStatus: null,
        associationType: '',
        projectId: '',
        relatedWork: '',
        criterion: '',
        planStatus: '',
        hstoneWorkPlanRevices: [],
        hstoneFileEntityRelas: [],
        hstoneWorkPlanInfos: [],
      },
      attachmentFiles: [],
      receivesData: [],
      activeName: 'first',
      token: getUser().token,
    }
  },
  created() {},
  methods: {
    onOpen () {
    },
    async setFormDatas (data) {
      let vm = this
      vm.attachmentFiles = []
      vm.receivesData = []
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
        projectId: data.projectId?data.project.projectName:'',
        relatedWork: data.relatedWork?data.relatedWork.toString():'',
        criterion: data.criterion,
        planStatus: data.planStatus,
        hstoneWorkPlanRevices: data.hstoneWorkPlanRevices,
        hstoneFileEntityRelas: vm.attachmentFiles,
        hstoneWorkPlanInfos: data.hstoneWorkPlanInfos,
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .detail-wrap {
    font-size: 16px;
    padding-left: 30px;
  }
  .view-content{
    min-height: 40px;
    word-break:break-all
  }
  .detail-item {
    line-height: 40px;

    &__label {
      color: #666;
    }

    &__value {
      color: #333;
    }
  }
  .personList{
    width: 300px;
    height: 140px;
    display: inline-block;
    position: relative;
    margin-right: 20px;
    .delPeople{
      display: inline-block;
      position: absolute;
      right: 16px;
      top: 16px;
      height: 20px;
      width: 20px;
      border-radius: 20px;
      margin: 0;
      padding: 0;
    }
    p{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .el-card{
      height: 140px;
    }
  }
  .addUser {
    font-size: 45px;
    text-align: center;
    height: 140px;
    line-height: 100px;
  }
  .conBox {
    width: 100%;margin: 0px auto;padding: 0px 30px 30px 0px;
    .header {
      border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;
    }
    .infoBox {
      width: 90%;margin: 40px auto;padding: 30px 30px 0px 0px;
      .btns{
        margin-bottom: 16px;
      }
    }
  }
</style>
