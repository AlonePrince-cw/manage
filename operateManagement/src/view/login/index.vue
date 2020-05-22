<template>
  <div class="login-page">
    <el-form class="login-form" ref="loginForm" :model="form" :rules="rules">
      <el-form-item>
        <el-input placeholder="用户名" :disabeld="isPass" v-model="form.phone">
          <i slot="prefix" class="iconfont iconUser"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="密码" :disabled="isPass" v-model="form.password" type="password">
          <i slot="prefix" class="iconfont iconMima"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="button">
        <el-button @click="onLogin" :disabled="logining">{{buttonText}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loginByUsername, logout, getUserInfo } from "@/api/login";
import { setDict, setUser, getUser } from "@/utils/auth";
import { listAllDict } from '@/api/common'
export default {
  name: "Login",
  data() {
    return {
      logining: false,
      isPass: false,
      form: {
        phone: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "用户名不能为空" }]
      }
    };
  },
  computed: {
    buttonText() {
      return this.logining ? "正在登录..." : "登录";
    }
  },
  methods: {
    submit() {
      this.onLogin();
    },
    async dictionary (v) {
        let params = {
            token: v.token,
        };
        const datas = await listAllDict(params);
        setDict(datas.data)
        this.userInfo(v)
    },
    async userInfo (v) {
        let params = {
            token: v.token,
        };
        const { data } = await getUserInfo(params);
        setUser(data)
        const path = "/";
        this.$router.replace(path);
    },
    async onLogin() {
      this.$refs["loginForm"].validate().then(
        async () => {
          this.logining = true;
          try {
            const data  = await loginByUsername(this.form)
            this.dictionary(data)
          } catch (err) {
            this.logining = false;
          }
        },
        () => {}
      );
    }
  }
};
</script>

<style lang="scss">
.button {
  .el-button--primary:hover,
  .el-button--primary:focus {
    background: none;
    border-color: unset;
  }
  button {
    width: 400px;
  }
  .el-button--primary {
    background: none;
    border-color: unset;
  }
}
</style>
<style lang="scss" scoped>
.login-page {
  overflow: auto;
  height: 100%;
  min-height: 800px;
  background: url("../../assets/login_page_background.png") top -60px center no-repeat;
}

.login-form {
  margin: 500px auto 0;
  width: 400px;
  height: 300px;

  .iconfont {
    font-size: 24px;
    width: 24px;
    height: 24px;
    display: inline-block;
  }
  /*.iconfont.iconUser{*/
    /*background: url('../../assets/icon-user.png') top 0px center no-repeat;*/
  /*}*/
  /*.iconfont.iconMima{*/
    /*background: url('../../assets/icon-password.png') top 0px center no-repeat;*/
  /*}*/
}

.vf-code {
  margin-left: 12px;
  vertical-align: top;
  display: inline-block;
  width: 100px;
  height: 40px;
  overflow: hidden;
  border-radius: 4px;

  > img {
    width: 100%;
    height: 100%;
  }
}
</style>