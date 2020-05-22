<template>
  <div class="app-main">
    <div class="app-container">
      <div class="app-breadcrumb" v-if="$route.name !== 'Home'">
        <Breadcrumb />
      </div>
      <router-view :key="appKey" />
    </div>
  </div>
</template>

<script>

export default {
  name: "appMain",
  components: {
    
  },
  data: function() {
    return {
      appKey: 1
    };
  },
  watch: {
    $route: function(newUrl, oldUrl) {
      this.appKey = new Date().getTime();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  min-height: 100%;
  background: #f2f3f8;
}
.app-container {
  padding: 16px 30px 30px;
  height: 100%;
}
router-view{
  background: #ffffff;
}
</style>