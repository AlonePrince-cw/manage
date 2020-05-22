<template>
  <div class="message-page">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="title" name="content" v-loading="loading" element-loading-text="拼命加载中...">
        <el-row class="myFromInfo">
          <el-form
            ref="formInfo"
            label-width="100px"
            :model="formParams"
            :rules="rules"
            style="width: 1200px;margin: 40px auto;padding: 30px 30px 0px 0px;">
            <el-row class="conBox" style="margin-bottom: 0px;padding-bottom: 0px;margin-top: 0px">
              <el-col :span="24" class="header">
                <span>基本信息</span>
              </el-col>
              <el-row class="infoBox">
                <el-col :span="12">
                  <el-form-item label="角色名称:" prop="name">
                    <el-input :rows="4" v-model="formParams.name" type="text" maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角色类型:" prop="type">
                    <el-select v-model="formParams.type" placeholder="请选择">
                      <el-option
                        v-for="item in roleTypeData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属部门:" prop="organizationId">
                    <organizationSelect @selectChange="orgChange" :value="formParams.organizationId"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态:" prop="status">
                    <el-radio v-model="formParams.status" :label="1">启用</el-radio>
                    <el-radio v-model="formParams.status" :label="0">禁用</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="角色说明:" prop="remark">
                    <el-input :rows="4" v-model="formParams.remark" type="textarea" maxlength="400"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
            <el-row class="conBox">
              <el-col :span="24" class="header">
                <span>权限设置</span>
              </el-col>
              <el-row class="infoBox">
                <div class="virtualTable" v-for="v in getPermListData" :key="v.id">
                  <div class="lineBox" v-if="v.type === 1">
                    <div class="menuTitle" style="width: 100%"><el-checkbox :value="changeBoxed(v)" @change="changeBox(v.id)"> {{v.name}}</el-checkbox></div>
                  </div>
                  <div class="lineBox" v-if="v.type === 2">
                    <div class="menuTitle" style="padding-left:32px "><el-checkbox :value="changeBoxed(v)" @change="changeBox(v.id)"> {{v.name}}</el-checkbox></div>
                    <div class="btnTitle">
                      <template v-if="v.hstonePermissions">
                        <el-checkbox :value="changeBoxed(tem)" v-for="tem in v.hstonePermissions" @change="changeBox(tem.id)">{{tem.name}}</el-checkbox>
                      </template>
                    </div>
                  </div>
                  <template v-if="v.hstonePermissions">
                    <template v-for="tem in v.hstonePermissions">
                      <template v-if="tem.type === 1">
                        <div class="lineBox">
                          <div class="menuTitle" style="width: 100%;padding-left: 32px"><el-checkbox :value="changeBoxed(tem)" @change="changeBox(tem.id)"> {{tem.name}}</el-checkbox></div>
                        </div>
                        <template v-if="tem.hstonePermissions">
                          <div class="lineBox" v-if="val.type === 2" :key="val.id" v-for="val in tem.hstonePermissions">
                            <div class="menuTitle" style="padding-left: 48px"><el-checkbox :value="changeBoxed(val)" @change="changeBox(val.id)"> {{val.name}}</el-checkbox></div>
                            <div class="btnTitle">
                              <template v-if="val.hstonePermissions">
                                <el-checkbox :value="changeBoxed(tems)" v-for="tems in val.hstonePermissions" @change="changeBox(tems.id)">{{tems.name}}</el-checkbox>
                              </template>
                            </div>
                          </div>
                        </template>
                      </template>
                      <div class="lineBox" v-if="tem.type === 2" :key="tem.id">
                        <div class="menuTitle" style="padding-left: 32px"><el-checkbox :value="changeBoxed(tem)" @change="changeBox(tem.id)"> {{tem.name}}</el-checkbox></div>
                        <div class="btnTitle">
                          <template v-if="tem.hstonePermissions">
                            <el-checkbox :value="changeBoxed(tem)" v-for="tem in tem.hstonePermissions" @change="changeBox(tem.id)">{{tem.name}}</el-checkbox>
                          </template>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </el-row>
            </el-row>
            <el-row class="dz-dialog-footer">
              <el-button class="button" type="primary" @click="$router.back()">返回</el-button>
              <el-button class="button" type="primary" @click="handleAdd(true)" v-if="$route.name === 'permSetAdd' && permButton('303')">提交</el-button>
              <el-button class="button" type="primary" @click="handleEdit(true)" v-if="$route.name === 'permSetEdit' && permButton('303')">修改</el-button>
            </el-row>
          </el-form>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { Format } from '@/utils/util'
