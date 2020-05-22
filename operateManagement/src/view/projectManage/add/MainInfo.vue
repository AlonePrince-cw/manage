<template>
    <div class="myFromInfo">
        <el-form
            ref="form"
            :model="project.project_add_params"
            label-width="100px"
            style="width: 70%;margin: 40px auto;padding: 30px 30px 30px 0px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="项目资金说明:" label-width="145px" class="found"
                                  :prop="project.project_add_params.hstoneProjectRichEdits[0].content">
                        <template v-if="$route.name === 'projectEdit'">
                            <el-button type="primary" v-if="isEditData.module !== 1"
                                       @click="showEditor_found(project.project_add_params.hstoneProjectRichEdits[0])"
                                       size="small">编辑
                            </el-button>
                            <el-button type="primary" v-if="isEditData.module === 1 && permButton('4109')"
                                       @click="showEditor_save(project.project_add_params.hstoneProjectRichEdits[0])"
                                       size="small">保存
                            </el-button>
                            <el-button type="danger" v-if="isEditData.module === 1 && permButton('4109')"
                                       @click="showEditor_del(project.project_add_params.hstoneProjectRichEdits[0])"
                                       size="small">删除
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" @click="showEditor_found" size="small">添加</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label-width="65px" class="found"
                                  v-if="project.project_add_params.hstoneProjectRichEdits[0].content">
                        <div class="describe">
                            <div v-html="project.project_add_params.hstoneProjectRichEdits[0].content"></div>
                            <div class="describe-button" v-if="$route.name !== 'projectEdit' && !showEditorList.projectFundShow">
                                <el-button type="default" @click="showEditor_found" icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button type="default" @click="deleteEditorContent(0)" icon="el-icon-delete" size="small">删除</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="65px" class="hi" v-show="showEditorList.projectFundShow">
                        <vue-ueditor-wrap v-model="project.project_add_params.hstoneProjectRichEdits[0].content"
                                          :config="config"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="项目需要解决问题:" label-width="145px" class="found"
                                  :prop="project.project_add_params.hstoneProjectRichEdits[1].content">
                        <template v-if="$route.name === 'projectEdit'">
                            <el-button type="primary" v-if="isEditData.module !== 2"
                                       @click="showEditor_solve(project.project_add_params.hstoneProjectRichEdits[1])"
                                       size="small">编辑
                            </el-button>
                            <el-button type="primary" v-if="isEditData.module === 2 && permButton('4109')"
                                       @click="showEditor_save(project.project_add_params.hstoneProjectRichEdits[1])"
                                       size="small">保存
                            </el-button>
                            <el-button type="danger" v-if="isEditData.module === 2 && permButton('4109')"
                                       @click="showEditor_del(project.project_add_params.hstoneProjectRichEdits[1])"
                                       size="small">删除
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" @click="showEditor_solve" size="small">添加</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label-width="65px" class="found"
                                  v-if="project.project_add_params.hstoneProjectRichEdits[1].content">
                        <div class="describe">
                            <div v-html="project.project_add_params.hstoneProjectRichEdits[1].content"></div>
                            <div class="describe-button" v-if="$route.name !== 'projectEdit' && !showEditorList.solveShow">
                                <el-button type="default" @click="showEditor_solve" icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button type="default" @click="deleteEditorContent(1)" icon="el-icon-delete" size="small">删除</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="65px" class="hi" v-show="showEditorList.solveShow">
                        <vue-ueditor-wrap v-model="project.project_add_params.hstoneProjectRichEdits[1].content"
                                          :config="config"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="项目目标效果:" label-width="145px" class="found"
                                  :prop="project.project_add_params.hstoneProjectRichEdits[2].content">
                        <template v-if="$route.name === 'projectEdit'">
                            <el-button type="primary" v-if="isEditData.module !== 3"
                                       @click="showEditor_ami(project.project_add_params.hstoneProjectRichEdits[2])"
                                       size="small">编辑
                            </el-button>
                            <el-button type="primary" v-if="isEditData.module === 3 && permButton('4109')"
                                       @click="showEditor_save(project.project_add_params.hstoneProjectRichEdits[2])"
                                       size="small">保存
                            </el-button>
                            <el-button type="danger" v-if="isEditData.module === 3 && permButton('4109')"
                                       @click="showEditor_del(project.project_add_params.hstoneProjectRichEdits[2])"
                                       size="small">删除
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" @click="showEditor_ami" size="small">添加</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label-width="65px" class="found"
                                  v-if="project.project_add_params.hstoneProjectRichEdits[2].content">
                        <div class="describe">
                            <div v-html="project.project_add_params.hstoneProjectRichEdits[2].content"></div>
                            <div class="describe-button" v-if="$route.name !== 'projectEdit' && !showEditorList.amiShow">
                                <el-button type="default" @click="showEditor_ami" icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button type="default" @click="deleteEditorContent(2)" icon="el-icon-delete" size="small">删除</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="65px" class="hi" v-show="showEditorList.amiShow">
                        <vue-ueditor-wrap v-model="project.project_add_params.hstoneProjectRichEdits[2].content"
                                          :config="config"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="明确需求:" label-width="145px" class="found"
                                  :prop="project.project_add_params.hstoneProjectRichEdits[3].content">
                        <template v-if="$route.name === 'projectEdit'">
                            <el-button type="primary" v-if="isEditData.module !== 4"
                                       @click="showEditor_need(project.project_add_params.hstoneProjectRichEdits[3])"
                                       size="small">编辑
                            </el-button>
                            <el-button type="primary" v-if="isEditData.module === 4 && permButton('4109')"
                                       @click="showEditor_save(project.project_add_params.hstoneProjectRichEdits[3])"
                                       size="small">保存
                            </el-button>
                            <el-button type="danger" v-if="isEditData.module === 4 && permButton('4109')"
                                       @click="showEditor_del(project.project_add_params.hstoneProjectRichEdits[3])"
                                       size="small">删除
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" @click="showEditor_need" size="small">添加</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label-width="65px" class="found"
                                  v-if="project.project_add_params.hstoneProjectRichEdits[3].content">
                        <div class="describe">
                            <div v-html="project.project_add_params.hstoneProjectRichEdits[3].content"></div>
                            <div class="describe-button" v-if="$route.name !== 'projectEdit' && !showEditorList.needShow">
                                <el-button type="default" @click="showEditor_need" icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button type="default" @click="deleteEditorContent(3)" icon="el-icon-delete" size="small">删除</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="65px" class="hi" v-show="showEditorList.needShow">
                        <vue-ueditor-wrap v-model="project.project_add_params.hstoneProjectRichEdits[3].content"
                                          :config="config"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="项目说明:" label-width="145px" class="found"
                                  :prop="project.project_add_params.hstoneProjectRichEdits[4].content">
                        <template v-if="$route.name === 'projectEdit'">
                            <el-button type="primary" v-if="isEditData.module !== 5"
                                       @click="showEditor_explain(project.project_add_params.hstoneProjectRichEdits[4])"
                                       size="small">编辑
                            </el-button>
                            <el-button type="primary" v-if="isEditData.module === 5 && permButton('4109')"
                                       @click="showEditor_save(project.project_add_params.hstoneProjectRichEdits[4])"
                                       size="small">保存
                            </el-button>
                            <el-button type="danger" v-if="isEditData.module === 5 && permButton('4109')"
                                       @click="showEditor_del(project.project_add_params.hstoneProjectRichEdits[4])"
                                       size="small">删除
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" @click="showEditor_explain" size="small">添加</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label-width="65px" class="found"
                                  v-if="project.project_add_params.hstoneProjectRichEdits[4].content">
                        <div class="describe">
                            <div v-html="project.project_add_params.hstoneProjectRichEdits[4].content"></div>
                            <div class="describe-button" v-if="$route.name !== 'projectEdit' && !showEditorList.explainShow">
                                <el-button type="default" @click="showEditor_explain" icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button type="default" @click="deleteEditorContent(4)" icon="el-icon-delete" size="small">删除</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="65px" class="hi" v-show="showEditorList.explainShow">
                        <vue-ueditor-wrap v-model="project.project_add_params.hstoneProjectRichEdits[4].content"
                                          :config="config"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="推动基础:" label-width="145px" class="found" style="margin-bottom: 0px"
                                  :prop="project.project_add_params.hstoneProjectRichEdits[5].content">
                        <template v-if="$route.name === 'projectEdit'">
                            <el-button type="primary" v-if="isEditData.module !== 6"
                                       @click="showEditor_base(project.project_add_params.hstoneProjectRichEdits[5])"
                                       size="small">编辑
                            </el-button>
                            <el-button type="primary" v-if="isEditData.module === 6 && permButton('4109')"
                                       @click="showEditor_save(project.project_add_params.hstoneProjectRichEdits[5])"
                                       size="small">保存
                            </el-button>
                            <el-button type="danger" v-if="isEditData.module === 6 && permButton('4109')"
                                       @click="showEditor_del(project.project_add_params.hstoneProjectRichEdits[5])"
                                       size="small">删除
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" @click="showEditor_base" size="small">添加</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label-width="65px" class="found"
                                  v-if="project.project_add_params.hstoneProjectRichEdits[5].content"
                                  style="margin-bottom: 10px">
                        <div class="checked">
                            <el-checkbox-group v-model="checkedList">
                                <el-checkbox v-for="v in typesData" :label="v.value" :key="v.id">{{v.value}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="describe">
                            <div v-html="project.project_add_params.hstoneProjectRichEdits[5].content"></div>
                            <div class="describe-button" v-if="$route.name !== 'projectEdit' && !showEditorList.baseShow">
                                <el-button type="default" @click="showEditor_base" icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button type="default" @click="deleteEditorContent(5)" icon="el-icon-delete" size="small">删除</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="65px" class="hi" v-show="showEditorList.baseShow">
                        <vue-ueditor-wrap v-model="project.project_add_params.hstoneProjectRichEdits[5].content"
                                          :config="config"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="submit-bar text-center">
            <el-button type="primary" @click="$emit('prev')">上一步</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
    </div>
</template>


<script>
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { mapState } from 'vuex'
  import storeData from '@/store/state'
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
        isEditData: '',
        uploadType: "",
        imageFilesType: '',
        imageUrl: '',
        menuId: getNode().id,
        token: getUser().token,
        checkedList: [],
        typesData: [
          {value: '商务推动', id: '1'},
          {value: '模式推动', id: '2'},
          {value: '成本推动', id: '3'},
          {value: '产品和技术推动', id: '4'},
        ],
        showEditorList: {
          projectFundShow: false,
          solveShow: false,
          amiShow: false,
          needShow: false,
          baseShow: false,
          explainShow: false,
        },
        config: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 200,
          // 初始容器宽度
          initialFrameWidth: '100%',
          maximumWords: 2000,
            wordCount:true,          //是否开启字数统计
          // 上传文件配置接口
          serverUrl: storeData.BASE_API + storeData.uploadPrefix + `/api/home/getConfig`,
          serverFileUrl: `${ process.env.VUE_APP_BASE_API }/hstone/api/home/file/upload/`,// 自定义文件上传路径
          serverUrlPrefix: `${ process.env.VUE_APP_BASE_API }`, // 富文本文件访问前缀
          serverToken: getUser().token, // token参数
          // UEditor 资源文件的存放路径 打包部署前路径需要加上前缀
          UEDITOR_HOME_URL: storeData.myConfig.UEDITOR_HOME_URL
        },
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
        }
      }
    },
    created () {
      let vm = this
      console.log(vm.$store.state.BASE_API)

      let str = this.project.project_add_params.hstoneProjectRichEdits[5].types
      vm.fetchDicts()
      vm.checkedList = []
      vm.typesData.forEach(function (v) {
        if (str.indexOf(v.id) !== -1) {
          vm.checkedList.push(v.value)
        }
      })
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
      deleteEditorContent (index) {
        var vm = this;
        vm.project.project_add_params.hstoneProjectRichEdits[index].content = '';
      },
      showEditor_solve (v) {
        if (v) {
          this.isEditData = v
        }
        this.showEditor('solveShow')
      },
      showEditor_del (v) {
        let vm = this
        if (v) {
          this.isEditData = v
          v.content = ''
          vm.$store.dispatch('project_saveEditor_fn', vm)
        }
      },
      showEditor_ami (v) {
        if (v) {
          this.isEditData = v
        }
        this.showEditor('amiShow')
      },
      showEditor_need (v) {
        if (v) {
          this.isEditData = v
        }
        this.showEditor('needShow')
      },
      showEditor_base (v) {
        if (v) {
          this.isEditData = v
        }
        this.showEditor('baseShow')
      },
      showEditor_explain (v) {
        if (v) {
          this.isEditData = v
        }
        this.showEditor('explainShow')
      },
      showEditor_found (v) {
        if (v) {
          this.isEditData = v
        }
        this.showEditor('projectFundShow')
      },
      showEditor_save (v) {
        let vm = this
        vm.$store.dispatch('project_saveEditor_fn', vm)
      },
      showEditor (val) {
        let vm = this;
        for (let k in vm.showEditorList) {
          vm.showEditorList[k] = k === val;
        }
      },
      checkedChange (v) {
        console.log(v)
        console.log(this.checkedList)
      },
      async onSubmit () {
      },
      onUploadConfirm (v) {
        let vm = this
        vm.project.imageFilesList[vm.imageFilesType] = v
      },
      showUploader (type, v) {
        this.uploadType = type;
        this.imageFilesType = v
        this.$refs["uploader"].show(this.project.imageFilesList[this.imageFilesType]);
      },
      async setData (data) {
        // 回显数据
        console.log(data)
      },
      fetchDicts () {
        // 初始化
      },
      nextStep () {
        let vm = this
        let v = vm.project.project_add_params.hstoneProjectRichEdits
        // if (!v[0].content && v[0].module === 1) {
        //   vm.$message.warning('项目资金说明不能为空')
        //   return false
        // }
        // if (!v[1].content && v[1].module === 2) {
        //   vm.$message.warning('项目需要解决问题不能为空')
        //   return false
        // }
        // if (!v[2].content && v[2].module === 3) {
        //   vm.$message.warning('项目目标效果不能为空')
        //   return false
        // }
        // if (!v[3].content && v[3].module === 4) {
        //   vm.$message.warning('明确需求不能为空')
        //   return false
        // }
        // if (!v[4].content && v[4].module === 5) {
        //   vm.$message.warning('项目说明不能为空')
        //   return false
        // }
        // if (!v[5].content && v[5].module === 6) {
        //   vm.$message.warning('推动基础不能为空')
        //   return false
        // }
        // if (v[5].content && v[5].module === 6 && vm.checkedList.length === 0) {
        //   vm.$message.warning('请勾选推动基础类型')
        //   return false
        // }
        vm.$refs['form'].validate().then(() => { // 表单验证
          let arr = []
          vm.checkedList.forEach(function (v) {
            vm.typesData.forEach(function (val) {
              if (v === val.value) {
                arr.push(val.id)
              }
            })
          })
          vm.project.project_add_params.hstoneProjectRichEdits[5].types = arr.join(',')
          vm.$emit('next')
        }, _.noop)
      },
    }
  }
</script>

<style lang="scss" scoped>
    .checked {
        text-align: left;
    }

    .id-match {
        margin-top: 30px;
        padding-left: 200px;

        &-label {
            margin-right: 12px;
        }
    }

    .describe {
        position: relative;
        background: #E8E8E8;
        padding: 16px;
        text-align: left;
        .describe-button{
            position: absolute;
            top: 0;
            right: 0;
            line-height: 1;
        }
    }

    .warn {
        margin-bottom: 30px;
        text-align: center;
    }
</style>
<style lang="scss">
    .edui-upload-video {
        background: #000000;
    }

    .found {
        text-align: right;
    }

    .myFromInfo .el-date-editor {
        width: 100%;
    }

    .myFromInfo .el-input-number {
        width: 100%;
    }

    .hi .el-form-item__content {
        line-height: 1;
    }
</style>
