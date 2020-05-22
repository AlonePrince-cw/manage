<template>
  <el-dialog
    :visible.sync="visible"
    title="查看知识详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="840px">
    <el-row>
      <el-form ref="myForm" label-width="60px" style="padding: 0 10px;">
        <el-col :span="24">
          <el-form-item label="标题：">
            <div class="view-content">{{fromParams.title}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容：">
            <div v-html="fromParams.content" style="max-height: 300px;overflow: auto"></div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件：">
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
import { getUser } from '@/utils/auth'
import { knowledgeInfo } from '@/api/knowledge'
const emptyForm = {
    title: '',
    content: '',
    hstoneFileEntityRelas: [],
    token: getUser().token,
}
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      fromParams: _.clone(emptyForm),
      attachmentFiles: [],
      token: getUser().token,
    }
  },
  methods: {
    onOpen () {
      // this.getMenuTags()
    },
    async setFormDatas (data) {
      let vm = this
      vm.fromParams = {
        title: data.title,
        content: data.content,
        hstoneFileEntityRelas: [],
        token: getUser().token,
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
      let params = {
        id: data.id,
        token: getUser().token,
      }
      await knowledgeInfo(params)
      vm.$emit('success')
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