import { permList, roleAdd, roleEdit, roleCheck } from '@/api/role'
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
export default {
  name: 'permSet',
  data () {
    return {
      activeName: 'content',
      loading: false,
      checked: false,
      activeStep: 0,
      formParams: {
        name: '',
        type: 1,
        remark: '',
        organizationId: '',
        status: 1,
        permissionIds: '',
        token: getUser().token
      },
      roleTypeData: [
        // 超级管理、管理员、普通员工三级
        {
          id: 101,
          name: '管理员'
        },
        {
          id: 102,
          name: '超级管理'
        },
        {
          id: 103,
          name: '普通员工三级'
        }
      ],
      token: getUser().token,
      projectProp: null,
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择角色类型', trigger: 'blur' }
        ],
        organizationId: [
          { required: true, message: '请选择部门', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请勾选启用状态', trigger: 'blur' },
        ],
      },
      getPermListData: [],
      checkedList: [],
    }
  },
  created () {
    this.ftech()
  },
  computed: {
    title () {
      return this.$route.name === 'permSetEdit' ? '修改角色' : '新增角色'
    },
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
    changeBox(v){
      let vm = this
      if(vm.checkedList.indexOf(v) === -1){
        vm.checkedList.push(v)
      }else {
        vm.checkedList.remove(v)
      }
    },
    changeBoxed(v){
      let vm = this
      let f = ''
      if(vm.checkedList.indexOf(v.id) === -1){
        f = false
      }else {
        f = true
      }
      return f
    },
    async ftech() {
      let vm = this
      let params = {
        token: getUser().token
      }
      const {data} = await permList(params)
      vm.getPermListData = data
      if(vm.$route.name === 'permSetEdit'){
        vm.edit()
      }
    },
    async edit() {
      let vm = this
      let params = {
        id: vm.$route.params.id,
        token: getUser().token
      }
      let {data} = await roleCheck(params)
      vm.formParams = {
        id: data.id,
        name: data.name,
        type: data.type,
        remark: data.remark,
        organizationId: data.organizationId,
        status: data.status,
        permissionIds: data.permissionIds,
      }
      vm.checkedList = data.permissionIds
    },
    orgChange(v){
      this.formParams.organizationId = v.id
    },
    handleAdd () {
      let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在新增...'
      })
      try {
        vm.formParams.permissionIds = vm.checkedList
        vm.$refs.formInfo.validate().then( async() => {
          await roleAdd(vm.formParams)
          vm.$emit('success')
          vm.$message.success('新增成功')
          vm.$router.back()
        })
      } catch (err) {
      } finally {
        loading.close()
      }
    },
    handleEdit () {
      let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在修改...'
      })
      try {
        vm.formParams.permissionIds = vm.checkedList
        vm.formParams.token = getUser().token
        vm.$refs.formInfo.validate().then( async() => {
          await roleEdit(vm.formParams)
          loading.close()
          vm.$message.success('修改成功')
          vm.$router.back()
        })
      } catch (err) {
        loading.close()
      } finally {
      }
    }
  }
}
</script>
<style lang="scss">
  .virtualTable{
    border: 1px solid #d7dae2;
    margin-bottom: 20px;
    .el-checkbox__label {
      display: inline-block;
      padding-left: 10px;
      line-height: 19px;
      font-size: 15px;
    }
    .lineBox{
      border-bottom: 1px solid #d7dae2;
      overflow: hidden;
      .menuTitle{
        width: 200px;
        float: left;
        padding: 16px 16px;
      }
      .btnTitle{
        margin-left: 200px;
        border-left: 1px solid #d7dae2;
        padding: 16px 30px;
        min-height: 52px;
      }
    }
    .lineBox:last-child{
      border-bottom: none;
    }
  }
  .myFromInfo{
    .x-pagination {
      padding-left: 0px;
    }
    .conBox {
      width: 1100px;margin: 40px auto;padding: 0px 30px 30px 0px;
      .header {
        border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;
      }
      .infoBox {
        width: 1000px;margin: 40px auto;padding: 30px 30px 0px 0px;margin-bottom: 0px;
        .btns{
          margin-bottom: 16px;
        }
      }
    }
    .dz-dialog-footer {
      text-align: center;
    }
  }
  .myFromInfo .el-date-editor{
    width: 100%;
  }
  .myFromInfo .el-input-number{
    width: 100%;
  }
  .myFromInfo .el-select{
    width: 100%;
  }
</style>