<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="1250px"
    @open="onOpen"
    class="myRoleDialog" style="margin-top: -10vh;">
    <el-form ref="myForm" :inline="true" :model="menulistParams"  class="demo-form-inline" label-width="100px" style="padding: 0 10px;">
      <el-form-item label="栏目名称：">
        <el-input v-model="menulistParams.name" prop="name" placeholder="请输入栏目名称" ></el-input>
      </el-form-item>
      <el-form-item label="上级目录：">
        <MenusSelect
          placeholder="请先选择组织"
          loading-text="正在加载..."
          noChildrenText="没有更多选项了"
          retryText="点击重试?"
          :disabled="dialogHandleType === 'check'"
          @select="menuIdChange"
          :value="menulistParams.parentId"
          style="width: 200px">
        </MenusSelect>
      </el-form-item>
      <el-form-item label="栏目类型：">
        <el-select v-model="menulistParams.type" placeholder="请选择">
          <el-option
            v-for="item in menuTypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="fr">
        <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
        <el-button icon="el-icon-close" type="danger" @click="onRest">重置</el-button>
      </el-form-item>
      <div style="clear: both"></div>
    </el-form>
    <!--<el-table-->
      <!--:data="tableData"-->
      <!--style="width: 100%"-->
      <!--ref="tables"-->
      <!--row-key="id"-->
      <!--border-->
      <!--lazy-->
      <!--:load="loadNode"-->
      <!--:tree-props="{children: 'children', hasChildren: 'hasChildren'}" @selection-change="handleSelectionChange">-->
      <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
      <!--&lt;!&ndash;<el-table-column label="ID" :show-overflow-tooltip="true" prop="id"></el-table-column>&ndash;&gt;-->
      <!--<el-table-column label="菜单名称" :show-overflow-tooltip="true" prop="name"></el-table-column>-->
      <!--<el-table-column label="菜单路径" :show-overflow-tooltip="true">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.url">{{scope.row.url}}</span>-->
          <!--<span v-else>&#45;&#45;</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="栏目类型" width="150" :show-overflow-tooltip="true">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag>{{scope.row.type | menuType}}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="栏目权重" prop="weight" :show-overflow-tooltip="true"></el-table-column>-->
      <!--<el-table-column label="创建时间" :show-overflow-tooltip="true" width="180">-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.createTime | dateFormatYmdHms}}-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="tables"
      row-key="id"
      border
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!--<el-table-column label="ID" :show-overflow-tooltip="true" prop="id"></el-table-column>-->
      <el-table-column label="菜单名称" :show-overflow-tooltip="true" prop="name" align="center"></el-table-column>
      <el-table-column label="菜单路径" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.url">{{scope.row.url}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="按钮权限" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.perm">{{scope.row.perm}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目类型" width="150" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.type | menuType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="栏目权重" prop="weight" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column label="创建时间" :show-overflow-tooltip="true" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormatYmdHms}}
        </template>
      </el-table-column>
    </el-table>
    <Pager :total="menulistParams.total" :pageTotalChange="handleSizeChange" :size="menulistParams.size" :current="menulistParams.page" :pageChange="pageChange"></Pager>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('301')">确认创建</el-button>
      <el-button class="button" type="primary" @click="handleAlter()" v-if="dialogHandleType === 'edit' && permButton('303')">保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { mapState } from 'vuex'
import { getUserMenus } from '@/api/common'
import { addrolePrem, permListPage } from '@/api/role'

import _ from 'lodash'
const emptyForm = {
  name: '',
  parentId: null,
  type: '',
  perm: '',
  url: '',
  icon: '',
  sortNum: '',
  weight: '',
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
      menuNode: null,
      token: getUser().token,
      tableData: [],
      menuTypeData: [
        {
          id: 1,
          name: '目录'
        },
        {
          id: 2,
          name: '菜单'
        },
        {
          id: 3,
          name: '按钮'
        }
      ],
      menulistParams: {
        page: 1,
        size: 10,
        total: 0,
        id: '',
        type: '',
        parentId: null,
        name: '',
        groupBy: 'exclude',
        token: getUser().token,
      },
      selectionData: [{
        businessCode: null,
        createDay: null,
        createHour: null,
        createMonth: null,
        createTime: "20191011190002",
        createYear: null,
        icon: null,
        id: "23",
        modifyTime: "20191021205506",
        name: "系统管理",
        parentId: "0",
        parentName: null,
        perm: "dbbf7c6fbfbd4f2cb070ad20d7be1c06",
        remark: null,
        sortNum: 99,
        type: 1,
        url: null,
        weight: 0,
      }]
    }
  },
  created () {
  },
  computed: {
    ...mapState([
      'role'
    ]),
    title () {
      return this.dialogHandleType === 'add' ? '关联权限' : this.dialogHandleType === 'edit' ? '编辑关联权限' : '查看关联权限'
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
    menuIdChange(v) {
      this.menulistParams.parentId = v.id
    },
    async fetchTableData () {
      let vm = this
      vm.loading = true
      vm.menulistParams.id = vm.role.role_checked[0].id
      let data = await permListPage(vm.menulistParams)
      vm.tableData = data.data
      vm.menulistParams.total = data.total
      vm.loading = false
    },
    handleSizeChange (v) {
      let vm = this
      vm.menulistParams.size = v
      vm.fetchTableData()
    },
    pageChange (v) {
      let vm = this
      vm.menulistParams.page = v
      this.fetchTableData()
    },
    handleSelectionChange(v) {
      let vm = this
      vm.role.role_menu_checked = v
    },
    onRest () {
      let vm = this
      vm.menulistParams.name = ''
      vm.menulistParams.parentId = null
      vm.menulistParams.type = ''
      vm.fetchTableData()
    },
    onSearch () {
      let vm = this
      vm.menulistParams.page = 1
      vm.fetchTableData()
    },
    async getMenu() {
      let vm = this
      // let params = {
      //   token: vm.token,
      //   permissionId: '0'
      // }
      // const { data } = await getUserMenus(params)
      // data.forEach(v => {
      //   if (v.type === 1 || v.type === 2) {
      //     v.hasChildren = true
      //   }
      // })
      // vm.tableData = data
    },
    // async loadNode (node, treeNode, resolve) {
    //   let vm = this
    //   let params = {
    //     token: vm.token,
    //     permissionId: node.id,
    //     parentType: ''
    //   }
    //   console.log(node)
    //   if (node.type === 2) {
    //     params.parentType = 3
    //   }
    //   const nodes = await getUserMenus(params)
    //   nodes.data.forEach(function (v) {
    //     if (v.type === 1 || v.type === 2) {
    //       v.hasChildren = true
    //     }
    //   })
    //   setTimeout(() => {
    //     return resolve(nodes.data)
    //   },500)
    // },
    onOpen () {
      this.getMenu()
      this.fetchTableData ()
      // if (this.dialogHandleType === 'add') {
      //   this.fromParams = Object.assign({}, emptyForm)
      //   this.menuNode = null
      //   this.$nextTick(() => {
      //     this.$refs['addMenuManager'].clearValidate()
      //   })
      // }
    },
    selectChanges (v) {
    },
    setFormDatas (data) {
      let vm = this
    },
    async handleAdd () {
      let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在分配权限...'
      })
      try {
        vm.role.role_add_params.id = vm.role.role_checked[0].id
        let arr = []
        vm.role.role_menu_checked.forEach(function (v) {
          arr.push(v.id)
        })
        vm.role.role_add_params.addIds = arr.join(',')
        vm.role.role_add_params.token = vm.token
        await addrolePrem(vm.role.role_add_params)
        vm.$message.success('分配成功')
        vm.$emit('success')
      } catch (err) {
      } finally {
        loading.close()
      }
    },
    handleAlter () {
      // let vm = this
      // vm.loading = true
      // vm.$refs.addMenuManager.validate().then( async() => {
      //   await editMenu(vm.fromParams)
      //   vm.loading = false
      //   vm.$message.success('修改成功')
      //   vm.$emit('success')
      // })
    }
  }
}
</script>
<style lang="scss">
  .myRoleDialog {
    .el-dialog__body{
      padding-left: 20px;
      padding-bottom: 0px;
      padding-top: 10px;
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
