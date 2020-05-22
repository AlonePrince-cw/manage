<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @open="onOpen"
    class="myDialog">

<!--    <div style="display:flex;justify-content: space-between;align-items: center;">-->
        <el-table :data="gridData">
            <el-table-column property="date" label="金额类别" width="250"></el-table-column>
            <el-table-column property="name" label="总金额" width="250"></el-table-column>
            <el-table-column property="address" label="所占比例"></el-table-column>
        </el-table>
      <el-row slot="footer" class="dz-dialog-footer">
          <el-button class="button" type="primary" @click="handleAdd()">确认创建
          </el-button>
          <el-button class="button" type="primary" @click="handleEdit()">查看详情
          </el-button>
      </el-row>
<!--    </div>-->
      <el-dialog
              width="30%"
              title="内层 Dialog"
              :visible.sync="innerVisible"
              append-to-body>
      </el-dialog>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser } from '@/utils/auth'
import {confirmCreation,modifyExpenseRecord} from "@/api/expenseRecord"
import _ from 'lodash'
const emptyForm = {
        associationType:'',
        id:'',
        expenseTotal:'',//费用总金额
        financialStatus: "", //财务有效性（0-有效，1-无效）
        associationType: null,//	关联类型（0-项目，1-工作）
        projectId: "", //	关联项目id
        relatedWork: "", //	关联工作
        id:"",//主键ID
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
      innerVisible:false,
      gridData:[],
      searchParams: _.clone(emptyForm),
    }
  },
  created () {
  },
  computed: {
    title () {
      return this.dialogHandleType === 'add' ? '费用金额分类' : this.dialogHandleType === 'edit' ? '费用金额分类' : '费用金额分类'
    },

  },
  methods: {
    onOpen (v) {
        console.log(v)
    },
    async setFormDatas (data) {

      vm.searchParams = {

      }

    },
    async onUploadConfirms (v) {
        let vm = this
        if (vm.uploadType === 'video') {
            vm.videoFiles = v
        } else if (vm.uploadType === 'tvVideo') {
            vm.tvFiles = v
        } else{
            vm.attachmentFiles = v
        }
    },
    handleAdd () {
     alert(111)
    },
    handleEdit () {
        this.innerVisible = true
      // alert(1222222)
    }
  }
}
</script>
<style lang="scss">
    .dz-dialog-footer{
        text-align: center;
    }
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
