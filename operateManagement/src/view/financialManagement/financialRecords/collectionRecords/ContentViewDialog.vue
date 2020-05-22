<template>
  <el-dialog
    :visible.sync="visible"
    title="查看收款记录详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="840px">
    <el-row>
      <el-form ref="myForm" label-width="100px" style="padding: 0 10px;">
        <el-col :span="12">
          <el-form-item label="收款时间：">
            <div class="view-content">{{searchParams.gatheringTime}}</div>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="费用类型：">
            <div class="view-content">{{searchParams.expenseType | dict("expenseType")}}</div>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="收款金额：">
            <div class="view-content">{{searchParams.gatheringAmount}}</div>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="报销人：">
            <div class="view-content">{{searchParams.employee}}</div>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="关联方式：">
            <div class="view-content">{{searchParams.associationType | dict('associationType')}}</div>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="备注：">
            <div class="view-content">{{searchParams.details}}</div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" @click="visible = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { viewDetails } from '@/api/collectionRecords'
import { getUser } from '@/utils/auth'

const emptyForm = {
   	gatheringTime:"",//收款时间
    gatheringAmount:"",//收款金额
    details:"",//备注
    token: getUser().token,
}
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      placeVal: [],
      searchParams: _.clone(emptyForm),
      token: getUser().token,
    }
  },
  methods: {
    async viewDetails(v){
      let vm = this
      let params = {
        id: v,
        levelNum: 0,
        token: getUser().token
      }
      let { data } = await viewDetails(params)
      console.log(data.associationType)
      vm.searchParams = {
        details:data.details,
        gatheringAmount:data.gatheringAmount,
        gatheringTime:data.gatheringTime,
      }
    },
    onOpen () {
      // this.getMenuTags()
    },
    // searchParams
    setFormDatas (data) {
      console.log(data)
      let vm = this
      vm.placeVal = []
      vm.viewDetails(data.id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-wrap {
    font-size: 16px;
    padding-left: 30px;
  }
  .view-content{
    min-height: 40px;
    word-break:break-all
  }
  .detail-item {
    line-height: 40px;

    &__label {
      color: #666;
    }

    &__value {
      color: #333;
    }
  }
</style>
