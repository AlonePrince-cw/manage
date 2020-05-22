<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      ref="tabs"
    >
      <el-tab-pane label="组织管理" name="first">
        <!-- 组织管理筛选 -->
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
          :model="organizationListParams">
          <el-form-item label="组织名称:">
            <!--<organizationSelect @selectChange="orgChanges" :value="organizationListParams.id"/>-->
            <el-input v-model="organizationListParams.fullName" placeholder="请输入组织名称"></el-input>
          </el-form-item>
          <el-form-item label="所属地区:">
            <placeSelect @selectPlace="placeChange" :value="placeVal"/>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onRest">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row class="mb-20">
          <div class="fr">
            <el-button type="primary" @click="createOrg" v-if="permButton('110101')">创建组织</el-button>
          </div>
        </el-row>
        <!-- 组织管理列表 -->
        <!--<vue-ueditor-wrap v-model="value" :config="config"></vue-ueditor-wrap>-->
        <el-table border :data="organizationData">
          <el-table-column prop="fullName" label="组织名称" align="center"></el-table-column>
          <el-table-column prop="parentName" label="上级组织" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.hstoneOrganization">{{scope.row.hstoneOrganization.name}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="regionName" label="所属地区" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.hstoneRegion">{{scope.row.hstoneRegion.name}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="组织类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.typeDictionary">{{scope.row.typeDictionary.value}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="employeeName" label="组织负责人" align="center" width="250px">
            <template slot-scope="scope">
              <span v-if="scope.row.hstoneOrganizationPrincipals.length>0">
                <span v-for="v in scope.row.hstoneOrganizationPrincipals" :key="v.id">
                  {{v.hstoneEmployee.name}}({{scope.row.level}})
                </span>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="280px">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="set(scope.row)" v-if="permButton('110107')">设置负责人</el-button>
              <el-button size="small" type="text" @click="check(scope.row)" v-if="permButton('4103')">查看</el-button>
              <el-button size="small" type="text" @click="update(scope.row)" v-if="permButton('110103')">编辑</el-button>
              <!--<el-button size="small" type="text" @click="addTab()">操作日志</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <Pager
          :total="organizationListParams.total"
          :pageTotalChange="handleSizeChange"
          :size="organizationListParams.size"
          :current="organizationListParams.page"
          :pageChange="pageChange"></Pager>
      </el-tab-pane>
      <!-- 设置负责人 -->
      <el-dialog :visible.sync="setPeople" title="设置负责人" width="500px" >
        <el-form style="padding: 0px 12px 0 12px;" ref="setManager" label-width="120px" :rules="rules" :model="setManagerParams">
          <el-row>
            <el-col :span="24">
              <el-form-item label="组织名称:">{{setManagerParams.organizationName}}</el-form-item>
            </el-col>
            <!-- 设置一级负责人 -->
            <el-col :span="24">
              <el-form-item label="设置负责人:"><p>一级</p></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="员工:" prop="employeeId">
                <memberSelect :snycModel.sync="setManagerParams.employeeId" :value="setManagerParams.employeeId"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialogFooter">
          <el-button type="primary" @click="submitSet">提交</el-button>
        </div>
      </el-dialog>
      <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
      <ContentViewDialog ref="checkDialog"></ContentViewDialog>
    </el-tabs>
  </div>
</template>

<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { organizationListPage, orgSetManager } from '@/api/organization'
import ContentViewDialog from './ContentViewDialog'
import ContentDialog from './ContentDialog'
export default {
  name: 'organization',
  components: {
    ContentDialog, ContentViewDialog
  },
  beforeUpdate() {},
  data() {
    return {
      placeVal: [],
      activeName: 'first',
      dialogHandleType: 'add',
      setPeople: false,
      setManagerParams: {
        organizationId: '',
        organizationName: '',
        employeeId: '',
        level: 1,
        token: getUser().token
      },
      organizationListParams: {
        id: '',
        fullName: '',
        regionTreeCode: '',
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      },
      organizationData: [],
      rules: {
        employeeId: [{ required: true, message: "请选择员工", trigger: "blur" }]
      },
      config: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: this.$store.state.BASE_API+this.$store.state.uploadPrefix+`/api/home/getConfig`,
        serverFileUrl: `${process.env.VUE_APP_BASE_API}/hstone/api/home/file/upload/`,//自定义文件上传路径
        serverUrlPrefix: `${process.env.VUE_APP_BASE_API}`, //富文本文件访问前缀
        serverToken: getUser().token,
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/ueditor/'
      },
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
    submitSet() {
      let vm = this
        vm.$refs['setManager'].validate().then(async () => { // 表单验证
          const loading = this.$loading({
            lock: true,
            text: '正在设置...'
          })
          try {
            await orgSetManager(vm.setManagerParams)
            vm.$message.success('设置成功')
            vm.setPeople = false
            vm.fetchTableData()
          } catch (err) {
              console.log(err)
          } finally {
              loading.close()
          }
        }, _.noop)
    },
    // 选择查询组织ID
    orgChanges(v){
      this.organizationListParams.id = v.id;
    },
    // 选择地区查询
    placeChange(v){
      let vm = this
      vm.organizationListParams.regionTreeCode = v[v.length-1].treeCode
    },
    handleSizeChange(v) {
      this.organizationListParams.size = v;
      this.fetchTableData();
    },
    pageChange(v) {
      this.organizationListParams.page = v;
      this.fetchTableData();
    },
    async fetchTableData() {
        let vm = this
        let data = await organizationListPage(vm.organizationListParams)
        vm.organizationData = data.data
        vm.organizationListParams.total = data.total
    },
    // 搜索
    onSearch() {
      this.organizationListParams.page = 1;
      this.fetchTableData();
    },
    // 重置
    onRest() {
      let vm = this;
      vm.organizationListParams.regionTreeCode = null;
      vm.organizationListParams.id = null;
      vm.organizationListParams.fullName = '';
      vm.organizationListParams.page = 1;
      vm.placeVal = []
      vm.fetchTableData()
    },
    createOrg() {
      let vm = this
      vm.dialogHandleType = 'add'
      vm.$refs['dialog'].show()
    },
    refreshTable (v) {
      let vm = this
      vm.organizationListParams.page = 1
      vm.fetchTableData()
      vm.$refs['dialog'].hide()
    },
    set(row) {
      let vm = this
      vm.setManagerParams.organizationId = row.id
      vm.setManagerParams.organizationName = row.name
      if(row.hstoneOrganizationPrincipals.length>0){
        vm.setManagerParams.employeeId = row.hstoneOrganizationPrincipals[0].hstoneEmployee.id
      }else {
        vm.setManagerParams.employeeId = ''
      }
      vm.setPeople = true
    },
    // 查看
    check(row) {
      let vm = this
      vm.dialogHandleType = 'check'
      vm.$refs['checkDialog'].setFormDatas(row)
      vm.$refs['checkDialog'].show()
    },
    update(row) {
      let vm = this
      vm.dialogHandleType = 'edit'
      vm.$refs['dialog'].setFormDatas(row)
      vm.$refs['dialog'].show()
    },
  }
};
</script>

<style lang="scss" scoped>
</style>