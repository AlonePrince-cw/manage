<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item>
      <template v-if="breadcrumb.parentPermission">{{breadcrumb.parentPermission.name}}</template>
      <template v-else>首页</template>
    </el-breadcrumb-item>
    <el-breadcrumb-item>{{breadcrumb.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import { getNode } from "@/utils/auth";
  export default {
    name: "Breadcrumb",
    data() {
      return {
        breadcrumb: ''
      };
    },
    created() {
      this.breadcrumb = getNode()
    }
  }
</script>
<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 30px;
  }
</style>