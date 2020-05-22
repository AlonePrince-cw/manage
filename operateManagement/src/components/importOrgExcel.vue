<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    width="30%">
      <div class="uploadContentt">
        <h4 style="color:red;">*请按标准的Excel表填写规范的信息，否则导入会有异常！！！</h4>
        <a :href="templateId | getFileUrl" v-if="templateId">下载：标准的Excel表</a>
        <a v-else>没有标准模板</a>
        <el-upload
          class="upload-demo"
          :action="action + uploadPrefix + uploadPath"
          :data="{token}"
          :limit = '1'
          ref="upload"
          name="excelFile"
          :file-list="fileList"
          :on-success="uploadOnSuccess"
          :on-error="uploadOnError"
          :on-remove="handleRemove"
          :auto-upload="false"
          accept = ".xls,.xlsx">
          <el-button size="small" type="primary">点击导入</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="define">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { getUser, getNode } from '@/utils/auth'
import { Message } from 'element-ui'
import storeData from '@/store/state'
export default {
  name: 'RegionidSelect',
  props: {
    title: {
      type: String,
      default: '请传标题'
    },
    templateId: {
      type: String,
      default: ''
    },
    uploadPath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: false,
      fileData: '',
      fileList: [],
      token: getUser().token,
      action: storeData.BASE_API,
      uploadPrefix: storeData.uploadPrefix,
    }
  },
  created () {
  },
  methods: {
    uploadOnSuccess (data) {
      let vm = this
      if (data.code === 0) {
        Message({
          message: data.msg,
          type: 'success',
          duration: 5 * 1000
        })
        vm.isShow = false
        vm.$emit('success')
        return false
      } else {
        Message({
          message: data.msg,
          type: 'error',
          duration: 5 * 1000
        })
        vm.isShow = false
        return false
      }
    },
    uploadOnError (data) {
      console.log(data)
    },
    handleChange (file, fileList) {
      console.log(file, fileList)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    show () {
      this.fileList = []
      this.isShow = true
    },
    define () {
      this.$refs.upload.submit()
    }
  }
}
</script>
<style scoped>
  .uploadContentt{text-align: center;}
  .uploadContentt a{color: #409eff;display: inline-block;width: 100%;margin: 20px 0px}
</style>
