<template>
    <div class="content-page">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="账号管理" name="menu" v-loading="loading" element-loading-text="拼命加载中...">
                <el-form
                    class="dz-toolbar"
                    ref="searchForm"
                    :model="userlistParams"
                    :inline="true"
                    style="padding: 20px 12px 0 12px;">
                    <el-form-item label="员工工号：">
                        <el-input v-model="userlistParams.employeeNumber" placeholder="员工号"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名：">
                        <el-input v-model="userlistParams.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名：">
                        <el-input v-model="userlistParams.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="电话：">
                        <el-input v-model="userlistParams.phone" placeholder="电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="角色：">
                        <el-input v-model="userlistParams.roleName" placeholder="角色名"></el-input>
                    </el-form-item>
                    <el-form-item label="创建日期：">
                        <el-date-picker
                            v-model="userlistParams.createStartTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="开始时间"
                            range-separator="-"
                        ></el-date-picker> 至
                        <el-date-picker
                            v-model="userlistParams.createEndTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="结束时间"
                            range-separator="-"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态:" prop="status">
                        <el-select v-model="userlistParams.status" placeholder="请选择">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="性别:">
                        <el-select v-model="userlistParams.sex" placeholder="请选择">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fr">
                        <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
                        <el-button icon="el-icon-close" type="danger" @click="onRest">重置</el-button>
                    </el-form-item>
                    <div style="clear: both"></div>
                </el-form>
                <el-row class="mb-20">
                    <div class="fl">
                        <el-button type="primary" @click="batchEnabled" class="reateBtn" v-if="permButton('405')">启用</el-button>
                        <el-button type="primary" @click="batchDisable" class="reateBtn" v-if="permButton('405')">禁用</el-button>
                        <el-button type="primary" @click="batchDeletion" class="reateBtn" v-if="permButton('404')">删除</el-button>
                    </div>
                    <div class="fr">
                        <el-button type="primary" icon="el-icon-plus" @click="accountAdd" v-if="permButton('401')">新增</el-button>
                    </div>
                </el-row>
                <el-table :data="account_accountList_data" border checkBox @selection-change="checkBoxChange">
                    <el-table-column type="selection" align="center" width="50"></el-table-column>
                    <el-table-column label="工号" align="center" prop="employeeNumber" width="90" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="用户名" align="center" prop="username" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="姓名" align="center" prop="name" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="性别" width="100" align="center" prop="name" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-if="scope.row.employee.sex === 1">男</span>
                            <span v-if="scope.row.employee.sex === 2">女</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="电话" align="center" prop="phone" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.employee.phone}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="角色" align="center" prop="roleName" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.roleNames.join('-')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建人" align="center" prop="creatorName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="创建时间" align="center" width="160" prop="email" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | dateFormatYmdHms}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                            <el-tag v-if="scope.row.status === 0" type="info">禁用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-button size="small" @click="accountEdit(scope.row)" type="text" v-if="permButton('406')">编辑</el-button>
                            <el-button size="small" @click="pasEdit(scope.row)" type="text" v-if="permButton('403')">修改密码</el-button>
                            <!--<el-button size="small" @click="accountCheck(scope.row)" type="text">查看</el-button>-->
                            <!--<el-button size="small" @click="accountDel(scope.row)" type="text">删除</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
                <Pager :total="userlistParams.total" :pageTotalChange="handleSizeChange" :size="userlistParams.size" :current="userlistParams.page" :pageChange="pageChange"></Pager>
            </el-tab-pane>
        </el-tabs>
        <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
    </div>
</template>
<script>
    import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { userManagerPage, delAccount,deleteDictionary,enableDisabled } from '@/api/userInfo'
