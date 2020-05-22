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
          <el-form-item label="姓名:"  prop="name">
            <el-input v-model="member.member_add_params.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号:" prop="phone">
            <el-input v-model="member.member_add_params.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别:" prop="sex">
            <el-radio-group v-model="member.member_add_params.sex">
              <el-radio label="2">女</el-radio>
              <el-radio label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证:" prop="idCard">
            <el-input v-model="member.member_add_params.idCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毕业院校:" prop="university">
            <el-input v-model="member.member_add_params.university"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历:" prop="education">
            <GetPlatformDict :dictType = "'education'" :value="member.member_add_params.education" :snycModel.sync="member.member_add_params.education"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="QQ:" prop="qqCode">
            <el-input v-model="member.member_add_params.qqCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="婚姻状况:" prop="marryStatus">
            <GetPlatformDict :dictType = "'marryStatus'" :value="member.member_add_params.marryStatus" :snycModel.sync="member.member_add_params.marryStatus"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="民族:" prop="nationality">
            <GetPlatformDict :dictType = "'nationality'" :value="member.member_add_params.nationality" :snycModel.sync="member.member_add_params.nationality"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="政治面貌:" prop="politics">
            <GetPlatformDict :dictType = "'politics'" :value="member.member_add_params.politics" :snycModel.sync="member.member_add_params.politics"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="籍贯:" prop="hometown">
            <el-input v-model="member.member_add_params.hometown"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="居住地址:" prop="habitationAddress">
            <el-input v-model="member.member_add_params.habitationAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="家庭地址:" prop="homeAddress">
            <el-input v-model="member.member_add_params.homeAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="照片:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles01')" id="photo">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles01.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles01.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles01[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles02')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles02.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles02.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles02[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业证:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles03')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles03.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles03.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles03[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业证:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles04')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles04.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles04.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles04[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简历:">
              <div class="form-uploader">
                <div class="form-uploader-button" @click="showUploader('image','imageFiles05')">
                  <div>
                    <i class="form-uploader-icon el-icon-plus"></i>
                  </div>
                  <div>上传</div>
                </div>
                <div class="form-uploader-result" v-if="member.imageFilesList.imageFiles05.length > 0">
                  <div class="uploaded-number">{{member.imageFilesList.imageFiles05.length}}张</div>
                  <img class="img-cover" :src="member.imageFilesList.imageFiles05[0].uniqueCode | getFileUrl" alt />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <div class="progress-footer text-center">
      <el-button type="primary" @click="$router.back()">返回</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
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
      console.log(val)
      if (val) {
        this.setData(val)
      }
    }
  },
  created () {
    this.fetchDicts()
  },
  methods: {
      async onUploadConfirm(v) {
        let vm = this
        vm.member.imageFilesList[vm.imageFilesType] = v
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
