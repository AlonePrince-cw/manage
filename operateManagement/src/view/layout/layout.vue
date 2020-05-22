<template>
  <el-container style="height: 100%;overflow:auto;">
    <!-- 顶部 -->
    <el-header height="120px">
      <the-nav-bar />
    </el-header>
    <el-container style="height:calc(100vh - 120px)">
      <!-- 侧部导航 -->
      <el-aside width="240px" style="height:100%;position: relative;box-shadow: 6px 1px 20px rgba(69, 65, 78, 0.1);">
        <the-aside-bar />
      </el-aside>
      <!-- 中间内容 -->
      <el-main style="padding: 0;background: white;">
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import appMain from "./appMain";
import theNavBar from "./theNavBar";
import theAsideBar from "./theAsideBar";

export default {
  name: "Layout",
  components: {
    appMain,
    theNavBar,
    theAsideBar
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 100px;
}
.app-container {
  height: 100%;
}
</style>
