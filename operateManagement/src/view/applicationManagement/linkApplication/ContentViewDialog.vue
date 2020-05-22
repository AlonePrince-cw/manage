<template>
  <el-dialog
    :visible.sync="visible"
    title="查看连接管理详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="1000px">
    <el-row>
      <el-form ref="myForm" label-width="100px" style="padding: 0 10px;">
        <el-col :span="12">
          <el-form-item label="连接名：">
            <div class="view-content" v-for="item in placeVal" :key="item.id" v-if="item.type === 0">{{item.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="链接地址：">
            <div class="view-content" v-for="item in placeVal" :key="item.id" v-if="item.type === 0">{{item.url}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="链接说明：">
            <div class="view-content" v-for="item in placeVal" :key="item.id" v-if="item.type === 0">{{item.details}}</div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-form ref="myForm" label-width="100px" style="padding: 0 10px;">
        <el-col :span="12">
          <el-form-item label="下载名：">
            <div class="view-content" v-for="item in placeVal" :key="item.id" v-if="item.type === 1">{{item.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下载地址：">
            <div class="view-content" v-for="item in placeVal" :key="item.id" v-if="item.type === 1">{{item.url}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="下载说明：">
            <div class="view-content" v-for="item in placeVal" :key="item.id" v-if="item.type === 1">{{item.details}}</div>
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
import { queryItemLinkDetails } from '@/api/application'
import { getUser } from '@/utils/auth'

const emptyForm = {
    url:"",
    name:"",
    details:"",//备注
}
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      placeVal: [],
      searchParams: _.clone(emptyForm),
    }
  },
  methods: {
    onOpen () {
      // this.getMenuTags()
    },
    async setFormDatas (v) {
      let vm = this
        let params = {
          id: v.projectId,
          token: getUser().token
        }
        const { data } = await queryItemLinkDetails(params)
      vm.placeVal = data.projectLinks
      console.log(vm.placeVal)
      },
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
