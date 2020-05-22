<template>
    <el-dialog
        :visible.sync="visible"
        :title="title"
        width="800px"
        @open="onOpen"
        :close-on-click-modal="dialogHandleType !== 'add' && dialogHandleType !== 'edit'"
        class="myDialog">
        <el-form ref="addDialogFrom" :model="fromParams" :rules="rules" label-width="70px" style="padding: 0 10px;">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题:" prop="title">
                        <el-input v-model="fromParams.title" placeholder="请输入主题标题"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="内容:" prop="content">
                        <vue-ueditor-wrap v-model="fromParams.content" :config="config"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="附件:" class="hi">
                        <div class="form-uploader">
                            <div class="form-uploader-button" @click="showUploaders('attachmentFiles')">
                                <div><i class="form-uploader-icon el-icon-plus"/></div>
                                <div>上传</div>
                            </div>
                            <div class="form-uploader-result" v-if="attachmentFiles.length > 0">
                                <div class="uploaded-number">{{attachmentFiles.length}}个</div>
                                <img class="img-cover" src="@/assets/word.jpeg" alt="">
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row slot="footer" class="dz-dialog-footer">
            <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('3107')">确认创建
            </el-button>
            <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit' && permButton('3108')">保存修改
            </el-button>
        </el-row>
        <Uploader
            ref="uploaders"
            :title="'附件上传'"
            target="meta"
            :limt="10"
            :token="token"
            :file-type="'0'"
            @confirm="onUploadConfirms"/>
    </el-dialog>
</template>

<script>
  import DialogMixin from '@/mixins/dialog'
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { knowledgeAdd, knowledgeEdit } from '@/api/knowledge'
  import { getPlaceParent } from '@/api/common'
  import storeData from '@/store/state'
  import _ from 'lodash'

  const emptyForm = {
    title: '',
    topicId: '',
    content: '',
    hstoneFileEntityRelas: [],
    token: getUser().token,
  }
  export default {
    mixins: [DialogMixin],
    props: {
      dialogHandleType: {
        type: String,
        default: 'add'
      },
      dialogType: {
        type: String,
        default: 'text'
      },
      topicId: {
        type: String,
        default: ''
      },
    },
    data () {
      return {
        fromParams: _.clone(emptyForm),
        token: getUser().token,
        uploadType: 'add',
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '内容不能为空', trigger: 'blur'}
          ],
        },
        config: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 200,
          // 初始容器宽度
          // 初始容器宽度
          initialFrameWidth: '100%',
          zIndex: 9999,
          elementPathEnabled: false,
          // 上传文件配置接口
          serverUrl: storeData.BASE_API + storeData.uploadPrefix + `/api/home/getConfig`,
          serverFileUrl: `${ process.env.VUE_APP_BASE_API }/hstone/api/home/file/upload/`,// 自定义文件上传路径
          serverUrlPrefix: `${ process.env.VUE_APP_BASE_API }`, // 富文本文件访问前缀
          serverToken: getUser().token, // token参数
          // UEditor 资源文件的存放路径 打包部署前路径需要加上前缀
          UEDITOR_HOME_URL:storeData.myConfig.UEDITOR_HOME_URL
        },
        videoFiles: [],
        tvFiles: [],
        attachmentFiles: []
      }
    },
    created () {
    },
    computed: {
      title () {
        return this.dialogHandleType === 'add' ? '创建知识点' : this.dialogHandleType === 'edit' ? '编辑知识点' : '查看知识详情'
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
      onUploadConfirms (v) {
        let vm = this
          if (vm.uploadType === 'video') {
            vm.videoFiles = v
          } else if (vm.uploadType === 'tvVideo') {
            vm.tvFiles = v
          } else {
          vm.attachmentFiles = v
        }
      },
      showUploaders (type) {
        this.uploadType = type;
        if (type === 'video') {
          this.$refs['uploaders'].show(this.videoFiles)
        }
        if (type === 'tvVideo') {
          this.$refs['uploaders'].show(this.tvFiles)
        }
        if (type === 'attachmentFiles') {
          this.$refs['uploaders'].show(this.attachmentFiles)
        }
      },
      onOpen () {
        if (this.dialogHandleType === 'add') {
          this.videoFiles = [];
          this.tvFiles = [];
          this.attachmentFiles = [];
          this.fromParams = Object.assign({}, emptyForm);
          this.$nextTick(() => {
            this.$refs['addDialogFrom'].clearValidate()
          })
        }
      },
      selectData (v) {
        this.fromParams.projectId = v.id
      },
      async setFormDatas (data) {
        let vm = this
        vm.fromParams = {
          title: data.title,
          id: data.id,
          content: data.content,
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
        console.log(vm.attachmentFiles)
      },
      handleAdd () {
        let vm = this
        vm.loading = true
        const loading = vm.$loading({
          lock: true,
          text: '正在创建知识点...'
        });
        vm.attachmentFiles.forEach(function (v) {
          vm.fromParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: '06'
          })
        })
        vm.fromParams.topicId = vm.topicId
        try {
          vm.fromParams.token = getUser().token
          vm.$refs.addDialogFrom.validate().then(async () => {
            await knowledgeAdd(vm.fromParams)
            vm.$emit('success')
            vm.$message.success('创建成功')
            vm.loading = false
          })
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
      handleEdit () {
        let vm = this
        vm.loading = true
        const loading = vm.$loading({
          lock: true,
          text: '正在修改主题...'
        });
        vm.attachmentFiles.forEach(function (v) {
          vm.fromParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: '06'
          })
        })
        try {
          vm.fromParams.token = getUser().token
          vm.$refs.addDialogFrom.validate().then(async () => {
            await knowledgeEdit(vm.fromParams)
            vm.$emit('success')
            vm.$message.success('修改成功')
            vm.loading = false
          })
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      }
    }
  }
</script>
<style lang="scss">
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
<style>
    .myDialog .el-form-item__content {
        line-height: 1;
    }
</style>
