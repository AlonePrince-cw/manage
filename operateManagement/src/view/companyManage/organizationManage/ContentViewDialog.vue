<template>
  <el-dialog
    :visible.sync="visible"
    title="查看组织详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="840px">
    <el-row>
      <el-form ref="myForm" label-width="100px" style="padding: 0 10px;">
        <el-col :span="12">
          <el-form-item label="组织简称：">
            <div class="view-content">{{fromParams.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织全称：">
            <div class="view-content">{{fromParams.fullName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织所在地：">
            <div class="view-content"><span v-if="placeVal[0]">{{placeVal[0]}}</span></div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属组织：">
            <div class="view-content">{{fromParams.parentName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织类型：">
            <div class="view-content">{{fromParams.type | dict('organizationType')}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="简介：">
            <div class="view-content">{{fromParams.intro}}</div>
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
import { getPlaceParent } from '@/api/common'
import { getUser } from '@/utils/auth'
const emptyForm = {
    name: '',
    parentId: null,
    type: '',
    regionId: '',
    intro: '',
    fullName: '',
    parentName: '',
    token: getUser().token,
}
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      placeVal: [],
      fromParams: _.clone(emptyForm),
      token: getUser().token,
    }
  },
  methods: {
    async getPlaceParent(v){
      let params = {
        id: v,
        levelNum: 0,
        token: getUser().token
      }
      let { data } = await getPlaceParent(params)
      this.placeVal.push(data.parentsNameStr)
    },
    onOpen () {
      // this.getMenuTags()
    },
    setFormDatas (data) {
      let vm = this
      vm.placeVal = []
      vm.getPlaceParent(data.hstoneRegion.id)
      vm.fromParams = {
        id: data.id,
        name: data.name,
        parentId: data.hstoneOrganization?data.hstoneOrganization.id:'',
        parentName: data.hstoneOrganization?data.hstoneOrganization.fullName:'',
        type: data.type + '',
        regionId: data.hstoneRegion.id,
        intro: data.intro,
        fullName: data.fullName,
      }
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
