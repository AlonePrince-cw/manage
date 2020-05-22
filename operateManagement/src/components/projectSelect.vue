<template>
  <div>
    <el-select
      placeholder="选择项目"
      filterable
      :value="value"
      @input="selectData"
      :disabled="disabled"
      class="myselect">
      <el-option
        v-for="item in projectData"
        :value="item.id"
        :label="item.projectName"
        :key="item.id">
        {{item.projectName}}
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getProject } from "@/api/common";
import { getUser } from "@/utils/auth";
export default {
  props:{
    snycModel: { type: String, default: '' },
    value: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      Project: [],
      ProjectName: "",
      show: false,
      projectData: [],
      ProjectId: null,
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created(){
    this.selectProject()
  },
  methods: {
    async selectProject() {
      let vm = this
      vm.show = true;
      let params = {
        token: getUser().token,
        page:1,
        size:100,
        projectName:"",
        regionTreeCode:"",
        employeeId:null,
        projectType:null,
        startTime:"",
        endTime:"",
        fundingStart:null,
        fundingEnd:null,
        projectStatus:null,
        isValid:null
      };
      const loading = vm.$loading({
        lock: true,
        text: '正在查询关联项目...'
      });
      try {
        const data = await getProject(params);
        vm.$nextTick(() => {
          vm.projectData = data.data;
        })
        vm.$emit("ProjectanizationData",data)
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },

    selectData(Project) {      
      this.projectData.forEach(key => {
        if (key.id === Project){
          this.$emit("update:snycModel", Project);
          this.$emit("selectData",key)
          return false
        }
      })   
      
    }
  }
};
</script>
<style>
    .dz-toolbar .el-form-item .myselect .el-input{
        width: 100%;
    }
</style>
<style lang="scss" scoped>
.input-with-select {
  width: 250px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-select {
  width: 100%;
}
</style>