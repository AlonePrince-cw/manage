<template>
    <el-dialog
        :visible.sync="visible"
        :title="title"
        width="1000px"
        @open="onOpen"
        :close-on-click-modal="false"
        class="myDialog">
        <el-form ref="addDialogFrom" :model="fromParams" :rules="rules" label-width="140px" style="padding: 0 30px 0px 0px;">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="合同名称:" prop="name">
                        <el-input v-model="fromParams.name" placeholder="请输入合同名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="签订对象:" prop="customerId">
                        <memberSelect :snycModel.sync="fromParams.customerId" :value="fromParams.customerId"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="负责人:" prop="employeeId">
                        <memberSelect :snycModel.sync="fromParams.employeeId" :value="fromParams.employeeId"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="选择项目:" prop="projectId">
                        <projectSelect
                            @selectData="selectData"
                            :value="fromParams.projectId"
                            :snycModel.sync="fromParams.projectId"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同状态:" prop="contractStatus">
                        <GetPlatformDict
                            :dictType="'contractStatus'"
                            :value="fromParams.contractStatus"
                            :snycModel.sync="fromParams.contractStatus"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="签订时间:" prop="signTime">
                        <el-date-picker
                            v-model="fromParams.signTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="开始时间"
                            range-separator="-"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="到期时间:" prop="expireTime">
                        <el-date-picker
                            v-model="fromParams.expireTime"
                            value-format="yyyy-MM-dd"
                            placeholder="开始时间"
                            type="date"
                            range-separator="-"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款时间:" prop="receivablesTime">
                        <el-date-picker
                            v-model="fromParams.receivablesTime"
                            value-format="yyyy-MM-dd"
                            placeholder="开始时间"
                            type="date"
                            range-separator="-"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="附件:">
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
            <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('8101')">确认创建
            </el-button>
            <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit' && permButton('8103')">保存修改
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
  import { contractAdd, contractEdit } from "@/api/contract";
  import { getPlaceParent } from '@/api/common'
  import _ from 'lodash'

  const emptyForm = {
    name: '',
    customerId: '',
    employeeId: '',
    projectId: '',
    contractStatus: null,
    signTime: '',
    expireTime: '',
    receivablesTime: '',
    hstoneFileEntityRelas: [],
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
      }
    },
    data () {
      return {
        fromParams: _.clone(emptyForm),
        pickerOptions: {
          disabledDate: time => {
            let timeOptionRange = new Date();
            let fourDays = 3600 * 1000 * 24 * 4;
            if (timeOptionRange) {
              // /*选择的日期 与 当前日期 小于3天*/
              let current = new Date(new Date().toLocaleDateString()) - timeOptionRange.getTime();
              return (time.getTime() > timeOptionRange.getTime() + (current < fourDays ? current : fourDays) ||
                time.getTime() < timeOptionRange.getTime() - fourDays)
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        token: getUser().token,
        uploadType: '',
        rules: {
          name: [
            {required: true, message: "合同名称不能为空", trigger: "blur"}
          ],
          customerId: [
            {required: true, message: "请选择签订对象", trigger: "blur"}
          ],
          employeeId: [
            {required: true, message: "请选择负责人", trigger: "blur"}
          ],
          projectId: [
            {required: true, message: "请选择关联项目", trigger: "blur"}
          ],
          contractStatus: [
            {required: true, message: "请选择合同状态", trigger: "blur"}
          ],
          signTime: [
            {required: true, message: "请选择签订时间", trigger: "blur"}
          ],
          expireTime: [
            {required: true, message: "请选择到期时间", trigger: "blur"}
          ],
          receivablesTime: [
            {required: true, message: "请选择收款时间", trigger: "blur"}
          ]
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
        return this.dialogHandleType === 'add' ? '新增合同' : this.dialogHandleType === 'edit' ? '编辑合同' : '查看合同详情'
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
        vm.attachmentFiles = []
        vm.receivesData = []
        if (vm.dialogHandleType === 'add') {
          vm.fromParams = Object.assign({}, emptyForm)
          vm.$nextTick(() => {
            vm.$refs['addDialogFrom'].clearValidate()
          })
        }
      },
      selectData (v) {
        this.fromParams.projectId = v.id
      },
      selectDatas (receives) {
        let vm = this
        vm.receivesData = receives;
        vm.fromParams.hstoneWorkDayReportRevices = []
        receives.forEach(key => {
          vm.fromParams.hstoneWorkDayReportRevices.push({
            employeeId: key
          });
        });
      },
      async setFormDatas (data) {
        let vm = this
        vm.fromParams = {
          id: data.id,
          name: data.name,
          customerId: data.customerId,
          employeeId: data.employeeId,
          projectId: data.projectId,
          contractStatus: data.contractStatus.toString(),
          signTime: data.signTime,
          expireTime: data.expireTime,
          receivablesTime: data.receivablesTime,
          hstoneFileEntityRelas: data.hstoneFileEntityRelas,
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
          text: '正在新增合同...'
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
        vm.fromParams.completionStatus = vm.fromParams.completionStatus + (/%$/.test(vm.fromParams.completionStatus) ? '' : '%');
        vm.fromParams.token = getUser().token
        try {
          vm.$refs.addDialogFrom.validate().then(async () => { // 表单验证
            await contractAdd(vm.fromParams)
              console.log(vm.fromParams)
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
        vm.fromParams.token = getUser().token
        const loading = vm.$loading({
          lock: true,
          text: '正在修改合同...'
        });
        try {
          vm.$refs.addDialogFrom.validate().then(async () => { // 表单验证
            await contractEdit(vm.fromParams)
              console.log(vm.fromParams)
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
