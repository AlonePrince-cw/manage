<template>
  <div>
    <el-tabs type="border-card" v-model="targerName">
      <el-tab-pane label="字典管理" name="first">
        <el-form
          class="dz-toolbar"
          ref="searchForm"
          :inline="true"
          label-width="110px;"
          style="padding: 20px 12px 0 12px;"
        >
          <el-form-item label="字典选项名：" prop="value">
             <el-input v-model="searchParams.value" maxlength="20" placeholder="请输入字典选项名"></el-input>
          </el-form-item>
           <el-form-item label="状态：" prop="status">
            <el-select v-model="searchParams.status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="success" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="Reset">重置</el-button>
          </el-form-item>
          <div style="clear: both"></div>
        </el-form>
          <el-col :span="24">
              <div class="fl">
                  <el-button type="primary" @click="batchEnabled" class="reateBtn" v-if="permButton('9105')">批量启用</el-button>
                  <el-button type="primary" @click="batchDisable" class="reateBtn" v-if="permButton('9105')">批量禁用</el-button>
                  <el-button type="primary" @click="batchDeletion" class="reateBtn" v-if="permButton('9106')">批量删除</el-button>
              </div>
              <div class="fr">
                <el-button type="primary" @click="addClassification" class="reateBtn" v-if="permButton('9103')">添加分类</el-button>
                <el-button type="primary" @click="quickAddOptions" class="reateBtn" v-if="permButton('9103')">快捷添加选项</el-button>
              </div>
          </el-col>
        <el-table border
                  :data="expenseRecordData"
                  lazy
                  :row-key="getRowKey"
                  @selection-change="handleSelectionChange"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  :load="load">
          <el-table-column
                  type="selection"
                  width="55"
          align="center">
          </el-table-column>
          <el-table-column
                  label="排序"
                  prop="sortNum"
                  type=""
                  align="center"
                  width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sortNum" @blur="changeValue(scope.row)" v-if="permButton('9107')"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  label="字典选项名"
                  prop="value"
                  width="250"
                  :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
                label="标识"
                align="center"
                prop="type"
                width="250"
                :show-overflow-tooltip="true"
        ></el-table-column>
          <el-table-column
                  label="说明"
                  prop="typeName"
                  align="center"
                  width="300"
                  :show-overflow-tooltip="true"
          ></el-table-column>
           <el-table-column label="状态" :show-overflow-tooltip="true" width="100px" prop="status" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1" style="color: green"><i class="el-icon-check"></i></span>
              <span v-else style="color: red"><i class="el-icon-close"></i></span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="更新时间" width="200px" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.modifyTime | dateFormatYmdHms}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px" fixed="right" align="center">
            <template slot-scope="scope">
            <span v-if="scope.row.status ===1" style="margin-right: 5px;color: #CCCCCC"><el-button size="small" type="text" @click="update(scope.row)" v-if="permButton('9104')">编辑选项</el-button></span>
            <span v-if="scope.row.status ===1" style="margin-right: 5px;color: #CCCCCC"> <el-button size="small" type="text" @click="addSubordinate(scope.row)" v-if="permButton('9103')">添加下级</el-button></span>
              <el-button size="small" @click="deleData(scope.row)" v-if="permButton('9106')" type="text">删除</el-button>
              <el-button size="small" @click="enable(scope.row)" v-if="permButton('9105')" type="text">启用</el-button>
              <el-button size="small" @click="prohibit(scope.row)" v-if="permButton('9105')" type="text">禁用</el-button>
<!--              <el-button size="small" type="text" @click="journal(scope.row)">日志</el-button>-->
            </template>
          </el-table-column>
        </el-table>
<!--        <Pager :total="searchParams.total" :pageTotalChange="handleSizeChange" :size="searchParams.size" :current="searchParams.page" :pageChange="pageChange"></Pager>-->
      </el-tab-pane>
