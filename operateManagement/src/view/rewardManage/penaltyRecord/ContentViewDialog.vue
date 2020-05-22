<template>
  <el-dialog
      :visible.sync="visible"
      title="查看组织详情"
      :append-to-body="true"
      @open="onOpen"
      :modal-append-to-body="true"
      width="840px">
    <el-row>
      <el-form ref="myForm" label-width="100px" style="padding: 0 10px;">
        <el-col :span="24">
          <el-form-item label="标题：">
            <div class="view-content">{{formParams.title}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源：">
            <div class="view-content">{{formParams.fullName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间：">
            <div class="view-content">{{formParams.awardsPunishTime}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对象类型：">
            <div class="view-content">
              <span v-if="formParams.awardsPunishType === '0'">组织</span>
              <span v-if="formParams.awardsPunishType === '1'">人员</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="奖励对象：">
            <div class="view-content">
              <span v-if="formParams.awardsPunishType === '0'">{{formParams.organizationName}}</span>
              <span v-if="formParams.awardsPunishType === '1'">{{formParams.merberName}}</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="原因：">
            <div class="view-content">{{formParams.cause}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容：">
            <div class="view-content">{{formParams.causeInfo}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件：" v-if="attachmentFiles.length>0">
            <v-doc-list :list="attachmentFiles"></v-doc-list>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" @click="visible = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  import DialogMixin from '@/mixins/dialog'
  import { getPlaceParent } from '@/api/common'
  import { getUser } from '@/utils/auth'
  const emptyForm = {
    type: 0,
    title: '',
    organizationId: '',
    awardsPunishTime: '',
    awardsPunishType: '0',
    awardsPunishId: '',
    fullName: '',
    cause: '',
    hstoneFileEntityRelas: [],
    causeInfo: '',
  }
  export default {
    name: 'ContentViewDialog',
    mixins: [DialogMixin],
    data () {
      return {
        receivesData: [],
        videoFiles: [],
        tvFiles: [],
        attachmentFiles: [],
        formParams: _.clone(emptyForm),
        token: getUser().token,
      }
    },
    methods: {
      onOpen () {
        // this.getMenuTags()
      },
      setFormDatas (data) {
        let vm = this
        vm.formParams = {
          id: data.id,
          type: data.type,
          title: data.title,
          organizationId: data.organizationId,
          awardsPunishTime: data.awardsPunishTime,
          awardsPunishType: data.awardsPunishType.toString(),
          awardsPunishId: data.awardsPunishId,
          cause: data.cause,
          causeInfo: data.causeInfo,
          fullName: data.source.fullName,
          organizationName: data.organization?data.organization.fullName: '',
          merberName: data.employee?data.employee.name:'',
          hstoneFileEntityRelas: [],
        }
        vm.attachmentFiles = []
        data.hstoneFileEntityRelas.forEach(function (key) {
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
</style>
