<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @open="onOpen"
    class="myDialog">
    <el-form ref="addDialogFrom" :model="formParams" :rules="rules" label-width="110px" style="padding: 0 10px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户姓名:" prop="name">
            <el-input v-model="formParams.name" placeholder="请输入客户姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户电话:" prop="telephone">
            <el-input v-model="formParams.telephone" placeholder="请输入客户电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位名称:" prop="company">
            <el-input v-model="formParams.company" placeholder="请输入单位名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在地区:" prop="regionId">
            <placeSelect @selectPlace="placeChange" :value="placeVal"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务:" prop="duty">
            <el-input v-model="formParams.duty" placeholder="请输入职务"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别:" prop="sex">
            <el-radio v-model="formParams.sex" :label="1">男</el-radio>
            <el-radio v-model="formParams.sex" :label="2">女</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="照片:" >
            <div class="form-uploader">
              <div class="form-uploader-button" @click="showUploaders('attachment')">
                <div><i class="form-uploader-icon el-icon-plus"></i></div>
                <div>上传</div>
              </div>
              <div class="form-uploader-result" v-if="imageFiles.length > 0">
                <div class="uploaded-number">{{imageFiles.length}}张</div>
                <img class="img-cover" :src="imageFiles[0].uniqueCode | getFileUrl" alt />
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="客户描述:" prop="customerDescribe">
            <el-input type="textarea" rows="4" placeholder="请输入客户描述" v-model="formParams.customerDescribe"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add'">确认创建</el-button>
      <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit'">保存修改</el-button>
    </el-row>
    <Uploader
      ref="uploaders"
      :title="'图片上传'"
      target="meta"
      :limt="10"
      :token="token"
      :file-type="'01'"
      @confirm="onUploadConfirms" />
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser } from '@/utils/auth'
import { addCustomer, editCustomer } from '@/api/customerMailList'
import { getPlaceParent } from '@/api/common'
import _ from 'lodash'
const emptyForm = {
  name: '',
  telephone: null,
  company: '',
  duty: '',
  regionId: '',
  sex: 1,
  hstoneFileEntityRelas: [],
  customerDescribe: '',
}
const checkTel = (rule, value, callback) => {
  var reg = /^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
  if (value) {
    if (!reg.test(value)) {
      rule.message = '请输入正确的手机号'
      callback(new Error('请输入正确的手机号'))
    }
    setTimeout(() => {
      callback()
    }, 1000)
  }
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
      formParams: _.clone(emptyForm),
      token: getUser().token,
      placeVal: [],
      imageFiles: [],
      rules: {
        name: [
          { required: true, message: '客户姓名不能为空', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '客户电话不能为空', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ],
        company: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        duty: [
          { required: true, message: '职务不能为空', trigger: 'blur' }
        ],
        regionId: [
          { required: true, message: '请选择所在地区', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        customerDescribe: [
          { required: true, message: '请输入客户描述', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
  },
  computed: {
    title () {
      return this.dialogHandleType === 'add' ? '创建客户' : this.dialogHandleType === 'edit' ? '编辑客户信息' : '查看客户详情'
    }
  },
  methods: {
    async onUploadConfirms (v) {
      let vm = this
      if (vm.uploadType === 'video') {
        vm.videoFiles = v
      } else if (vm.uploadType === 'tvVideo') {
        vm.tvFiles = v
      } else{
        vm.imageFiles = v
      }
    },
    showUploaders (type) {
      this.uploadType = type
      this.$refs['uploaders'].show(this.imageFiles)
    },
    onOpen () {
      let vm = this
      if (vm.dialogHandleType === 'add') {
        vm.formParams = Object.assign({}, emptyForm)
        vm.placeVal = []
        vm.$nextTick(() => {
          vm.$refs['addDialogFrom'].clearValidate()
        })
      }
    },
    async setFormDatas (data) {
      let vm = this
      vm.placeVal = []
      vm.imageFiles = []
      vm.getPlaceParent(data.regionId)
      vm.formParams = {
        id: data.id,
        name: data.name,
        telephone: data.telephone,
        company: data.company,
        duty: data.duty,
        regionId: data.regionId,
        sex: data.sex,
        hstoneFileEntityRelas: [],
        customerDescribe: data.customerDescribe,
      }
      if (data.hstoneFileEntityRelas.length > 0) {
        data.hstoneFileEntityRelas.forEach(key => {
          vm.imageFiles.push({
            id: key.id,
            name: key.fileName,
            originalName: key.fileName,
            fileName: key.fileName,
            fileId: key.fileId,
            part: key.part,
            uniqueCode: key.fileCode
          })
        })
      }
    },
    async getPlaceParent(v){
      let params = {
          id: v,
          levelNum: 0,
          token: getUser().token
      }
      let { data } = await getPlaceParent(params)
        this.placeVal.push(data.parentsNameStr)
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.formParams.regionId = v[v.length-1].value
    },
    orgChange(v){
      let vm = this
      vm.formParams.parentId = v.id;
    },
    handleAdd() {
      let vm = this
      vm.formParams.token = getUser().token;
      vm.imageFiles.forEach(function (v) {
        vm.formParams.hstoneFileEntityRelas.push({
          fileCode: v.uniqueCode,
          fileId: v.id,
          fileName: v.originalName,
          part: '06'
        })
      })
      const loading = vm.$loading({
        lock: true,
        text: '正在添加客户...'
      });
      try {
        vm.$refs.addDialogFrom.validate().then( async() => {
          await addCustomer(vm.formParams)
          vm.$message.success('添加成功')
          vm.$emit('success')
        })
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    handleEdit() {
      let vm = this
      vm.formParams.token = getUser().token;
      vm.imageFiles.forEach(function (v) {
        vm.formParams.hstoneFileEntityRelas.push({
          fileCode: v.uniqueCode,
          fileId: v.id,
          fileName: v.originalName,
          part: '06'
        })
      })
      const loading = vm.$loading({
        lock: true,
        text: '正在修改客户信息...'
      });
      try {
        vm.$refs.addDialogFrom.validate().then( async() => {
          await editCustomer(vm.formParams)
          loading.close()
          vm.$message.success('修改成功')
          vm.$emit('success')
        })
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        // loading.close()
      }
    }
  }
}
</script>
<style lang="scss">
  .myDialog {
    .el-dialog__body{
      padding-left: 0px;
    }
    .el-input-number{
      width: 100%;
      .el-input__inner{
        text-align: left;
      }
    }
    .el-date-editor{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
  }
</style>
