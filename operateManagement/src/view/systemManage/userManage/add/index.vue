<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane :label="title" name="first">
        <div class="myFromInfo">
          <el-form
            ref="addAccountManager"
            :model="formParams"
            :rules="rules"
            label-width="140px">
              <el-row class="conBox">
                <el-col :span="24" class="header">
                  <span>基本信息</span>
                </el-col>
                <el-row class="infoBox">
                  <el-col :span="12">
                    <el-form-item label="姓名:" prop="employeeId">
                      <memberSelect :snycModel.sync="formParams.employeeId" @selectChange="memberChange" :value="formParams.employeeId" :disabled="$route.name === 'userEditManage'"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户名:" prop="username">
                      <el-input :disabled="$route.name === 'userEditManage'" v-model="formParams.username" placeholder="请填写账号" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="密码:" prop="password">
                      <el-input :disabled="$route.name === 'userEditManage'" @change="passwordChange" v-model="formParams.password" placeholder="请填写账号密码" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="确认密码:" prop="confirmPassword" v-if="$route.name === 'userAddManage'">
                      <el-input :disabled="$route.name === 'userEditManage'" v-model="formParams.confirmPassword" placeholder="请填写账号密码" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="员工号:" prop="employeeNumber">
                      <el-input :disabled="$route.name === 'userEditManage'" v-model="formParams.employeeNumber" placeholder="请填写员工号" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="启用状态:" prop="status">
                      <el-radio v-model="formParams.status" :disabled="$route.name === 'userEditManage'" :label="1">启用</el-radio>
                      <el-radio v-model="formParams.status" :disabled="$route.name === 'userEditManage'" :label="0">禁用</el-radio>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-col :span="24" class="header">
                  <span>角色设置</span>
                </el-col>
                <el-row>
                  <el-col :span="24">
                    <template v-for="v in getRoleListData">
                      <el-form-item :label="v.name + ':'">
                        <el-checkbox :value="changeBoxed(tem)" @change="changeBox(tem.id,getRoleListData)" v-for="tem in v.roles" :key="tem.id">{{tem.name}}</el-checkbox>
                      </el-form-item>
                    </template>
                  </el-col>
                </el-row>
                <el-row class="dz-dialog-footer">
                  <el-button class="button" type="primary" @click="$router.back()">返回</el-button>
                  <el-button class="button" type="primary" @click="handleAdd(true)" v-if="$route.name === 'userAddManage' && permButton('401')">提交</el-button>
                  <el-button class="button" type="primary" @click="handleEdit(true)" v-if="$route.name === 'userEditManage' && permButton('406')">修改</el-button>
                </el-row>
              </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import DialogMixin from '@/mixins/dialog'
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { mapState } from 'vuex'
  import { addAccount, editAccount, roleList } from '@/api/userInfo'
  import _ from 'lodash'
  const emptyForm = {
    employeeId: '',
    username: '',
    password: '',
    employeeNumber: '',
    status: 1,
    confirmPassword: '',
    roleId: [],
    token: getUser().token
  }
  Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };
  const checkPassword = (rule, value, callback) => {
    let v = emptyForm.password
    let reg = /^\d{6,16}$|^(?!\d+$)\w{6,16}$/;
    if (value) {
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
        str: '5',
        menuNode: null,
        targerName: 'first',
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
        getRoleListData: [],
        checkedList: [],
      }
    },
    created () {
      this.ftech()
    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
      title () {
        return this.$route.name === 'userAddManage' ? '新增账号' : this.$route.name === 'userEditManage' ? '编辑账号' : '查看账号详情'
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
      memberChange(v){
        this.formParams.username = v.phone
      },
      async ftech() {
        let vm = this
        let params = {
          token: getUser().token
        }
        if(vm.$route.name === 'userEditManage'&&!vm.userInfo.userInfo_data.id){
          vm.$router.back()
        }
        const {data} = await roleList(params)
        console.log(data)
        vm.formParams.password = null
        vm.getRoleListData = data
        if(vm.$route.name === 'userEditManage'){
          vm.checkedList = vm.userInfo.userInfo_data.roleId
          vm.formParams = {
            id: vm.userInfo.userInfo_data.id,
            employeeId: vm.userInfo.userInfo_data.employeeId,
            username: vm.userInfo.userInfo_data.username,
            password: vm.userInfo.userInfo_data.password,
            employeeNumber: vm.userInfo.userInfo_data.employeeNumber,
            status: vm.userInfo.userInfo_data.status,
            confirmPassword: vm.userInfo.userInfo_data.password,
          }
          emptyForm.password = vm.userInfo.userInfo_data.password
        }
      },
      changeBox(v,xx){
        let vm = this
        if(vm.checkedList.indexOf(v) === -1) {
          vm.checkedList = []
        }
          vm.checkedList.push(v)
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
      passwordChange(v){
        emptyForm.password = v
      },
      handleAdd () {
        let vm = this
        const loading = this.$loading({
          lock: true,
          text: '正在新增...'
        })
        try {
          vm.formParams.roleId = vm.checkedList
          vm.$refs.addAccountManager.validate().then( async() => {
            await addAccount(vm.formParams)
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
          vm.formParams.roleId = vm.checkedList
          vm.formParams.token = getUser().token
          vm.$refs.addAccountManager.validate().then( async() => {
            await editAccount(vm.formParams)
            loading.close()
            vm.$message.success('修改成功')
            vm.$router.back()
          })
        } catch (err) {
          loading.close()
        } finally {
          loading.close()
        }
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
        width: 1000px;margin: 40px auto;padding: 30px 30px 0px 0px;
        .btns{
          margin-bottom: 16px;
        }
      }
    }
    .dz-dialog-footer {
      text-align: center;
    }
  }
</style>
<style>
  .myFromInfo .el-date-editor{
    width: 100%;
  }
  .myFromInfo .el-input-number{
    width: 100%;
  }
  .myFromInfo .el-select{
    width: 100%;
  }
  .myFromInfo .el-input-number .el-input__inner{
    text-align: left;
  }
</style>
