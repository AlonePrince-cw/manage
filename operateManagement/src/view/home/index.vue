<template>
  <div class="home-page">
    <div class="img-tam"></div>
    <div class="img-welcome">
      <!--<h1>欢迎进入HS运营管理平台</h1>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
    };
  },
}
</script>

<style lang="scss" scoped>
.home-page {
  overflow: hidden;
}
.img-tam {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 826px;
  height: 515px;
  background: url('../../assets/home_house.png') bottom right no-repeat;
}
.img-welcome {
  margin: 15% auto 0;
  width: 372px;
  height: 143px;
  background: url('../../assets/welcome.png') center center no-repeat;
}
</style>

