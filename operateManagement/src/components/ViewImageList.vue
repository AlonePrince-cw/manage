<template>
  <div class="view-image-list" v-if="list">
    <div class="preview-image-box" v-for="file in list" :key="file.id" @click="viewBigImage(file)">
      <img class="img-fill" v-if="file.fileId" :src="file.fileId | getFileUrl" alt="">
      <img class="img-fill" v-if="file.id" :src="file.id | getFileUrl" alt="">
    </div>
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :modal-append-to-body="true" v-if="currentViewImage" width="1040px">
      <img style="display: block;margin: 0 auto;width: auto;min-width: 200px;max-width: 1000px;" v-if="currentViewImage.fileId" :src="currentViewImage.fileId | getFileUrl" alt="">
      <img class="img-fill" v-else :src="currentViewImage.id | getFileUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      currentViewImage: null
    }
  },
  methods: {
    viewBigImage (file) {
      this.currentViewImage = file
      this.visible = true
    }
  }
}
</script>
