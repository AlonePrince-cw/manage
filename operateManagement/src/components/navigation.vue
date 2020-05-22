<template>
  <div class="first-navigation">
    <!--<el-scrollbar wrap-class="scrollbar-wrapper">-->
      <el-menu
        active-text-color="#409EFF"
        :default-active="activeIndex"
        @open="handleOpen"
        @select="handleSelect"
        @close="handleClose">
        <navigation-item v-for="menu in menuList" :key="menu.id" :item="menu" />
      </el-menu>
    <!--</el-scrollbar>-->
  </div>
</template>
<script>
  import navigationItem from './navigationItem'
  export default {
    name:'navigation',
    components: { navigationItem},
    props:{
      menuList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        activeIndex: "1",
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
    }
  }
</script>
<style>
    .el-scrollbar {
        height: 100%;
    }
    .scrollbar-wrapper.el-scrollbar__wrap {
        overflow: auto;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
        padding-bottom: 17px;
    }
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #A1A3A9;
        border-radius: 3px;
    }
</style>