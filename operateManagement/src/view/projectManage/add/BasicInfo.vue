<template>
    <div class="myFromInfo">
        <el-form
            ref="form"
            :model="project.project_add_params"
            :rules="rules"
            label-width="140px"
            style="width: 70%;margin: 40px auto;padding: 30px 30px 30px 0px">
            <el-row style="padding-right: 20px">
                <el-col :span="12">
                    <el-form-item label="项目名称" prop="projectName">
                        <el-input v-model="project.project_add_params.projectName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目类型" prop="projectType">
                        <GetPlatformDict :dictType="'projectType'" :value="project.project_add_params.projectType"
                                         :snycModel.sync="project.project_add_params.projectType"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="负责人" prop="employeeId">
                        <memberSelect :snycModel.sync="project.project_add_params.employeeId"
                                      :value="project.project_add_params.employeeId" :disabled="true"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建时间" prop="settingTime">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="project.project_add_params.settingTime"
                            type="date"
                            placeholder="选择日期时间"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="交付时间" prop="deliveryTime">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="project.project_add_params.deliveryTime"
                            type="date"
                            placeholder="选择日期时间"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目资金">
                        <el-input-number v-model="project.project_add_params.projectFunding" controls-position="right"
                                         :min="0"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目状态" prop="projectStatus">
                        <GetPlatformDict :dictType="'projectStatus'" :value="project.project_add_params.projectStatus"
                                         :snycModel.sync="project.project_add_params.projectStatus"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属地区" prop="regionId">
                            <placeSelect @selectPlace="placeChange" :value="placeVal"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="项目附件:" label-width="145px">
                        <div class="form-uploader">
                            <div class="form-uploader-button" @click="showUploaders('attachment')">
                                <div><i class="form-uploader-icon el-icon-plus"/></div>
                                <div>上传</div>
                            </div>
                            <div class="form-uploader-result"
                                 v-if="project.project_add_params.hstoneFileEntityRelas.length > 0">
                                <div class="uploaded-number">
                                    {{project.project_add_params.hstoneFileEntityRelas.length}}个
                                </div>
                                <img class="img-cover" src="@/assets/word.jpeg" alt="">
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="progress-footer text-center">
            <el-button type="primary" @click="$router.back()">返回</el-button>
            <el-button type="primary" @click="editBasic" v-if="$route.name === 'projectEdit' && permButton('4112')">修改基础信息</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
        <Uploader
            ref="uploaders"
            :title="'附件上传'"
            target="meta"
            :limit="10"
            :token="token"
            :file-type="'0'"
            :handleBeforeRemove="handleBeforeRemove"
            :changeList="changeList"
            @confirm="onUploadConfirms"/>
    </div>
</template>

<script>
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { editAddFiles } from '@/api/common'
  import { getPlaceParent } from '@/api/common'
  import { mapState } from 'vuex'
  import _ from 'lodash'

  export default {
    name: 'BasicInfo',
    props: {
      projectProp: {
        default: null
      }
    },
    data () {
      return {
        action: this.$store.state.uploadAction,
        uploadType: "",
        changeList: [],
        rules: {
          projectName: [
            {required: true, message: '请填写项目名称', trigger: 'blur'}
          ],
          projectType: [
            {required: true, message: '项目状态不能为空', trigger: 'change'}
          ],
          employeeId: [
            {required: true, message: '请选择负责人', trigger: 'change'}
          ],
          settingTime: [
            {required: true, message: '创建时间不能为空', trigger: 'blur'}
          ],
          deliveryTime: [
              { required: true, message: '交付时间不能为空', trigger: 'blur' }
          ],
          projectStatus: [
              { required: true, message: '项目状态不能为空', trigger: 'change' }
          ],

        },
        videoFiles: [],
        placeVal:[],
        tvFiles: [],
        menuId: getNode().id,
          fromParams:{
              regionId:'',
          },
        token: getUser().token,
      }
    },
    computed: {
      fileType () {
        return META_FILE_TYPES[this.uploadType];
      },
      ...mapState([
        'project'
      ]),
    },
    watch: {
      projectProp (val) {
        if (val) {
          this.setData(val)
          this.getPlaceParent(val.regionId)
        }
      }
    },
    created () {
      let vm = this
      vm.project.project_add_params.employeeId = getUser().accountId;
      vm.fetchDicts()
    },
    methods: {
        // 选择地区查询
        async getPlaceParent(v){
            let params = {
                id: v,
                levelNum: 0,
                token: getUser().token
            }
            let { data } = await getPlaceParent(params)
            this.placeVal.push(data.parentsNameStr)
        },
        placeChange(v){
            let vm = this
            vm.project.project_add_params.regionId = v[v.length-1].value
        },
        permButton(v){
            let f = ''
            if(getPerm().indexOf(v) === -1){
                f = false
            }else {
                f = true
            }
            return f
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
          this.$refs['uploaders'].show(this.project.project_add_params.hstoneFileEntityRelas)
        }
      },
      async setData (data) {
        // 回显数据
      },
      fetchDicts () {
        // 初始化
      },
      editBasic () {
        let vm = this
        vm.$refs['form'].validate().then(() => { // 表单验证
          vm.$store.dispatch("project_editBasic_fn", vm);
        }, _.noop)
      },
      nextStep () {
        let vm = this
        vm.$refs['form'].validate().then(() => { // 表单验证
          vm.$emit('next')
        }, _.noop)
      },
      async onUploadConfirms (v) {
        let vm = this
        if (vm.uploadType === 'video') {
          vm.videoFiles = v
        } else if (vm.uploadType === 'tvVideo') {
          vm.tvFiles = v
        } else {
          vm.project.project_add_params.hstoneFileEntityRelas = v
        }
      },
      handleBeforeRemove (file, fileList) {
        var vm = this;
        vm.$confirm('确定要删除此附件吗？', '删除附件确认', {
          confirmButtonText: '确定',
          cancelButtonText: '我再看看',
          customClass: 'deleteContacts',
          closeOnClickModal: false
        }).then(() => {
          fileList.forEach(function (v, n) {
            if (file.id === v.id) {
              fileList.splice(n, 1);
              return false
            }
          });
          vm.changeList = fileList;
        }).catch(() => {
        });
        return false
      }
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
</style>
<style lang="scss">
    .myFromInfo .el-date-editor {
        width: 100%;
    }

    .myFromInfo .el-input-number {
        width: 100%;
    }

    .myFromInfo .el-input-number .el-input__inner {
        text-align: left;
    }

    .deleteContacts {
        .el-message-box__message {
            text-align: center;
            font-size: 18px;
        }

        .el-message-box__btns button:not(.el-button--primary) {
            float: right;
            margin-left: 10px;

            ~ button {
                margin-left: 0;
                border-color: #009688;
                background: #009688;
            }
        }
    }
</style>
