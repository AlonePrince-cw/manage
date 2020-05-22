<template>
  <div class="display-container">
    <el-select
      multiple
     :value="value"
      :disabled="disabled"
      filterable
      @change="selectData">
      <el-option
          v-for="item in memberData"
          :value="item.id"
        :label="item.name"
        :key="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
import { memberList } from "@/api/common";
import { getUser } from "@/utils/auth";
export default {
  name: "memberSelect",
  data() {
    return {
      people: [],
      index: "",
      memberData: [],
      member: [],
      isPosition: "",
      selectPositon: "",
    };
  },
  props: {
    // 数据
    snycModel: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    value: {
        type:Array,//源码中的type
        default(){
            return [];
        }
    }
  },
  created () {
      this.isShow()
  },
  methods: {
    async isShow() {
      let params = {
        token: getUser().token,
        name: "",
        entryTimeStart: "",
        entryTimeEnd: "",
        resignationTimeStart: "",
        resignationTimeEnd: "",
        workStatus: "",
        organizationId: "",
        phone: "",
        position: ""
      };
      const data = await memberList(params);
      this.memberData = data.data;
    },
    selectData(member) {
      this.memberData.forEach(key => {
          this.$emit('selectChange', key)
      })
      this.$emit('selectData', member)
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
  padding: 0px;
  margin: 0px;
  width: 100%;
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
