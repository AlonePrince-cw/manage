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
          <el-form-item label="客户姓名：">
            <div class="view-content">{{formParams.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户电话：">
            <div class="view-content">{{formParams.telephone}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司名称:" prop="company">
            <div class="view-content">{{formParams.company}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在地区：">
            <div class="view-content"><span v-if="placeVal[0]">{{placeVal[0]}}</span></div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务：">
            <div class="view-content">{{formParams.duty}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：">
            <div class="view-content">
              <span v-if="formParams.sex === 1">男</span>
              <span v-if="formParams.sex === 2">女</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容多图：" v-if="imageFiles.length>0">
            <v-image-list :list="imageFiles"></v-image-list>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="客户描述：">
            <div class="view-content">{{formParams.customerDescribe}}</div>
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
    telephone: '',
    company: '',
    duty: '',
    regionId: '',
    sex: 0,
    customerDescribe: '',
    token: getUser().token,
}
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      placeVal: [],
      imageFiles: [],
      formParams: _.clone(emptyForm),
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
      vm.imageFiles = []
      vm.getPlaceParent(data.regionId)
      vm.formParams = {
        name: data.name,
        telephone: data.telephone,
        company: data.company,
        duty: data.duty,
        regionId: data.regionId,
        sex: data.sex,
        customerDescribe: data.customerDescribe,
        token: getUser().token,
      }
      if (data.hstoneFileEntityRelas.length > 0) {
        data.hstoneFileEntityRelas.forEach(key => {
          vm.imageFiles.push({
            id: key.fileCode,
            name: key.fileName,
            originalName: key.fileName,
            part: key.part,
            uniqueCode: key.fileCode
          })
        })
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
