<template>
  <div class="nav-bar">
    <!--<div class="the-logo">-->
      <!--<h1>HS运营管理平台</h1>-->
      <!--<img src="../../assets/user.png" />-->
    <!--</div>-->
    <div class="nav-bar-center"></div>
    <div class="nav-bar-right">
      <div class="current-user nav-button">
        <i style="font-size: 24px;"></i>
        <span> {{userName}}</span>
      </div>
      <div class="logout nav-button">
        <i style="font-size: 24px;"></i>
        <span @click="exist"> 退出</span>
        <p></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { removeUser, setUser, getUser } from '@/utils/auth'
export default {
  name: "theNavBar",
  created() {
    this.getInfo();
  },
  computed: {
    ...mapState([
      'userInfo',
      'user'
      ])
  },
  data() {
    return {
      userName: ""
    };
  },
  methods: {
    async exist() {
      removeUser()
      this.$router.push({ path:'/login'})
    },
    getInfo() {
      this.$store.dispatch("userInfo_fn", this);
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  width: 100%;
  height: 120px;
  color: #fff;
  background: url("../../assets/top_banner.png") no-repeat;
  background-position: left center;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);

  .the-logo {
    height: 100px;
    width: 500px;
    line-height: 120px;
    margin-left: 80px;
    // background: url('../../assets/logo.png') center no-repeat;
    // background-size: cover;
    img {
      position: absolute;
      left: 15px;
      top: calc(50% - 25px);
    }
  }

  &-center {
    flex: 1;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  &-right {
    display: flex;
    justify-content: flex-end;
    width: 500px;
    height: 100%;
    align-items: center;
    padding-right: 86px;
    font-size: 20px;

    .logout {
      i {
        display: inline-block;
        width: 44px;
        height: 44px;
        margin-right: 5px;
        vertical-align: -15px;
        background: url("../../assets/logOut.png") no-repeat;
      }
      p {
        position: relative;
        top: -40px;
        left: 30px;
      }
    }
    .current-user {
      i {
        display: inline-block;
        width: 44px;
        height: 44px;
        margin-right: 5px;
        vertical-align: -15px;
        background: url("../../assets/user.png") no-repeat;
      }
    }
  }
  .nav-button {
    height: 60px;
    padding: 0 16px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
    transition: all 0.25s;
    font-size: 16px;

    &:hover {
      // background-color: #C73741;
      cursor: pointer;
    }
  }
}
</style>