<!--      弹框-->
<!--      添加分类-->
      <el-dialog
              ref="isValidParams"
              title="添加字典分类"
              :visible.sync="dialogVisible"
              width="700px"
             >
            <el-form
               label-width="120px"
               ref="myForm"
               :model="isValidParams"
               :rules="rules"
               style="padding: 0 10px;"
            >
            <el-row>
              <el-col :span="12" style="margin-left: -25px;">
                <el-form-item label="分类名：" prop="value">
                  <el-input placeholder="请输入分类名" v-model="isValidParams.value" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标识：" prop="type">
                  <el-input placeholder="请输入标识" v-model="isValidParams.type" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-left: -25px;">
                <el-form-item label="说明:" prop="typeName">
                  <el-input type="textarea" rows="4" placeholder="请输入说明" v-model="isValidParams.typeName" maxlength="200"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            </el-form>
        <span slot="footer" class="dialog-footer">
          <div class="fl">
              <el-checkbox v-model="isValidParams.checked">不关闭继续添加</el-checkbox>
          </div>
           <el-button type="primary" @click="confirmSubmission">确定提交</el-button>
        </span>
      </el-dialog>
<!--        编辑-->
        <el-dialog
                ref="editData"
                title="编辑字典分类"
                :visible.sync="dialogVisibleEdit"
                width="700px"
        >
            <el-form
                    label-width="120px"
                    ref="myForm"
                    :model="editData"
                    style="padding: 0 10px;"
            >
                <el-row>
                    <el-col :span="12" style="margin-left: -25px;">
                        <el-form-item label="分类名：">
                            <el-input placeholder="请输入分类名" v-model="editData.value"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="标识：">
                            <el-input placeholder="请输入标识" v-model="editData.type" disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" style="margin-left: -25px;">
                        <el-form-item label="说明:">
                            <el-input type="textarea" rows="4" placeholder="请输入说明" v-model="editData.typeName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
<!--          <div class="fl">-->
<!--              <el-checkbox v-model="editData.checked">不关闭继续添加</el-checkbox>-->
<!--          </div>-->
           <el-button type="primary" @click="confirmSubmissionEdit">确定提交</el-button>
        </span>
        </el-dialog>
<!--      添加下级-->
      <el-dialog
              ref="dataValidParams"
              title="添加下级"
              :model="dataValidParams"
              :visible.sync="addSubordinateDialog"
              width="700px"
      >
        <el-form
                label-width="120px"
                :model="dataValidParams"
                :rules="rules"
                ref="dataValidParams"
                style="padding: 0 10px;"
        >
          <el-row>
            <el-col :span="24" style="margin-left: -25px;">
              <el-form-item label="上级级别：" style="width: 50%">
                <el-input placeholder="请输上级级别" v-model="dataValidParams.sortNum" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-left: -25px;">
              <el-form-item label="选项名：" prop="value">
                <el-input placeholder="请输入选项名" v-model="dataValidParams.value"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标识：">
                <el-input placeholder="请输入标识" v-model="dataValidParams.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-left: -25px;">
              <el-form-item label="说明:" prop="typeName">
                <el-input type="textarea" rows="4" placeholder="请输入说明" v-model="dataValidParams.typeName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
             <!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
          <div class="fl">
              <el-checkbox v-model="dataValidParams.checked">不关闭继续添加</el-checkbox>
          </div>
           <el-button type="primary" @click="addSubordinates">确定提交</el-button>
        </span>
      </el-dialog>
<!--添加快捷方式-->
      <el-dialog
              ref="isValidParams"
              title="添加快捷选项"
              :visible.sync="quickAddOptionsDialog"
              :model="isValidParams"
              width="700px"
      >
        <el-form
                label-width="120px"
                :model="isValidParams"
                :rules="rules"
                style="padding: 0 10px;"
        >
          <el-row>
            <el-col :span="24" style="margin-left: -25px;">
              <el-form-item label="所属字典：" style="width: 50%" prop="yarn">
                  <GetPlatformDicts :dictType = "''" :value="yarn" :snycModel.sync="yarn" @selectChange="selectChange"></GetPlatformDicts>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-left: -25px;">
              <el-form-item label="选项名：" prop="value">
                <el-input placeholder="请输入选项名" v-model="isValidParams.value" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标识：" prop="type">
                <el-input placeholder="请输入标识" maxlength="20" v-model="isValidParams.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-left: -25px;">
              <el-form-item label="说明:" prop="typeName">
                <el-input type="textarea" rows="4" placeholder="请输入说明" v-model="isValidParams.typeName" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
             <!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
          <div class="fl">
              <el-checkbox v-model="isValidParams.checked">不关闭继续添加</el-checkbox>
          </div>
           <el-button type="primary" @click="quickAddOptionsDialogs">确定提交</el-button>
        </span>
      </el-dialog>
    </el-tabs>
  </div>
