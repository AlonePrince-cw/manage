<template>
  <div>
    <el-radio-group v-model="sex" @change="selectSex">
      <el-radio :label="2">女</el-radio>
      <el-radio :label="1">男</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import { listAllDict } from "@/api/common";
import { getUser } from "@/utils/auth";
import request from "@/utils/request";
import store from "@/store";
export default {
  name: "memberSelect",

  data() {
    return {
      people: [],
      positionData: [],
      index: "",
      show: false,
      userData: [],
      isPosition: "",
      selectPositon: "",
      sex: ""
    };
  },
  props: {
    title: String
  },
  created() {
    this.isShow();
  },
  methods: {
    seleceMember() {},
    isHide() {
      this.show = false;
    },
    // getMember() {
    //   this.$store.dispatch("listAllDict", this);
    // },
    isShow() {
      this.show = true;
      let action = "LOAD_ROOT_OPTIONS";
      let parentNode = "";
      let callback = null;
      this.showData({ action, parentNode, callback });
      this.$emit("getPositionId", this.positionId);
    },
    async showData({ action, parentNode, callback }) {
      let params = {
        token: getUser().token
      };
      const data = await listAllDict(params);
      this.userData = data.data;
      // callback(new Error('加载失败: 网络错误.'))
    },
    selectSex(sexId) {
      this.$emit("selectSex",sexId);
      }
  }
};
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  border-bottom: 1px solid #c3c3c3;
  height: 40px;
  line-height: 40px;
  text-align: center;
  float: left;
  background-color: #409eff;
  color: white;
  font-size: 16px;
}
.el-option {
  width: 300px;
  height: 80px;
}
.el-card p {
  position: absolute;
  top: 25px;
  left: 105px;
}
.el-card span {
  position: relative;
  top: -10px;
  left: 15px;
}
.display-container {
  width: 150px;
  padding: 0px;
  margin: 0px;

  background-color: white;
  overflow: hidden;
  .el-input-group__append button.el-button {
    text-align: center;
    border-radius: 0px;
    background-color: #409eff;
    color: white;
  }
  span {
    float: left;
  }
  p {
    padding: 10px;
    color: #c1c1c1;
  }
}
.el-card__body {
  padding: 10px;
  img {
    float: left;
    width: 50px;
    height: 50px;
    position: relative;
    top: -10px;
    border: 1px solid #409eff;
    border-radius: 50px;
    display: inline;
  }
}
.select-container {
  overflow: hidden;
  width: 500px;
  height: 400px;
  border: 0.5px solid #cccccc;
  position: relative;
  left: 300px;
  .el-card__body {
    border: none;
  }
  .select-organization {
    border: 0.5px solid #c0c0c0;
    width: 50%;
    height: 360px;
    float: left;
    background-color: white;
    div {
      border: 1px solid #c1c1c1;
      padding: 10px;
      display: inline-block;
      border-radius: 10px;
    }
    .el-button {
      width: 20px;
      height: 20px;
      border-radius: 20px;
      padding: 0px;
      margin: 0px;
      position: relative;
      top: -10px;
      left: -10px;
    }
  }
  .select-member {
    border: 0.5px solid #c0c0c0;
    width: 50%;
    height: 360px;
    float: right;
    background-color: white;
  }
  button {
    width: 100%;
    height: 40px;
  }
}
</style>