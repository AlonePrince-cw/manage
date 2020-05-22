<template>
  <el-dialog
    :visible.sync="visible"
    title="查看税务支出详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="840px">
    <el-row>
      <el-form ref="myForm" label-width="100px" style="padding: 0 10px;">
        <el-col :span="12">
          <el-form-item label="发生时间：">
            <div class="view-content">{{searchParams.occurTime}}</div>
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="成本类型：">-->
<!--            <div class="view-content">{{searchParams.costType | dict("costType")}}</div>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="税务金额：">
            <div class="view-content">{{searchParams.taxAmount}}</div>
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
import { viewDetails } from '@/api/taxExpenditure'
import { getUser } from '@/utils/auth'

const emptyForm = {
    occurTime:"",//发生时间
    taxAmount:"",//税务金额
    costType:null,//成本类型
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
    async costDetails(v){
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
        occurTime:data.occurTime,
        // costType:data.costType,
        taxAmount:data.taxAmount,
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
      vm.costDetails(data.id)
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
