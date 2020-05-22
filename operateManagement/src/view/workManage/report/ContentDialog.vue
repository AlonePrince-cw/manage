<template>
    <el-dialog
        :visible.sync="visible"
        :title="title"
        width="1000px"
        @open="onOpen"
        :close-on-click-modal="false"
        class="myDialog">
        <el-form ref="addDialogFrom" :model="fromParams" :rules="rules" label-width="110px" style="padding: 0 10px;">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="日报时间：" prop="reportTime">
                        <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            v-model="fromParams.reportTime">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="重要程度：" prop="importantStatus">
                        <GetPlatformDict
                            :dictType="'importantStatus'"
                            :value="fromParams.importantStatus"
                            :snycModel.sync="fromParams.importantStatus"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工作事项：" prop="workTopic">
                        <el-input v-model="fromParams.workTopic" placeholder="请输入工作事项"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="耗时(h)：">
                        <el-input-number
                            v-model="fromParams.takeTime"
                            :precision="1"
                            :min="0.5"
                            :step="0.5"
                            controls-position="right"
                            :max="24">
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="关联方式：" prop="associationType">
                        <el-select v-model="fromParams.associationType">
                            <el-option label="关联工作" :value="1"></el-option>
                            <el-option label="关联项目" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="选择项目：" v-if="fromParams.associationType===0" prop="projectId">
                        <projectSelect
                            @selectData="selectData"
                            :value="fromParams.projectId"
                            :snycModel.sync="fromParams.projectId"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="选择工作：" v-if="fromParams.associationType===1" prop="reportComment">
                        <GetPlatformDict
                            :dictType="'relatedWork'"
                            :value="fromParams.relatedWork"
                            :snycModel.sync="fromParams.relatedWork"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="完成度：" prop="completionStatus">
                        <el-input-number
                            class="text-left"
                            v-model="fromParams.completionStatus"
                            :min="0"
                            :controls="false"
                            controls-position="right"
                            :max="100">
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="日报接收人：" prop="hstoneWorkDayReportRevices">
                        <membersSelect :value="receivesData" @selectData="selectDatas"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="工作描述：">
                        <el-input type="textarea" rows="4" v-model="fromParams.describle"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="存在问题：">
                        <el-input type="textarea" rows="4" v-model="fromParams.problem"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="解决办法：">
                        <el-input type="textarea" rows="4" v-model="fromParams.solve"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="所需帮助：">
                        <el-input type="textarea" rows="4" v-model="fromParams.help"></el-input>
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
            <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('510301')">确认创建
            </el-button>
            <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit'">保存修改
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
  import { reportAdd, reportEdit } from '@/api/report'
  import { getPlaceParent } from '@/api/common'
  import _ from 'lodash'

  const emptyForm = {
    reportTime: '',
    importantStatus: null,
    workTopic: '',
    associationType: 0,
    projectId: null,
    relatedWork: null,
    takeTime: '',
    completionStatus: '',
    describle: '',
    problem: '',
    solve: '',
    help: '',
    hstoneWorkDayReportRevices: [],
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
      },
      topicId: {
        type: String,
        default: ''
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
          reportTime: [
            {required: true, message: "日报时间不能为空", trigger: "blur"}
          ],
          workTopic: [
            {required: true, message: "工作事项不能为空", trigger: "blur"}
          ],
          associationType: [
            {required: true, message: "请选择关联方式", trigger: "blur"}
          ],
          projectId: [
            {required: true, message: "请选择关联项目", trigger: "blur"}
          ],
          relatedWork: [
            {required: true, message: "请选择工作类型", trigger: "blur"}
          ],
          hstoneWorkDayReportRevices: [
            {required: true, type: 'array', message: "请选择接收人", trigger: "blur"}
          ],
          completionStatus: [
            {required: true, message: "请输入完成度", trigger: "blur"}
          ],
          importantStatus: [
            {required: true, message: "请选择重要程度", trigger: "blur"}
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
        return this.dialogHandleType === 'add' ? '新增日报' : this.dialogHandleType === 'edit' ? '编辑日报' : '查看日报详情'
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
          reportTime: data.reportTime,
          importantStatus: data.importantStatus,
          workTopic: data.workTopic,
          associationType: data.associationType,
          projectId: data.projectId,
          relatedWork: data.relatedWork,
          takeTime: data.takeTime,
          completionStatus: data.completionStatus,
          describle: data.describle,
          problem: data.problem,
          solve: data.solve,
          help: data.help,
          hstoneWorkDayReportRevices: [],
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
          text: '正在新增日报...'
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
            console.log(vm.fromParams)
            await reportAdd(vm.fromParams)
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
          text: '正在修改主题...'
        });
        try {
          vm.$refs.addDialogFrom.validate().then(async () => { // 表单验证
            await reportEdit(vm.fromParams)
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
