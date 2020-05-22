<template>
    <div class="content-page">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="角色管理" name="menu" v-loading="loading" element-loading-text="拼命加载中...">
                <el-form
                    class="dz-toolbar"
                    ref="searchForm"
                    :model="rolelistParams"
                    :inline="true"
                    style="padding: 20px 12px 0 12px;">
                    <el-form-item label="角色名称：">
                        <el-input v-model="rolelistParams.name" placeholder="请输入角色"></el-input>
                    </el-form-item>
                    <el-form-item label="角色类型：">
                        <el-select v-model="rolelistParams.type" placeholder="请选择">
                            <el-option
                                v-for="item in roleTypeData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属部门:" prop="organizationId">
                        <organizationSelect @selectChange="orgChange" :value="rolelistParams.organizationId"/>
                    </el-form-item>
                    <el-form-item label="状态:" prop="status">
                        <el-select v-model="rolelistParams.status" placeholder="请选择">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建日期：">
                        <el-date-picker
                            v-model="rolelistParams.createStartTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="请选择日期"
                            range-separator="-"
                        ></el-date-picker> 至
                        <el-date-picker
                            v-model="rolelistParams.createEndTime"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择日期"
                            type="date"
                            range-separator="-"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item class="fr">
                        <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
                        <el-button icon="el-icon-close" type="danger" @click="onRest">重置</el-button>
                    </el-form-item>
                    <div style="clear: both"></div>
                </el-form>
                <el-row class="mb-20">
                    <div class="fl">
                        <el-button type="primary" @click="batchEnabled" class="reateBtn" v-if="permButton('314')">启用</el-button>
                        <el-button type="primary" @click="batchDisable" class="reateBtn" v-if="permButton('314')">禁用</el-button>
                        <el-button type="primary" @click="batchDeletion" class="reateBtn" v-if="permButton('304')">删除</el-button>
                    </div>
                    <div class="fr">
                        <!--<el-button type="primary" icon="el-icon-plus" @click="roleAdd">新增角色</el-button>-->
                        <el-button type="primary" icon="el-icon-plus" @click="powerSet" v-if="permButton('301')">创建角色</el-button>
                        <!--<el-button type="primary" icon="el-icon-plus" @click="rolePower">分配角色权限</el-button>-->
                        <!--<el-button type="primary" icon="el-icon-plus" @click="roleDelPower">解除角色权限</el-button>-->
                    </div>
                </el-row>
                <el-table :data="role_roleList_data" border @selection-change="checkBoxChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="排序" align="center" type="index" width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <input v-model.Number="scope.row.sortNum" @blur="sortChange(scope.row.sortNum,scope.row)" v-if="permButton('315')" style="border: 1px solid #EBEEF5;width: 60px;padding: 8px"></input>
                        </template>
                    </el-table-column>
                    <el-table-column label="角色名" width="150" align="center" prop="name" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="角色类型" width="150" align="center" prop="type" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span>{{scope.row.type | roleType}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="角色说明" align="center" prop="remark" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="所属部门" align="center" prop="organizationName" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | dateFormatYmdHms}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间" align="center" prop="modifyTime" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.modifyTime | dateFormatYmdHms}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
                            <el-tag v-if="scope.row.status === 0" type="info">禁用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-button size="small" @click="bindingAuthority(scope.row)" v-if="scope.row.status === 1" type="text">绑定权限</el-button>
                            <el-button size="small" @click="roleEdits(scope.row)" type="text" v-if="permButton('303')">编辑</el-button>
                            <!--<el-button size="small" @click="roleEdit(scope.row)" v-if="scope.row.type !== 0" type="text">修改</el-button>-->
                            <!--<el-button size="small" @click="roleDel(scope.row)" v-if="scope.row.type !== 0"  type="text">删除</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
                <Pager :total="rolelistParams.total" :pageTotalChange="handleSizeChange" :size="rolelistParams.size" :current="rolelistParams.page" :pageChange="pageChange"></Pager>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            :title="isAddRole? '新增角色' : isCheckRole ? '查看角色': '编辑角色'"
            width="500px"
            :visible.sync="addRole" class="addManagerRoles">
            <el-form ref="addManagerRole" :model="addRoleParams" :rules="rules" label-width="100px" style="padding: 0 10px;">
                <el-form-item label="角色名称：" prop="name">
                    <el-input :rows="4" v-model="addRoleParams.name" :disabled="isCheckRole" type="text"></el-input>
                </el-form-item>
                <el-form-item label="角色类型：" prop="type">
                  <el-select v-model="addRoleParams.type" :disabled="isCheckRole" placeholder="请选择">
                    <el-option
                        v-for="item in roleTypeData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备  注：" prop="remark">
                    <el-input :rows="4" v-model="addRoleParams.remark" :disabled="isCheckRole" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <el-row slot="footer" class="dz-dialog-footer" v-if="!isCheckRole">
                <el-button class="button" type="primary" v-if="isAddRole" @click="onSure">确认</el-button>
                <el-button class="button" type="primary" v-else @click="onEdit">修改</el-button>
            </el-row>
        </el-dialog>
        <!--<ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>-->
        <!--<ContentDelDialog ref="delDialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>-->
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { roleListPage, sortChange, enableDisabled, deleteDictionary} from '@/api/role'
// import ContentDialog from './ContentDialog'
// import ContentDelDialog from './ContentDelDialog'
const nullRender = null
const menuColumns = [
  {
    value: 'id',
    label: '组织ID',
    width: 100,
    formatter: nullRender
  },
  {
    value: 'name',
    label: '菜单名称',
    formatter: nullRender
  },
]
export default {
  name: 'menus',
  components: {
    // ContentDialog, ContentDelDialog
  },
  data () {
    return {
      addRole: false,
      loading: false,
      isAddRole: true,
      isCheckRole: false,
      addRoleParams: {
        name: '',
        type: '',
        remark: '',
        token: getUser().token,
      },
      roleTypeData: [
        {
          id: 1,
          name: '管理员'
        },
        {
          id: 2,
          name: '客户'
        },
        {
          id: 3,
          name: '第三方系统'
        }
      ],
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '业务类型不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      },
      activeName: 'menu',
      role_roleList_data: [],
      dialogHandleType: 'add',
      rolelistParams: {
        page: 1,
        size: 10,
        name: '',
        type: '',
        createStartTime: '',
        createEndTime: '',
        organizationId: '',
        status: '',
        token: getUser().token,
      },
      roleParams: {
        id: '',
        token: getUser().token,
      },
    }
  },
  computed: {
    ...mapState([
      'role'
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
      //绑点权限
      bindingAuthority(v){
          console.log(v)
          // alert("1")
          let vm = this
          vm.$router.push('/business/role/roleManage/authoRity/' + v.id)
          // vm.$message('目前仅支持项目管理模块');
          vm.$message({
              message: '目前仅支持项目管理模块',
              type: 'warning'
          });
          // vm.$router.push('/business/role/roleManage/permSetEdit/' + v.id)
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
          vm.role.role_checked.forEach((element)=>{
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
          vm.role.role_checked.forEach((element)=>{
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
          vm.role.role_checked.forEach((element)=>{
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
    orgChange(v) {
      this.rolelistParams.organizationId = v.id
    },
    // userPower() {
    //   let vm = this
    //   if (vm.role.role_checked.length === 0) {
    //     vm.$message.error('请勾选选择一条角色')
    //     return
    //   }
    //   if (vm.role.role_checked.length > 1) {
    //     vm.$message.error('只能勾选一条角色')
    //     return
    //   }
    //   vm.dialogHandleType = 'add'
    //   vm.$refs['dialog'].show()
    // },
    // userDelPower() {
    //   let vm = this
    //   if (vm.role.role_checked.length === 0) {
    //     vm.$message.error('请勾选选择一条角色')
    //     return
    //   }
    //   if (vm.role.role_checked.length > 1) {
    //     vm.$message.error('只能勾选一条角色')
    //     return
    //   }
    //   vm.dialogHandleType = 'add'
    //   vm.$refs['delDialog'].show()
    // },
    // rolePower() {
    //   let vm = this
    //   if (vm.role.role_checked.length === 0) {
    //     vm.$message.error('请勾选选择一条角色')
    //     return
    //   }
    //   if (vm.role.role_checked.length > 1) {
    //     vm.$message.error('只能勾选一条角色')
    //     return
    //   }
    //   vm.dialogHandleType = 'add'
    //   vm.$refs['dialog'].show()
    // },
    // roleDelPower() {
    //   let vm = this
    //   if (vm.role.role_checked.length === 0) {
    //     vm.$message.error('请勾选选择一条角色')
    //     return
    //   }
    //   if (vm.role.role_checked.length > 1) {
    //     vm.$message.error('只能勾选一条角色')
    //     return
    //   }
    //   vm.dialogHandleType = 'add'
    //   vm.$refs['delDialog'].show()
    // },
    async sortChange(v,val) {
      var n = Number(v);
      if (!isNaN(n))
      {
        const loading = this.$loading({
          lock: true,
          text: '正在排序...'
        })
        try {
          let params = {
            id: val.id,
            sortNum: v,
            token: getUser().token
          }
          await sortChange(params)
          this.$message.success('排序成功')
          // this.role_roleList_data = []
          this.fetchTableData()
        } catch (err) {
        } finally {
          loading.close()
        }
      }else {
        this.$message.error('请输入数字')
      }
    },
    onSure() {
      let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在添加...'
      })
      try {
        vm.$refs.addManagerRole.validate().then( async() => {
          await addrole(vm.addRoleParams)
          vm.$message.success('添加成功')
          vm.fetchTableData()
          vm.role.role_checked = []
          vm.addRole = false
        })
      } catch (err) {
      } finally {
        loading.close()
      }
    },
    onEdit() {
      let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在修改...'
      })
      try {
        vm.$refs.addManagerRole.validate().then( async() => {
          await editrole(vm.addRoleParams)
          vm.$message.success('修改成功')
          vm.fetchTableData()
          vm.addRole = false
        })
      } catch (err) {
      } finally {
        loading.close()
      }
    },
    refreshTable (v) {
      let vm = this
      vm.rolelistParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
      vm.$refs['delDialog'].hide()
    },
    checkBoxChange (v) {
      let vm = this
      vm.role.role_checked = v
        console.log(vm.role.role_checked )
    },
    pageChange (v) {
      let vm = this
      vm.rolelistParams.page = v
      this.fetchTableData()
    },
    handleSizeChange (v) {
      let vm = this
      vm.rolelistParams.size = v
      vm.fetchTableData()
    },
    async fetchTableData () {
      let vm = this
      vm.loading = true
      vm.role.role_checked = []
      let data = await roleListPage(vm.rolelistParams)
      vm.role_roleList_data = data.data
      vm.rolelistParams.total = data.total
      vm.loading = false
    },
    onRest () {
      let vm = this
      vm.rolelistParams = {
        page: 1,
        size: 10,
        name: '',
        type: '',
        createStartTime: '',
        createEndTime: '',
        organizationId: '',
        status: '',
        token: getUser().token,
      }
      vm.fetchTableData()
    },
    onSearch () {
      let vm = this
      vm.rolelistParams.page = 1
      vm.fetchTableData()
    },
    powerSet () {
      let vm = this
      vm.$router.push('/business/role/roleManage/permSet/' + getNode().id)
    },
    roleAdd () {
      let vm = this
      // vm.dialogHandleType = 'add'
      // vm.$refs['dialog'].show()
      vm.isAddRole = true
      vm.addRoleParams = {
        name: '',
        type: '',
        remark: '',
        token: getUser().token,
      }
      vm.$nextTick(() => {
        vm.$refs['addManagerRole'].clearValidate()
      })
      vm.isCheckRole = false
      vm.isAddRole = true
      vm.addRole = true
    },
    roleEdits (v) {
      let vm = this
      // if (vm.role.role_checked.length === 0) {
      //   vm.$message.error('请勾选选择一条角色')
      //   return
      // }
      // if (vm.role.role_checked.length > 1) {
      //   vm.$message.error('只能勾选一条角色')
      //   return
      // }
      vm.$router.push('/business/role/roleManage/permSetEdit/' + v.id)
    },
    roleEdit (v) {
      let vm = this
      vm.addRoleParams = {
        id: v.id,
        name: v.name,
        type: v.type.toString(),
        remark: v.remark,
        token: getUser().token,
      }
      vm.$nextTick(() => {
        vm.$refs['addManagerRole'].clearValidate()
      })
      vm.isAddRole = false
      vm.isCheckRole = false
      vm.addRole = true
    },
    roleDel (v) {
      let vm = this
      vm.$confirm(`确定要删除角色？`, '提示', {
        type: 'warning'
      }).then(async () => {
        vm.roleParams.id = v.id
        const loading = this.$loading({
          lock: true,
          text: '正在删除...'
        })
        try {
          await roleDel(vm.roleParams)
          vm.$message.success('删除成功')
          vm.fetchTableData()
        } catch (err) {
        } finally {
          loading.close()
        }
      }, _.noop)
    },
    roleCheck (v) {
      let vm = this
      vm.addRoleParams = {
        id: v.id,
        name: v.name,
        type: v.type,
        remark: v.remark,
        token: getUser().token,
      }
      vm.$nextTick(() => {
        vm.$refs['addManagerRole'].clearValidate()
      })
      vm.isCheckRole = true
      vm.isAddRole = false
      vm.addRole = true
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
