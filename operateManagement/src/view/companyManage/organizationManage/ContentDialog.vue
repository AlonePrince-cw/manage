<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @open="onOpen"
    class="myDialog">
    <el-form ref="addDialogFrom" :model="fromParams" :rules="rules" label-width="140px" style="padding: 0 10px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织简称:" prop="name">
            <el-input v-model="fromParams.name" placeholder="请输入组织简称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织全称:" prop="fullName">
            <el-input v-model="fromParams.fullName" placeholder="请输入组织全称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织所在地:" prop="regionId">
            <placeSelect @selectPlace="placeChange" :value="placeVal"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属组织:">
            <organizationSelect @selectChange="orgChange" :value="fromParams.parentId"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织类型:" prop="type">
            <GetPlatformDict  :dictType = "'organizationType'" :disabled="dialogHandleType === 'check'" :value="fromParams.type" :snycModel.sync="fromParams.type"></GetPlatformDict>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="简介:">
            <el-input type="textarea" rows="4" placeholder="请输入简介"
              v-model="fromParams.intro"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('110101')">确认创建</el-button>
      <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit' && permButton('110103')">保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { organizationAdd, organizationEdit } from '@/api/organization'
import { getPlaceParent } from '@/api/common'
import _ from 'lodash'
const emptyForm = {
  name: '',
  parentId: null,
  type: null,
  regionId: '',
  intro: '',
  fullName: '',
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
    }
  },
  data () {
    return {
      fromParams: _.clone(emptyForm),
      token: getUser().token,
      menuNode: null,
      placeVal: [],
      rules: {
        name: [
          { required: true, message: '组织简称不能为空', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '组织全称不能为空', trigger: 'blur' }
        ],
        regionId: [
          { required: true, message: '组织所属地区不能为空', trigger: 'blur' }
        ],
        type: [
            { required: true, message: '组织类型不能为空', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
  },
  computed: {
    title () {
      return this.dialogHandleType === 'add' ? '创建组织' : this.dialogHandleType === 'edit' ? '编辑组织' : '查看组织详情'
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
    async setFormDatas (data) {
      let vm = this
      vm.placeVal = []
      vm.getPlaceParent(data.hstoneRegion.id)
      vm.fromParams = {
        id: data.id,
        name: data.name,
        parentId: data.hstoneOrganization?data.hstoneOrganization.id:'',
        type: data.type.toString(),
        regionId: data.hstoneRegion.id,
        intro: data.intro,
        fullName: data.fullName,
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
      console.log(v)
      vm.fromParams.regionId = v[v.length-1].value
    },
    orgChange(v){
      let vm = this
      vm.fromParams.parentId = v.id;
    },
    handleAdd () {
      let vm = this
      vm.loading = true
      vm.fromParams.token = getUser().token
      vm.$refs.addDialogFrom.validate().then( async() => {
        await organizationAdd(vm.fromParams)
        vm.$emit('success')
        vm.$message.success('添加成功')
        vm.loading = false
      })
    },
    handleEdit () {
      let vm = this
      vm.loading = true
      vm.fromParams.token = getUser().token
      vm.$refs.addDialogFrom.validate().then( async() => {
        await organizationEdit(vm.fromParams)
        vm.loading = false
        vm.$message.success('修改成功')
        vm.$emit('success')
      })
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
