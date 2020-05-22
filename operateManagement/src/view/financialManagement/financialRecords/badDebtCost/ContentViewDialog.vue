<template>
  <el-dialog
    :visible.sync="visible"
    title="查看坏账成本详情"
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
          <el-form-item label="坏账金额：">
            <div class="view-content">{{searchParams.badDebtAmount}}</div>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="报销人：">
            <div class="view-content">{{searchParams.employee}}</div>
          </el-form-item>
        </el-col> -->
<!--        {{searchParams}}-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="关联方式" prop="associationType">-->
<!--            <div class="view-content">-->
<!--              <span v-if="searchParams.associationType === 1">关联工作</span>-->
<!--              <span v-if="searchParams.associationType === 0">关联项目</span>-->
<!--            </div>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="选择项目" v-if="searchParams.associationType===0" prop="projectId">-->
<!--            <div class="view-content">-->
<!--              {{searchParams.projectId | dict('projectId')}}-->
<!--            </div>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="选择工作" v-if="searchParams.associationType===1" prop="relatedWork">-->
<!--            <div class="view-content">-->
<!--              {{searchParams.relatedWork | dict('relatedWork')}}-->
<!--            </div>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
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
import { badDebtCostView } from '@/api/badDebtCost'
import { getUser } from '@/utils/auth'

const emptyForm = {
    occurTime:"",//发生时间
    badDebtAmount:"",//预期金额
    associationType: null, //	关联类型（0-项目，1-工作）
  projectId: null, //	关联项目id
    relatedWork: null, //	关联工作
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
      console.log(v)
      let vm = this
      let params = {
        id: v,
        levelNum: 0,
        token: getUser().token
      }
      let { data } = await badDebtCostView(params)
      console.log(data.associationType)
      vm.searchParams = {
        details:data.details,
        occurTime:data.occurTime,
        associationType:data.associationType,
        projectId:data.projectId,
        relatedWork:data.relatedWork,
        // costType:data.costType,
        badDebtAmount:data.badDebtAmount,
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
