<template>
    <el-dialog
        :visible.sync="visible"
        :title="title"
        width="1000px"
        @open="onOpen"
        class="myDialog">
        <el-form ref="addDialogFrom" :model="formParams" :rules="rules" label-width="110px" style="padding: 0 10px;">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题：" prop="title">
                        <el-input v-model="formParams.title" placeholder="请输入标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="来源：" prop="organizationId">
                        <organizationSelect @selectChange="orgChange" :value="formParams.organizationId"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="时间：" prop="awardsPunishTime">
                        <el-date-picker
                            v-model="formParams.awardsPunishTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="时间"
                            range-separator="-"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="对象类型：" prop="awardsPunishType">
                        <el-radio v-model="formParams.awardsPunishType" @change="radioChange" label="0">组织</el-radio>
                        <el-radio v-model="formParams.awardsPunishType" @change="radioChange" label="1">人员</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="对象选择：" prop="awardsPunishId">
                        <memberSelect v-if="formParams.awardsPunishType === '1'" :snycModel.sync="formParams.awardsPunishId" :value="formParams.awardsPunishId"/>
                        <organizationSelect v-if="formParams.awardsPunishType === '0'" @selectChange="orgChanges" :value="formParams.awardsPunishId"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="原因：" prop="cause">
                        <el-input type="textarea" rows="4" v-model="formParams.cause"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="类容：" prop="causeInfo">
                        <el-input type="textarea" rows="4" v-model="formParams.causeInfo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="附件：">
                        <div class="form-uploader">
                            <div class="form-uploader-button" @click="showUploaders('attachment')">
                                <div>
                                    <i class="form-uploader-icon el-icon-plus"></i>
                                </div>
                                <div>上传</div>
                            </div>
                            <div class="form-uploader-result" v-if="attachmentFiles.length > 0">
                                <div class="uploaded-number">{{attachmentFiles.length}}个</div>
                                <img class="img-cover" src="@/assets/word.jpeg" alt/>
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row slot="footer" class="dz-dialog-footer">
            <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('11030101')">确认创建
            </el-button>
            <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit' && permButton('11030103')">保存修改
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
  import { rewardAdd, rewardEdit } from '@/api/rewardManage'
  import { getPlaceParent } from '@/api/common'
  import _ from 'lodash'

  const emptyForm = {
    type: 0,
    title: '',
    organizationId: '',
    awardsPunishTime: '',
    awardsPunishType: '0',
    awardsPunishId: '',
    cause: '',
    hstoneFileEntityRelas: [],
    causeInfo: '',
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
    },
    data () {
      return {
        formParams: _.clone(emptyForm),
        // pickerOptions: {
        //   disabledDate: time => {
        //     let timeOptionRange = new Date();
        //     let fourDays = 3600 * 1000 * 24 * 4;
        //     if (timeOptionRange) {
        //       // /*选择的日期 与 当前日期 小于3天*/
        //       let current = new Date(new Date().toLocaleDateString()) - timeOptionRange.getTime();
        //       return (time.getTime() > timeOptionRange.getTime() + (current < fourDays ? current : fourDays) ||
        //         time.getTime() < timeOptionRange.getTime() - fourDays)
        //     } else {
        //       return time.getTime() > Date.now();
        //     }
        //   }
        // },
        token: getUser().token,
        uploadType: '',
        rules: {
          title: [
            {required: true, message: "请填写标题", trigger: "blur"}
          ],
          organizationId: [
            {required: true, message: "请选择来源", trigger: "blur"}
          ],
          awardsPunishTime: [
            {required: true, message: "请选择奖励时间", trigger: "blur"}
          ],
          awardsPunishType: [
            {required: true, message: "请选择对象类型", trigger: "blur"}
          ],
          awardsPunishId: [
            {required: true, message: "请选择对象", trigger: "blur"}
          ],
          cause: [
            {required: true, message: "请输入原因", trigger: "blur"}
          ],
          causeInfo: [
            {required: true, message: "请输入类型", trigger: "blur"}
          ],
        },
        receivesData: [],
        videoFiles: [],
        tvFiles: [],
        attachmentFiles: []
      }
    },
    created () {
    },
    computed: {
      title () {
        return this.dialogHandleType === 'add' ? '新增奖励记录' : this.dialogHandleType === 'edit' ? '编辑奖励记录' : '查看奖励记录'
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
      radioChange() {
        this.formParams.awardsPunishId = null;
      },
      orgChange(v) {
        this.formParams.organizationId = v.id;
      },
      orgChanges(v) {
        this.formParams.awardsPunishId = v.id;
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
      onOpen () {
        let vm = this
        if (vm.dialogHandleType === 'add') {
          vm.attachmentFiles = []
          vm.formParams = Object.assign({}, emptyForm)
          vm.$nextTick(() => {
            vm.$refs['addDialogFrom'].clearValidate()
          })
        }
      },
      selectData (v) {
        this.formParams.projectId = v.id
      },
      async setFormDatas (data) {
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
      },
      handleAdd () {
        let vm = this
        vm.loading = true
        const loading = vm.$loading({
          lock: true,
          text: '正在新增奖励...'
        });
        vm.formParams.hstoneFileEntityRelas = [];
        vm.attachmentFiles.forEach(function (v) {
          vm.formParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: '06'
          })
        })
        vm.formParams.token = getUser().token
        try {
          vm.$refs.addDialogFrom.validate().then(async () => { // 表单验证
            await rewardAdd(vm.formParams)
            vm.$emit('success')
            vm.$message.success('添加成功')
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
        vm.loading = true;
        const loading = vm.$loading({
          lock: true,
          text: '正在修改奖励...'
        });
        vm.formParams.hstoneFileEntityRelas = [];
        vm.attachmentFiles.forEach(function (v) {
          vm.formParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: '06'
          })
        })
        vm.formParams.token = getUser().token
        try {
          vm.$refs.addDialogFrom.validate().then(async () => { // 表单验证
            await rewardEdit(vm.formParams)
            vm.$emit('success')
            vm.$message.success('修改成功')
            vm.loading = false
          })
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
    }
  }
</script>
<style>
    .text-left input{
        text-align: left!important;
    }
</style>
<style lang="scss" scoped>
    .myDialog {
        .el-dialog__body {
            padding-left: 0px;
        }

        .el-input-number {
            width: 100%;
        }

        .el-date-editor {
            width: 100%;
        }

        .el-select {
            width: 100%;
        }
    }

    .my-reply {
        padding: 10px;
        background-color: #fafbfc;

        .header-img {
            float: left;
            display: inline-block;
            vertical-align: top;
        }

        .reply-info {
            margin-left: 50px;
            position: relative;
            @media screen and (max-width: 700px) {
                width: 80%;
            }

            .reply-input {
                min-height: 20px;
                line-height: 22px;
                padding: 10px 10px;
                color: #ccc;
                background-color: #fff;
                border-radius: 5px;

                &:empty:before {
                    content: attr(placeholder)
                }

                &:focus:before {
                    content: none
                }

                &:focus {
                    padding: 8px 8px;
                    border: 2px solid blue;
                    box-shadow: none;
                    outline: none;
                }
            }
        }
    }

    .reply-btn-box {
        text-align: right;
        margin-top: 10px;

        .reply-btn {
            position: relative;
        }
    }

    .my-comment-reply {
        margin-left: 50px;

        .reply-input {
            width: flex;
        }
    }

    .author-title:not(:last-child) {
        border-bottom: 1px solid rgba(178, 186, 194, .3)
    }

    .author-title {
        padding: 10px;

        .icon-btn {
            padding: 0 !important;
            float: right;
            @media screen and (max-width: 1200px) {
                width: 20%;
                padding: 7px;
            }

            > span {
                cursor: pointer;
            }

            .iconfont {
                margin: 0 5px;
            }
        }

        .header-img {
            display: inline-block;
            vertical-align: top;
        }

        .author-info {
            display: inline-block;
            margin-left: 5px;
            width: 60%;
            height: 40px;
            line-height: 20px;

            > span {
                display: block;
                cursor: pointer;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .author-name {
                color: #000;
                font-size: 18px;
                font-weight: bold;
            }

            .author-time {
                font-size: 14px;
            }

            .talk-box {
                margin: 0 50px;

                > p {
                    margin: 0;
                }

                .reply {
                    font-size: 16px;
                    color: #000;
                }
            }

            .reply-box {
                margin: 10px 0 0 50px;
                background-color: #efefef;
            }
        }
    }
</style>
