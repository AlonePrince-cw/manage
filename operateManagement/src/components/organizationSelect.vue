<template>
  <div>
    <el-select
      placeholder="选择部门"
      filterable
      :value="value"
      :disabled="disabled"
      @change="selectData"
      class="myselect">
      <el-option
        v-for="item in orgData"
        :value="item.id"
        :label="item.fullName"
        :key="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getOrg } from "@/api/common";
import { getUser } from "@/utils/auth";
export default {
  props:{
    value:{
      type:String,
      default:''
    },
    disabled:{
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      Org: [],
      orgName: "",
      show: false,
      orgData: [],
      OrgId: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
    };
  },
  created(){
    this.selectOrg()
  },
  methods: {
    async selectOrg() {
      let params = {
        token: getUser().token
      };
      const data = await getOrg(params);
      this.orgData = data.data;
    },

    selectData(Org) {      
      this.orgData.forEach(key => {
        if (key.id === Org){
          this.$emit("selectData", Org);
          this.$emit('update:snycModel', key.id)
          this.$emit("selectChange",key)
        }
      })      
    }
  }
};
</script>
<style>

</style>
<style lang="scss" scoped>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>