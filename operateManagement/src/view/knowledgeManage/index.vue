<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      ref="tabs"
    >
      <el-tab-pane label="知识管理" name="first">
        <!-- 组织管理筛选 -->
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
          :model="knowledgeListParams">
          <el-form-item label="主题标题:">
            <el-input v-model="knowledgeListParams.title" placeholder="请输入主题标题"></el-input>
          </el-form-item>
          <el-form-item label="内容类型:">
            <GetPlatformDict  :dictType = "'catgoryType'" :disabled="dialogHandleType === 'check'" :value="knowledgeListParams.catgoryType" :snycModel.sync="knowledgeListParams.catgoryType"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="知识搜索:">
            <el-input v-model="knowledgeListParams.knowledgeTitle" placeholder="请输入搜索名"></el-input>
          </el-form-item>
          <el-form-item label="产品类型:">
            <GetPlatformDict  :dictType = "'projectType'" :disabled="dialogHandleType === 'check'" :value="knowledgeListParams.projectType" :snycModel.sync="knowledgeListParams.projectType"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="重要程度:" prop="importantStatus">
            <GetPlatformDict  :dictType = "'importantStatus'" :disabled="dialogHandleType === 'check'" :value="knowledgeListParams.importantStatus" :snycModel.sync="knowledgeListParams.importantStatus"></GetPlatformDict>
          </el-form-item>
          <el-form-item label="关联方式" prop="associationType">
            <el-select v-model="knowledgeListParams.associationType">
              <el-option label="关联工作" :value="1"></el-option>
              <el-option label="关联项目" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择项目" v-if="knowledgeListParams.associationType===0" prop="projectId">
            <projectSelect
              @selectData="selectData"
              :value="knowledgeListParams.projectId"
              :snycModel.sync="knowledgeListParams.projectId"/>
          </el-form-item>
          <el-form-item label="选择工作" v-if="knowledgeListParams.associationType===1" prop="relatedWork">
            <GetPlatformDict
              :dictType="'relatedWork'"
              :value="knowledgeListParams.relatedWork"
              :snycModel.sync="knowledgeListParams.relatedWork"/>
          </el-form-item>

          <el-form-item label="创建人:">
            <el-input v-model="knowledgeListParams.creatorId" placeholder="请输入创建人"></el-input>
          </el-form-item>
          <el-form-item label="所属部门:">
            <organizationSelect @selectChange="orgChange" :value="knowledgeListParams.organizationId"/>
          </el-form-item>
          <!-- <el-form-item class="searchBtn"> -->
             <el-form-item class="fr">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onRest">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row class="mb-20">
          <div class="fr">
            <el-button type="primary" @click="createTheme" v-if="permButton('3101')">创建主题</el-button>
          </div>
        </el-row>
        <!-- 知识管理列表 -->
        <el-card v-for="(v,n) in knowledgeData" shadow="never">
          <el-col :span="24" :inline="true" class="line1">
            <el-col :span="2" style="padding: 0">
              <el-tag type="success" v-if="v.hstoneProject">{{v.hstoneProject.projectTypeDictionary.value}}</el-tag>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <el-tag v-if="v.hstoneProject">{{v.hstoneProject.projectName}}</el-tag>
            </el-col>
            <el-col :span="10">
              <span>{{v.title}}</span>
            </el-col>
            <el-col :span="2">
              <span>{{v.hstoneEmployee.name}}</span>
            </el-col>
            <el-col :span="6" style="text-align: right">
              <template v-if="v.hstoneEmployee.hstoneEmployeePosition.length>0">
                <span v-for="(tem,n) in v.hstoneEmployee.hstoneEmployeePosition">{{tem.organization.fullName}}<span v-if="n < v.hstoneEmployee.hstoneEmployeePosition.length - 1">;</span></span>
              </template>
            </el-col>
          </el-col>
          <el-col :span="24" class="line2">
            <el-col :span="4">
              <span>内容类型：{{v.catgoryType | dict('catgoryType')}}</span>
            </el-col>
            <el-col :span="4">
              <span>重要度：{{v.importantStatus | dict('importantStatus')}}</span>
            </el-col>
            <el-col :span="4">
              <span>知识数量：{{v.depositoriesCount}}</span>
            </el-col>
            <el-col :span="4">
              <span>{{v.createTime | dateFormatYmdHms}}</span>
            </el-col>
            <el-col :span="8" class="work" style="text-align: right">
              <span @click="details(v)" v-if="permButton('3102')">详情</span>
