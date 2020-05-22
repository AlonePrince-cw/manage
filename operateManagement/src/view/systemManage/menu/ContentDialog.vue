<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    :close-on-click-modal="false"
    @open="onOpen"
    class="myDialog">
    <el-form ref="addMenuManager" :model="fromParams" :rules="rules" label-width="140px" style="padding: 0 10px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="栏目名称：" prop="name">
            <el-input :disabled="dialogHandleType === 'check'" v-model="fromParams.name" placeholder="请填写任务名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限类型：" prop="type">
            <el-select v-model="fromParams.type" @change="selectChanges" :disabled="dialogHandleType === 'check'" placeholder="请选择">
              <el-option
                v-for="item in menuTypeData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="栏目排序：" prop="sortNum">
            <el-input-number v-model="fromParams.sortNum" :disabled="dialogHandleType === 'check'" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="栏目权重：" prop="weight">
            <el-input-number v-model="fromParams.weight" :disabled="dialogHandleType === 'check'" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级目录：" prop="parentId">
            <MenusSelect
              placeholder="请先选择组织"
              loading-text="正在加载..."
              noChildrenText="没有更多选项了"
              retryText="点击重试?"
              :disabled="dialogHandleType === 'check'"
              @select="menuIdChange"
              value-format="object"
              :value="menuNode">
            </MenusSelect>
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="权限：" prop="perm" v-if="fromParams.type === '3'">-->
<!--            <el-input :disabled="dialogHandleType === 'check'" v-model="fromParams.perm" placeholder="请填写权限" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="按钮编码：" prop="perm" v-if="fromParams.type === '3'">-->
<!--            <el-input :disabled="dialogHandleType !== 'add' && fromParams.businessCode !==null" v-model="fromParams.businessCode" placeholder="请填写编码" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="菜单跳转路径：" prop="viewUrl" v-if="fromParams.type === '2'">
            <el-input :disabled="dialogHandleType === 'check'" v-model="fromParams.viewUrl" placeholder="请填写菜单跳转路径" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="目录图标：" prop="icon" v-if="fromParams.type === '1'">
            <el-upload
              class="avatar-uploader"
              :action="action"
              name="multifiles"
              :data="{ fileType: '01',token: token }"
              :with-credentials="true"
              :show-file-list="false"
              accept="image/png,image/jpg,image/jpeg,image/gif"
              :on-success="uploadCoverSuccess">
              <img class="img-fill" v-if="fromParams.icon" :src="fromParams.icon | getFileUrl">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('201')">确认创建</el-button>
      <el-button class="button" type="primary" @click="handleAlter()" v-if="dialogHandleType === 'edit' && permButton('203')">保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { mapState } from 'vuex'
import { addMenu, editMenu } from '@/api/menu'
import storeData from '@/store/state'
import _ from 'lodash'
const emptyForm = {
  name: '',
  parentId: null,
  type: '',
  perm: '',
  viewUrl: '',
  icon: '',
  sortNum: '',
  weight: '',
  businessCode: '',
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
      action: storeData.uploadAction,
      token: getUser().token,
      menuTypeData: [
        {
          id: '1',
          name: '目录'
        },
        {
          id: '2',
          name: '菜单'
        },
        {
          id: '3',
          name: '按钮'
        }
      ],
      menuNode: null,
      rules: {
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '栏目类型不能为空', trigger: 'blur' }
        ],
        perm: [
          { required: true, message: '栏目权限不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '菜单跳转路径不能为空', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
  },
  computed: {
    ...mapState([
      'dailyTask'
    ]),
    title () {
      return this.dialogHandleType === 'add' ? '新增栏目' : this.dialogHandleType === 'edit' ? '编辑栏目' : '查看栏目详情'
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
    async uploadCoverSuccess (response, file, fileList) {
      let vm = this
      if (response && response.code === 0) {
        const f = response.data[0]
        vm.fromParams.icon = f.uniqueCode
      } else {
        if (response.code === 401) {
          this.$message.error('登录过期，请重新登录')
          this.$router.push({ path: '/login', query: { redirect: this.$route.path } })
        } else {
          this.$message.error(response.msg)
        }
      }
    },
    onOpen () {
      if (this.dialogHandleType === 'add') {
        this.fromParams = Object.assign({}, emptyForm)
        this.menuNode = null
        this.$nextTick(() => {
          this.$refs['addMenuManager'].clearValidate()
        })
      }
    },
    menuIdChange(v) {
      this.fromParams.parentId = v.id
    },
    selectChanges (v) {
      this.fromParams.perm = ''
      this.fromParams.url = ''
    },
    setFormDatas (data) {
      let vm = this
      // if (vm.dialogHandleType === 'add') {
      //
      // } else {
      //   console.log(vm.fromParams)
      //   this.$nextTick(() => {
        if(data.parentName){
          vm.menuNode = {
            id: data.parentPermission.parentId, label: data.parentPermission.parentName
          }
        }else {
          vm.menuNode = null
        }
        vm.fromParams = {
          id: data.id,
          name: data.name,
          parentId: data.parentId,
          type: data.type + '',
          perm: data.perm,
          viewUrl: data.viewUrl,
          icon: data.icon,
          businessCode: data.businessCode,
          sortNum: data.sortNum + '',
          weight: data.weight + '',
          token: getUser().token,
        }
          // this.$refs['addMenuManager'].clearValidate()
        // })
      // }
    },
    handleAdd () {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在添加客户...'
      });
      try {
        vm.$refs.addMenuManager.validate().then( async() => {
          await addMenu(vm.fromParams)
          vm.$message.success('添加成功')
          vm.$emit('success')
        })
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    handleAlter () {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在修改...'
      });
      try {
        vm.$refs.addMenuManager.validate().then( async() => {
          await editMenu(vm.fromParams)
          vm.$message.success('修改成功')
          vm.$emit('success')
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