</template>
<script>
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { dictionaryManagementPage, querySubordinate,newDictionaryValue,deleteDictionary,enableProhibit,changeValues,modifyDictionary} from "@/api/dictionaryManagement";
export default {
  name: "costRecord",
  data() {
    return {
        rules: {
            typeName: [
                { required: true, message: "请输入说明", trigger: "blur" },
            ],
            value: [
                { required: true, message: "请输入选项名", trigger: "blur" },
            ],
            type: [
                { required: true, message: "请输入标识", trigger: "blur" },
            ],
            yarn: [
                { required: true, message: "请选择所属组织", trigger: "blur" },
            ],
        },
      dialogVisible:false,
      addSubordinateDialog:false,
      quickAddOptionsDialog:false,
      dialogVisibleEdit:false,
      projectProp: null,
      token: getUser().token,
      dialogHandleType: "add",
      expenseRecordData: [],
      searchParams: {
        page: 1,
        id:'',
        type:null,
        value:'',
        size: 10,
        total: 0,
        status: null, //有效状态（0-有效，1-无效）
        token: getUser().token
      },
      targerName: "first",
      options: [
        {
          name: '启用',
          id: '1'
        },
        {
          name: '禁用',
          id: '0'
        }
      ],
      params:{
        token: getUser().token,
        id:''
      },
    //下拉的数组数据
      dropDownData:[],
      yarn:null,
      //添加分类的字段
      isValidParams : {
        type:null,
        id: "",
        isChild:'yes',
        // type:null,
        checked:false,
        value:'',
        typeName:'',
        status: "",
        // choose:0,
        token: getUser().token,
      },
    //添加下级的字段
        dataValidParams : {
            id: "",
            isChild:'yes',
            type:'',
            checked:false,
            value:null,
            typeName:'',
            token: getUser().token,
        },
    //编辑的参数
        editData:{
           id:'',
           type:'',
           value:null,
           typeName:'',
           checked:false,
           token:getUser().token,
        },
    //批量启用
      wocaolDOU:[],
      batchDisablesData:[]
    };
  },
  created() {
    this.fetchTableData();
  },
  methods: {
      getRowKey (row) {
          const id = row.id + row.type
          return id
      },
      selectChange(v){
          console.log(v)
          this.isValidParams.type = v.origin.type
          this.isValidParams.id = v.origin.id
          this.yarn = v.id
      },
      permButton(v){
          let f = ''
          if(getPerm().indexOf(v) === -1){
              f = false
          }else {
              f = true
          }
          return f
      },
      //日志
      journal(){

      },
      //批量禁用
      batchDisable(){
          let vm = this
          let isRepeat = false
          const batchDisables = {
              dictionaries:[],
              token:getUser().token,
              status:0,
          }
          vm.wocaolDOU.forEach((element)=>{
              console.log(element)
                  isRepeat = true
                  batchDisables.dictionaries.push({
                      id:element.id,
                      type:element.type
                  })
           })
          //禁用
          if(isRepeat=true){
              vm.$confirm(`是否批量禁用？`, '提示', {
                  type: 'warning'
              }).then(async () => {
                  const loading = this.$loading({
                      lock: true,
                      text: '正在禁用...'
                  })
                  try {
                      await enableProhibit(batchDisables)
                      vm.$emit('success')
                      vm.$message.warning('禁用成功')
                     vm.expenseRecordData =[]
                      vm.fetchTableData()
                  } catch (err) {
                  } finally {
                      loading.close()
                  }
              }, _.noop)
          }
      },
      //批量启用
      batchEnabled(){
          let vm = this
          let isRepeat = false
          const batchDisables = {
              dictionaries:[],
              token:getUser().token,
              status:1,
          }
          vm.wocaolDOU.forEach((element)=>{
                  isRepeat = true
                  batchDisables.dictionaries.push({
                      id:element.id,
                      type:element.type
                  })
          })
          //启用
          if(isRepeat=true){
              vm.$confirm(`是否批量启用？`, '提示', {
                  type: 'warning'
              }).then(async () => {
                  const loading = this.$loading({
                      lock: true,
                      text: '正在启用...'
                  })
                  try {
                      await enableProhibit(batchDisables)
                      vm.$emit('success')
                      vm.$message.success('启用成功')
                      vm.expenseRecordData =[]
                      vm.fetchTableData()
                  } catch (err) {
                  } finally {
                      loading.close()
                  }
              }, _.noop)
          }
      },
      //批量删除
      batchDeletion(){
          let vm = this
          let isRepeat = false
          const batchDisables = {
              dictionaries:[],
              token:getUser().token,
          }
          vm.wocaolDOU.forEach((element)=>{
                  isRepeat = true
                  batchDisables.dictionaries.push({
                      id:element.id,
                      type:element.type
                  })
          })
          //删除
          if(isRepeat=true){
              vm.$confirm(`是否批量删除？`, '提示', {
                  type: 'warning'
              }).then(async () => {
                  const loading = this.$loading({
                      lock: true,
                      text: '正在批量删除...'
                  })
                  try {
                      await deleteDictionary(batchDisables)
                      vm.$emit('success')
                      vm.$message.success('删除成功')
                      vm.fetchTableData()
                  } catch (err) {
                  } finally {
                      loading.close()
                  }
              }, _.noop)
          }
      },
      //input框失去焦点改变值
      changeValue(row){
          // this.$message.error('这是一条错误消息');
          let vm = this
          const changeValueData = {
                id:row.id,
                type:row.type,
                sortNum:row.sortNum,
                token:getUser().token,
          }
          //修改值
          vm.$confirm(`是否修改？`, '提示', {
              type: 'warning'
          }).then(async () => {
              const loading = this.$loading({
                  lock: true,
                  text: '正在修改...'
              })
              try {
                  await changeValues(changeValueData)
                  vm.$emit('success')
                  vm.$message.success('修改成功')
                  vm.fetchTableData()
              } catch (err) {
              } finally {
                  loading.close()
              }
          }, _.noop)
      },
    //  启用
      enable(row){
          // alert("启用")
          let vm = this
          const enableData = {
              dictionaries:[{id:row.id,type:row.type}],
              token:getUser().token,
              status:1,
          }
          //启用
          vm.$confirm(`是否启用？`, '提示', {
              type: 'warning'
          }).then(async () => {
              const loading = this.$loading({
                  lock: true,
                  text: '正在启用...'
              })
              try {
                  await enableProhibit(enableData)
                  vm.$emit('success')
                  vm.$message.success('启用成功')
                  vm.expenseRecordData = []
                  vm.fetchTableData()
              } catch (err) {
              } finally {
                  loading.close()
              }
          }, _.noop)

      },
    //  禁用
      prohibit(row){
          let vm = this
          const prohibitData = {
              dictionaries:[{id:row.id,type:row.type}],
              token:getUser().token,
              status:0,
          }
          //禁用
          vm.$confirm(`是否禁用？`, '提示', {
              type: 'warning'
          }).then(async () => {
              const loading = this.$loading({
                  lock: true,
                  text: '正在禁用...'
              })
              try {
                  await enableProhibit(prohibitData)
                  vm.$emit('success')
                  vm.$message.warning('禁用成功')
                  vm.expenseRecordData=[]
                  vm.fetchTableData()
          } catch (err) {
              } finally {
                  loading.close()
              }
          }, _.noop)
      },
    //删除
    deleData(row){
       let vm = this
       const resData = {
              dictionaries:[{id:row.id,type:row.type}],
              token:getUser().token,
            }
        //删除
        vm.$confirm(`该操作是物理删除！请谨慎使用！！！`, '提示', {
            type: 'warning'
        }).then(async () => {
            const loading = this.$loading({
                lock: true,
                text: '正在删除...'
            })
            try {
                await deleteDictionary(resData)
                vm.$emit('success')
                vm.$message.success('删除成功')
                vm.expenseRecordData = []
                vm.fetchTableData()
            } catch (err) {
            } finally {
                loading.close()
            }
        }, _.noop)
    },
    //  tableTree复选框发生改变时
    handleSelectionChange(val) {
       this.wocaolDOU = val
    },
    //  编辑
    async confirmSubmissionEdit(){
          let vm = this
          // vm.dialogVisible = false
          const loading = this.$loading({
              lock: true,
              text: '正在提交...'
          })
          try {
              const {data} =await modifyDictionary(vm.editData)
              if(vm.editData.checked){
                  vm.dialogVisibleEdit = true
              }else {
                  vm.dialogVisibleEdit = false
              }
              vm.$message.success('提交成功')
              vm.fetchTableData()
          } catch (err) {
              console.log(err)
          } finally {
              loading.close()
          }
      },
    //添加分类的提交
    async confirmSubmission(){
      let vm = this
      // vm.dialogVisible = false
          const loading = this.$loading({
            lock: true,
            text: '正在提交...'
          })
          try {
        const {data} =await newDictionaryValue(vm.isValidParams)
            if(vm.isValidParams.checked){
              vm.dialogVisible = true
            }else {
              vm.dialogVisible = false
            }
              vm.isValidParams = {
                  type:null,
                  // id: "",
                  isChild:'yes',
                  // type:null,
                  checked:true,
                  value:'',
                  typeName:'',
                  status: "",
              }
        vm.$message.success('提交成功')
        vm.fetchTableData()
      } catch (err) {
        console.log(err)
      } finally {
        loading.close()
      }
    },
    //  快捷添加按钮
    quickAddOptions(){
      this.quickAddOptionsDialog = true
      this.yarn = null
      this.isValidParams.type = null
      this.isValidParams.typeName = ''
      this.isValidParams.value = ''
    },
    //  快捷添加选项
    async quickAddOptionsDialogs(){
        let vm = this
      const loading = this.$loading({
        lock: true,
        text: '正在提交...'
      })
      try {
            vm.isValidParams.isChild = 'yes'
        const {data} =await newDictionaryValue(vm.isValidParams)
          console.log(vm.isValidParams.checked)
        if(vm.isValidParams.checked){
          vm.quickAddOptionsDialog = true
        }else {
          vm.quickAddOptionsDialog = false
        }
        vm.$message.success('提交成功')
        vm.isValidParams.type = null,
        vm.isValidParams.value = '',
        vm.isValidParams.typeName = '',
        vm.yarn = null
        vm.fetchTableData()
      } catch (err) {
        console.log(err)
      } finally {
        loading.close()
      }
    },
    //  点击添加分类
    addClassification(){
        this.isValidParams ={
            id: "",
            isChild:'no',
            type:null,
            checked:true,
            value:'',
            typeName:'',
            status: "",
            token: getUser().token,
        },
      this.dialogVisible = true
    },
    addSubordinate(row){
      this.isValidParams.sortNum= row.sortNum
      this.isValidParams.type = row.type
      this.isValidParams.value = row.value
      this.isValidParams.typeName = row.typeName
      this.dataValidParams.sortNum= row.sortNum
      this.dataValidParams.type = row.type
      this.dataValidParams.value = row.value
      this.dataValidParams.typeName = row.typeName
      this.dataValidParams.id = row.id
      this.isValidParams.status = row.status
      this.addSubordinateDialog = true
      this.dataValidParams.value = ''
      this.dataValidParams.typeName = ''
    },
    //添加下级
   async addSubordinates(){
     let vm = this
     // vm.dialogVisible = false
     const loading = this.$loading({
       lock: true,
       text: '正在提交...'
     })
     try {
       const {data} =await newDictionaryValue(vm.dataValidParams)
         console.log(vm.dataValidParams.checked)
       if(vm.dataValidParams.checked){
         vm.addSubordinateDialog = true
       }else {
         vm.addSubordinateDialog = false
       }
       vm.$message.success('提交成功')
       vm.dataValidParams.value = '',
       vm.dataValidParams.typeName = '',
       vm.dataValidParams.checked = true,
       vm.expenseRecordData = []
       vm.fetchTableData()
     } catch (err) {
       console.log(err)
     } finally {
       loading.close()
     }
   },
   //   渲染树
   async load(tree, treeNode, resolve) {
      let vm =this
      vm.centerDialogVisible = true
      let parmas = {
        id:tree.id,
        type:tree.type,
        token:getUser().token
      }
      const {data} = await dictionaryManagementPage(parmas)
      vm.dropDownData = data
      vm.dropDownData.forEach((ele)=>{
        ele.hasChildren = true
      })
      resolve(vm.dropDownData)
  },
   // 编辑
    update(row) {
          let vm = this;
          vm.dialogVisibleEdit = true
          vm.editData.id = row.id
          vm.editData.value = row.value
          vm.editData.type = row.type
          vm.editData.typeName = row.typeName
      },
    async fetchTableData() {
      let vm = this;
      // vm.expenseRecordData = []
      const loading = vm.$loading({
        lock: true,
        text: "正在查询..."
      });
      try {
        let data = await dictionaryManagementPage(vm.searchParams);
        vm.expenseRecordData = data.data;
        vm.searchParams.total = data.total;
        vm.expenseRecordData.forEach((element)=>{
        element.hasChildren = true
        })
      } catch (err) {
        console.log("页面加载失败，请刷新页面重试");
      } finally {
        loading.close();
      }
    },
    // 查询
    onSearch() {
      this.searchParams.page = 1;
      this.fetchTableData();
    },
    // 分页查询
    handleSizeChange(val) {
      let vm = this;
      vm.searchParams.size = val;
      vm.fetchTableData();
    },
    //改变页码
    pageChange(val) {
          let vm = this
          vm.searchParams.page = val
          vm.fetchTableData()
      },
    // 重置
    Reset() {
      this.searchParams = {
        page: 1,
        size: 10,
        total: 0,
        token: getUser().token
      };
      this.fetchTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.reportInfo {
  position: relative;
  .del {
    position: absolute;
    right: 0px;
    top: 0px;
    color: #f56c6c;
  }
}
.searchBtn {
  float: right;
  .el-button {
    margin-left: 15px;
  }
}

.btn {
  text-align: center;
  .el-button {
    padding: 10px 30px;
  }
}
.el-card {
  .el-button {
    margin: 0px;
  }
}
.search {
  padding: 10px;
  height: 190px;
  border-bottom: 1px solid #c1c1c1;
  .el-input,
  .el-select {
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
.selectWork {
  position: relative;
  left: -25px;
}
.work {
  position: relative;
  left: -10px;
}
.description {
  border-bottom: 1px solid #c1c1c1;
  padding: 10px;
  margin: 10px 0px;
}

.message {
  padding: 10px 0px;
  span {
    color: cornflowerblue;
  }
}
.replay {
  padding-right: 10px;
  margin-bottom: 10px;
}

.addFile {
  width: 100%;
  height: 150px;
  padding: 15px;
  border: 1px solid #eeeeee;
  img {
    width: 120px;
    height: 120px;
  }
}
.personCard {
  img {
    position: relative;
    top: -3px;
    width: 40px;
    height: 40px;
    border: 1px solid #eeeeee;
    border-radius: 40px;
  }
}
.read {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #c1c1c1;
}
.haveread {
  padding: 0px 10px;
  font-size: 16px;
  float: left;
  .el-icon-success {
    float: left;
    font-size: 36px;
    display: inline-block;
    height: 36px;
    width: 36px;
  }
  span {
    color: cornflowerblue;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0px 10px;
    float: left;
  }
}
.line2 {
  margin-top: 10px;
}
.line2 > span {
  border-right: 1px solid #eeeeee;
  padding: 5px 10px;
}
.line2 > span:last-child {
  border: none;
}
.file {
  position: relative;
  top: 10px;
}
.el-card {
  margin: 10px 0px;
}
.btn {
  .el-button {
    margin-right: 15px;
  }
}
.reateBtn {
  margin-bottom: 15px;
}
</style>
<style>
.el-card__body {
  overflow: hidden;
}
</style>