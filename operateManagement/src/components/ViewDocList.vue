<template>
  <div class="attachment-list">
    <div class="attachment-item" v-for="file in list" :key="file.id">
      <i class="iconfont icon-fujian"></i><a :href="file.uniqueCode | getFileUrl" target="_blank">{{file.fileName}}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      required: true,
      type: Array
    }
  }
}
</script>
