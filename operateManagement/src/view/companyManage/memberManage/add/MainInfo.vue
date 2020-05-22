<template>
  <div class="myFromInfo">
    <el-form
            ref="form"
            :model="member.member_add_params"
            :rules="member.addRules"
            label-width="100px"
            style="width: 70%;margin: 40px auto;padding: 30px 30px 30px 0px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="入职时间:" prop="entryTime">
            <el-date-picker
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="member.member_add_params.entryTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离职时间:">
            <el-date-picker
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="member.member_add_params.resignationTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="就职状态:" prop="workStatus">
            <GetPlatformDict :dictType = "'workStatus'"  :value="member.member_add_params.workStatus" :snycModel.sync="member.member_add_params.workStatus"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时薪(元/h):" prop="salary">
            <el-input v-model="member.member_add_params.salary"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资描述:" prop="salaryDescription">
            <el-input v-model="member.member_add_params.salaryDescription"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作经历:" prop="workIntro">
            <el-input type="textarea" rows="4" v-model="member.member_add_params.workIntro"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="劳动合同:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles06')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles06.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles06.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles06[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="廉洁协议:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles07')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles07.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles07.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles07[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任状:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles08')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles08.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles08.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles08[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保密协议:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles09')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles09.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles09.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles09[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="竞业协议:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles10')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles10.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles10.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles10[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他协议:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles11')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles11.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles11.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles11[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <div class="submit-bar text-center">
      <el-button class="submit-button" type="primary" @click="onSubmit">完成提交</el-button>
      <el-button class="submit-button" type="primary" @click="$emit('prev')">返回修改</el-button>
    </div>
    <Uploader
      ref="uploader"
      :title="uploadType === 'image' ? '图片上传' :'视频上传'"
      target="meta"
      :token="token"
      @confirm="onUploadConfirm"
    ></Uploader>
  </div>
</template>

<script>
    import { getUser, getNode } from '@/utils/auth'
    import { editAddFiles } from '@/api/common'
    import { mapState } from 'vuex'
    import _ from 'lodash'

    export default {
        name: 'BasicInfo',
        props: {
            memberProp: {
                default: null
            }
        },
        data () {
            return {
                action: this.$store.state.uploadAction,
                uploadType: "",
                imageFilesType: '',
                imageUrl: '',
                menuId: getNode().id,
                token: getUser().token,
            }
        },
        computed: {
            fileType() {
                return META_FILE_TYPES[this.uploadType];
            },
            ...mapState([
                'member'
            ]),
        },
        watch: {
            memberProp (val) {
                if (val) {
                    this.setData(val)
                }
            }
        },
        created () {
            this.fetchDicts()
        },
        methods: {
            async onSubmit () {
                let vm = this
                let n = 1
                vm.member.member_add_params.hstoneFileEntityRelas = []
                for (let i in vm.member.imageFilesList) {
                    vm.member.imageFilesList[i].forEach(function (v) {
                        if (vm.$route.name === 'memberEdit') {
                            vm.member.member_add_params.hstoneFileEntityRelas.push(
                                {
                                    "bodyId": vm.$route.params.id,
                                    "fileId": v.id,
                                    "fileName": v.fileName,
                                    "part": n<10?'0'+n:n,
                                    "fileCode": v.uniqueCode
                                }
                            )
                        }else {
                            vm.member.member_add_params.hstoneFileEntityRelas.push(
                                {
                                    "fileId": v.id,
                                    "fileName": v.fileName,
                                    "part": n<10?'0'+n:n,
                                    "fileCode": v.uniqueCode
                                },
                            )
                        }
                    })
                    n++
                }
                vm.$refs['form'].validate().then(() => { // 表单验证
                    console.log(vm.$route.name)
                    if (vm.$route.name === 'memberAdd') {
                        vm.$store.dispatch('member_add_fn', vm)
                    } else {
                        vm.$store.dispatch('member_edit_fn', vm)
                    }
                }, _.noop)
            },
            async onUploadConfirm(v) {
                let vm = this
                vm.member.imageFilesList[this.imageFilesType] = v
            },
            showUploader(type,v) {
                this.uploadType = type;
                this.imageFilesType = v
                this.$refs["uploader"].show(this.member.imageFilesList[this.imageFilesType]);
            },
            async setData (data) {
                // 回显数据
            },
            fetchDicts () {
                // 初始化
            },
            nextStep () {
                this.$refs['form'].validate().then(() => { // 表单验证
                    this.$emit('next')
                }, _.noop)
            },
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
<style>
  .myFromInfo .el-date-editor{
    width: 100%;
  }
  .myFromInfo .el-input-number{
    width: 100%;
  }
</style>
