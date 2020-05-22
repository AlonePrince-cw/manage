<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @open="onOpen"
    class="myDialog">
    <el-form ref="addAccountManager" :model="formParams" :rules="rules" label-width="140px" style="padding: 0 10px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="employeeId">
            <memberSelect :snycModel.sync="formParams.employeeId" :value="formParams.employeeId" :disabled="dialogHandleType === 'edit'"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名：" prop="username">
            <el-input :disabled="dialogHandleType === 'check'" v-model="formParams.username" placeholder="请填写账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码：" prop="password">
            <el-input :disabled="dialogHandleType === 'check'" @change="passwordChange" v-model="formParams.password" placeholder="请填写账号密码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input :disabled="dialogHandleType === 'check'" v-model="formParams.confirmPassword" placeholder="请填写账号密码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="员工号：" prop="employeeNumber">
            <el-input :disabled="dialogHandleType === 'check'" v-model="formParams.employeeNumber" placeholder="请填写员工号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用状态：" prop="status">
            <el-radio v-model="formParams.status" :disabled="dialogHandleType === 'check'" :label="1">启用</el-radio>
            <el-radio v-model="formParams.status" :disabled="dialogHandleType === 'check'" :label="0">禁用</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('401')">新建账号</el-button>
      <el-button class="button" type="primary" @click="handleAlter()" v-if="dialogHandleType === 'edit' && permButton('406')">保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { mapState } from 'vuex'
import { addAccount, editPas } from '@/api/userInfo'
import _ from 'lodash'
const emptyForm = {
  employeeId: '',
  username: '',
  password: '',
  employeeNumber: '',
  status: 1,
  confirmPassword: '',
  token: getUser().token
}
const checkPassword = (rule, value, callback) => {
  let v = emptyForm.password
  let reg = /^\d{6,16}$|^(?!\d+$)\w{6,16}$/;
  if (value) {
    console.log(v!== value)
    if ( v!== value) {
      rule.message = '密码不一致'
      callback(new Error('密码不一致'))
    }
    if (!reg.test(value)) {
      rule.message = '密码由6-16个字符组成,不能包含空格'
      callback(new Error('密码由6-16个字符组成,不能包含空格'))
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
      menuNode: null,
      rules: {
        employeeId: [
          { required: true, message: '请关联用户', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          // { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        ],
        employeeNumber: [
          { required: true, message: '员工号不能为空', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请勾选启用状态', trigger: 'blur' },
        ],
      },
      getRoleListData: []
    }
  },
  created () {
  },
  computed: {
    ...mapState([
      'dailyTask'
    ]),
    title () {
      return this.dialogHandleType === 'add' ? '新增账号' : this.dialogHandleType === 'edit' ? '修改密码' : '查看账号详情'
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
    passwordChange(v){
      emptyForm.password = v
    },
    onOpen () {
      if (this.dialogHandleType === 'add') {
        this.formParams = Object.assign({}, emptyForm)
        // this.formParams.password = null
      }
      this.$nextTick(() => {
        this.$refs['addAccountManager'].clearValidate()
      })
    },
    setFormDatas (data) {
      let vm = this
      if(data) {
        vm.formParams = {
          id: data.id,
          employeeId: data.employeeId,
          username: data.username,
          password: data.password,
          employeeNumber: data.employeeNumber,
          status: data.status,
          confirmPassword: data.password,
        }
        emptyForm.password = data.password
      }else {
        emptyForm.password = ''
      }
    },
    handleAdd () {
      let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在新增...'
      })
      try {
        vm.$refs.addAccountManager.validate().then( async() => {
          await addAccount(vm.formParams)
          vm.$emit('success')
          vm.$message.success('新增成功')
          vm.loading = false
        })
      } catch (err) {
      } finally {
        loading.close()
      }
    },
    handleAlter () {
      let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在修改...'
      })
      try {
        vm.formParams.token = getUser().token
        vm.$refs.addAccountManager.validate().then( async() => {
          await editPas(vm.formParams)
          vm.$emit('success')
          vm.$message.success('修改成功')
          loading.close()
        })
      } catch (err) {
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