import ContentDialog from './ContentDialog'
import { mapState } from 'vuex'
export default {
  name: 'menus',
  components: {
    ContentDialog
  },
  data () {
    return {
      loading: false,
      activeName: 'menu',
      account_accountList_data: [],
      dialogHandleType: 'add',
      account_accountList_checked:[],
      userlistParams: {
        page: 1,
        size: 10,
        employeeNumber: '',
        username: '',
        name: '',
        phone: '',
        roleName: '',
        createStartTime : '',
        createEndTime: '',
        status: '',
        sex: '',
        token: getUser().token,
      },
      delParams: {
        id: '',
        token: getUser().token,
      },
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
  },
  created () {
    let vm = this
    vm.fetchTableData()
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
      //  启用
      batchEnabled(){
          let vm = this
          let isRepeat = false
          const batchDisables = {
              ids:[],
              token:getUser().token,
              status:1,
          }
          vm.account_accountList_checked.forEach((element)=>{
              isRepeat = true
              batchDisables.ids.push(
                  element.id
              )
          })
          //启用
          if(isRepeat=true){
              vm.$confirm(`是否批量启用？`, '提示', {
                  type: 'warning'
              }).then(async () => {
                  const loading = this.$loading({
                      lock: true,
                      text: '正在启用...'
                  })
                  try {
                      await enableDisabled(batchDisables)
                      vm.$emit('success')
                      vm.$message.success('启用成功')
                      vm.fetchTableData()
                  } catch (err) {
                  } finally {
                      loading.close()
                  }
              }, _.noop)
          }
      },
      //  禁用
      batchDisable(){
          let vm = this
          let isRepeat = false
          const batchDisables = {
              ids:[],
              token:getUser().token,
              status:0,
          }
          vm.account_accountList_checked.forEach((element)=>{
              console.log(element)
              isRepeat = true
              batchDisables.ids.push(
                  element.id,
              )
          })
          //禁用
          if(isRepeat=true){
              vm.$confirm(`是否批量禁用？`, '提示', {
                  type: 'warning'
              }).then(async () => {
                  const loading = this.$loading({
                      lock: true,
                      text: '正在禁用...'
                  })
                  try {
                      await enableDisabled(batchDisables)
                      vm.$emit('success')
                      vm.$message.warning('禁用成功')
                      vm.fetchTableData()
                  } catch (err) {
                  } finally {
                      loading.close()
                  }
              }, _.noop)
          }
      },
      //  删除
      batchDeletion(){
          let vm = this
          let isRepeat = false
          const batchDisables = {
              token:getUser().token,
              ids:[]
          }
           vm.account_accountList_checked.forEach((element)=>{
              console.log(element)
              isRepeat = true
              batchDisables.ids.push(
                  element.id,
              )
          })
          //禁用
          if(isRepeat=true){
              vm.$confirm(`是否批量删除？`, '提示', {
                  type: 'warning'
              }).then(async () => {
                  const loading = this.$loading({
                      lock: true,
                      text: '正在删除...'
                  })
                  try {
                      await deleteDictionary(batchDisables)
                      vm.$emit('success')
                      vm.$message.warning('删除成功')
                      vm.fetchTableData()
                  } catch (err) {
                  } finally {
                      loading.close()
                  }
              }, _.noop)
          }
      },
    refreshTable (v) {
      let vm = this
      vm.userlistParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
    },
    checkBoxChange (v) {
        this.account_accountList_checked = v
        console.log( this.account_accountList_checked)
    },
    pageChange (v) {
      let vm = this
      vm.userlistParams.page = v
      this.fetchTableData()
    },
    handleSizeChange (v) {
      let vm = this
      vm.userlistParams.size = v
      vm.fetchTableData()
    },
    async fetchTableData () {
      let vm = this
      vm.loading = true
      let data = await userManagerPage(vm.userlistParams)
      vm.account_accountList_data = data.data
      vm.userlistParams.total = data.total
      vm.loading = false
    },
    onRest () {
      let vm = this
      vm.userlistParams = {
        page: 1,
        size: 10,
        employeeNumber: '',
        username: '',
        name: '',
        phone: '',
        roleName: '',
        createStartTime : '',
        createEndTime: '',
        status: '',
        sex: '',
        token: getUser().token,
      }

      vm.fetchTableData()
    },
    onSearch () {
      let vm = this
      vm.userlistParams.page = 1
      vm.fetchTableData()
    },
    accountAdd () {
      let vm = this
      vm.$router.push({path: '/business/account/userManage/add/' + getNode().id})
    },
    accountEdit (v) {
      let vm = this
      vm.userInfo.userInfo_data = v
      vm.$router.push({path: '/business/account/userManage/edit/' + getNode().id})
    },
    pasEdit (v) {
      let vm = this
      vm.dialogHandleType = 'edit'
      vm.$refs['dialog'].show()
      vm.$refs['dialog'].setFormDatas(v)
    },
    accountDel (v) {
      let vm = this
      vm.$confirm(`确定要删除栏目？`, '提示', {
        type: 'warning'
      }).then(async () => {
        vm.delParams.id = v.id
        const loading = this.$loading({
          lock: true,
          text: '正在删除...'
        })
        try {
          await delAccount(vm.delParams)
          vm.$message.success('删除成功')
          vm.fetchTableData()
        } catch (err) {
        } finally {
          loading.close()
        }
      }, _.noop)
    },
    accountCheck (v) {
      let vm = this
      vm.dialogHandleType = 'check'
      vm.$refs['dialog'].show()
      vm.$refs['dialog'].setFormDatas(v)
    },
  }
}
</script>

<style lang="scss">
    .addManagerRoles {
        .el-dialog__body{
            padding-left: 0px;
        }
        .el-select{width: 100%}
        .el-input-number{
            width: 100%;
            .el-input__inner{
                text-align: left;
            }
        }
    }
</style>
