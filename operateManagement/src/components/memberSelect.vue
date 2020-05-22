<template>
    <div class="display-container">
      <el-select :value="value" filterable style="width: 100%" :disabled="disabled" @change="selectData">
        <el-option
          :value="item.id"
          :label="item.name"
          v-for="item in memberData"
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
      memberId: null
    };
  },
  props: {
    // 数据
    snycModel: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    value: { type: String, default: '' }
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
      this.memberId = member;
      this.memberData.forEach(key => {
        if(key.id === this.memberId){
          this.$emit('update:snycModel', member)
          this.$emit('selectChange', key)
        }
      })
    }
  }
};
</script>
<style>
  .display-container .el-select{
    width: 100%;
  }
</style>
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
  width: 100%;
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

.select-container {
  overflow: hidden;

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
