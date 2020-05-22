<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @open="onOpen"
    class="myDialog">
    <el-form ref="addDialogFrom" :model="fromParams" :rules="rules" label-width="140px" style="padding: 0 10px;">
      <el-row>
        <el-col :span="24">
          <el-form-item label="主题标题:" prop="title">
            <el-input v-model="fromParams.title" placeholder="请输入主题标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内容类别:" prop="catgoryType">
            <GetPlatformDict  :dictType = "'catgoryType'" :disabled="dialogHandleType === 'check'" :value="fromParams.catgoryType" :snycModel.sync="fromParams.catgoryType"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重要程度:" prop="importantStatus">
            <GetPlatformDict  :dictType = "'importantStatus'" :disabled="dialogHandleType === 'check'" :value="fromParams.importantStatus" :snycModel.sync="fromParams.importantStatus"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联方式" prop="associationType">
            <el-select v-model="fromParams.associationType">
              <el-option label="关联工作" :value="1"></el-option>
              <el-option label="关联项目" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择项目" v-if="fromParams.associationType===0">
            <projectSelect
           
              :value="fromParams.projectId"
              :snycModel.sync="fromParams.projectId"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择工作" v-if="fromParams.associationType===1">
            <GetPlatformDict
              :dictType="'relatedWork'"
              :value="fromParams.relatedWork"
              :snycModel.sync="fromParams.relatedWork"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述:" prop="describle">
            <el-input type="textarea" rows="4" placeholder="请输入描述类容"
              v-model="fromParams.describle"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('3101')">确认创建</el-button>
      <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit' && permButton('3103')">保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { themeAdd, themeEdit } from '@/api/knowledge'
import { getPlaceParent } from '@/api/common'
import _ from 'lodash'
const emptyForm = {
    title: '',
    catgoryType: null,
    importantStatus: null,
    associationType: '',
    projectId: '',
    relatedWork: '',
    describle: '',
    token: '',
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
      token: getUser().token,
      rules: {
          title: [
            { required: true, message: '组织简称不能为空', trigger: 'blur' }
          ],
          catgoryType: [
              { required: true, message: '请选择内容类别', trigger: 'blur' }
          ],
          importantStatus: [
              { required: true, message: '请选择重要程度', trigger: 'blur' }
          ],
          associationType: [
              { required: true, message: '请选择关联方式', trigger: 'blur' }
          ],
          projectId: [
              { required: true, message: '请选择关联项目', trigger: 'blur' }
          ],
          relatedWork: [
              { required: true, message: '请选择关联工作', trigger: 'blur' }
          ],
          describle: [
              { required: true, message: '请输入描述内容', trigger: 'blur' }
          ],
      },
    }
  },
  created () {
  },
  computed: {
    title () {
      return this.dialogHandleType === 'add' ? '创建主题' : this.dialogHandleType === 'edit' ? '编辑主题内容' : '查看主题内容'
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
    onOpen () {
      if (this.dialogHandleType === 'add') {
        this.fromParams = Object.assign({}, emptyForm)
        this.placeVal = []
        this.$nextTick(() => {
          this.$refs['addDialogFrom'].clearValidate()
        })
      }
    },
    selectData(v){
      this.fromParams.projectId = v.id
    },
    async setFormDatas (data) {
      let vm = this
      vm.fromParams = {
        id: data.id,
        title: data.title,
        catgoryType: data.catgoryType.toString(),
        importantStatus: data.importantStatus.toString(),
        // associationType: data.associationType,
        associationType: data.associationType,
        projectId: data.projectId ? data.projectId :null,
        relatedWork: data.relatedWork,
        describle: data.describle,
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
      vm.fromParams.regionId = v[v.length-1].value
    },
    orgChange(v){
      let vm = this
      vm.fromParams.parentId = v.id;
    },
    handleAdd () {
      let vm = this
      vm.loading = true
      const loading = vm.$loading({
          lock: true,
          text: '正在创建主题...'
      });
      try {
        vm.fromParams.token = getUser().token
        vm.$refs.addDialogFrom.validate().then( async() => {
          await themeAdd(vm.fromParams)
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
      try {
        vm.fromParams.token = getUser().token
        vm.$refs.addDialogFrom.validate().then( async() => {
          await themeEdit(vm.fromParams)
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