<!--              <span>操作日志</span>-->
              <span @click="edit(v)" v-if="permButton('3105')">编辑</span>
            </el-col>
          </el-col>
        </el-card>
        <div v-if="knowledgeData.length === 0">
          <el-divider content-position="center">查询数据为空</el-divider>
        </div>
        <Pager
          :total="knowledgeListParams.total"
          :pageTotalChange="handleSizeChange"
          :size="knowledgeListParams.size"
          :current="knowledgeListParams.page"
          :pageChange="pageChange"></Pager>
      </el-tab-pane>
      <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { knowledgeListPage } from '@/api/knowledge'
import ContentDialog from './ContentDialog'
export default {
  name: 'knowledge',
  components: {
    ContentDialog
  },
  beforeUpdate() {},
  data() {
    return {
      placeVal: [],
      activeName: 'first',
      dialogHandleType: 'add',
      knowledgeListParams: {
        projectId: '',
        relatedWork: '',
        title: '',
        knowledgeTitle: '',
        projectType: null,
        catgoryType: null,
        organizationId: '',
        importantStatus: null,
        creatorId: '',
        associationType: null,
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      },
      knowledgeData: [],
    };
  },
  created(){
      this.fetchTableData()
  },
  methods: {
    permButton(v){
      let f = ''
      if(getPerm().indexOf(v) === -1){
        f = false
      }else {
        f = true
      }
      return f
    },
    orgChange(v) {
      this.knowledgeListParams.organizationId = v.id;
    },
    details(v) {
        let vm = this
        vm.$router.push('/business/knowledge/science/' + v.id)
    },
    selectData(v){
        this.knowledgeListParams.projectId = v.id
    },
    // 选择查询组织ID
    orgChanges(v){
      this.knowledgeListParams.id = v.id;
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.knowledgeListParams.regionTreeCode = v[v.length-1].treeCode
    },
    handleSizeChange(v) {
      this.knowledgeListParams.size = v;
      this.fetchTableData();
    },
    pageChange(v) {
      this.knowledgeListParams.page = v;
      this.fetchTableData();
    },
    async fetchTableData() {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在查询...'
      });
      try {
        let data = await knowledgeListPage(vm.knowledgeListParams)
        vm.knowledgeData = data.data
        vm.knowledgeListParams.total = data.total
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    // 搜索
    onSearch() {
      this.knowledgeListParams.page = 1;
      this.fetchTableData();
    },
    // 重置
    onRest() {
      let vm = this;
      vm.knowledgeListParams = {
        projectId: '',
        relatedWork: '',
        title: '',
        knowledgeTitle: '',
        projectType: null,
        catgoryType: null,
        organizationId: '',
        importantStatus: null,
        creatorId: '',
        associationType: '',
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      }
      vm.fetchTableData()
    },
    createTheme() {
      let vm = this
      vm.dialogHandleType = 'add'
      vm.$refs['dialog'].show()
    },
    refreshTable (v) {
      let vm = this
      vm.knowledgeListParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
    },
    // 查看
    check(row) {
      let vm = this
      vm.dialogHandleType = 'check'
      vm.$refs['checkDialog'].setFormDatas(row)
      vm.$refs['checkDialog'].show()
    },
    edit(row) {
      let vm = this
      vm.dialogHandleType = 'edit'
      vm.$refs['dialog'].setFormDatas(row)
      vm.$refs['dialog'].show()
    },
  }
};
</script>

<style lang="scss" scoped>
  // .searchBtn{
  //   margin-left: 340px;
  // }
  .search {
    padding: 10px;
    height: 250px;
    border-bottom: 1px solid #c1c1c1;
    .el-button {
      margin: 20px;
    }
    .el-input {
      width: 150px;
      .el-button {
        position: relative;
        background-color: royalblue;
        left: 50px;
      }
    }
    .el-col {
      height: 50px;
    }
  }
  .line1{
    div{padding: 8px;}
  }
  .line1,
  .line2 {
    padding: 10px;
  }
  .el-card {
    margin: 10px 0px;
  }
  .btn {
    text-align: right;
  }
  .addBtn {
    margin: 15px 0px;
  }
  .searchLine {
    position: relative;
    left: -80px;
  }
  .line2 > div.work {
    text-align: right;
    span {
      color: green;
      cursor: pointer;
      margin-left: 5px;
    }
    span:hover{
      color: #409eff;
    }
  }
</style>
<style>
  .el-card__body{
    overflow: hidden;
  }
</style>
