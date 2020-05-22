<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @open="onOpen"
    class="myDialog">
    <el-form ref="searchParams" :model="searchParams" :rules="rules" label-width="140px" style="padding: 0 10px;">
      <el-row>              
        <el-col :span="12">
          <el-form-item label="开票时间：" prop="invoiceTime">
            <el-date-picker
              v-model="searchParams.invoiceTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开票金额：" prop="invoiceAmount">
              <el-input v-model.number="searchParams.invoiceAmount" placeholder="请输入金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预期税金:" class="meneyArea" prop="expectedTax">
            <el-input v-model.number="searchParams.expectedTax" placeholder="请输入金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计收款时间：" prop="expectedTimeOfCollection">
            <el-date-picker
              v-model="searchParams.expectedTimeOfCollection"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="组织类型:" prop="type">
            <GetPlatformDict  :dictType = "'organizationType'" :disabled="dialogHandleType === 'check'" :value="fromParams.type" :snycModel.sync="fromParams.type"></GetPlatformDict>
          </el-form-item> -->
            <el-form-item label="关联方式" prop="associationType">
            <el-select v-model="searchParams.associationType">
              <el-option label="关联工作" :value="1"></el-option>
              <el-option label="关联项目" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择项目" v-if="searchParams.associationType===0">
            <projectSelect
              :value="searchParams.projectId"
              :snycModel.sync="searchParams.projectId"
            />
          </el-form-item>
          <el-form-item label="选择工作" v-if="searchParams.associationType===1">
            <GetPlatformDict
              :dictType="'relatedWork'"
              :value="searchParams.relatedWork"
              :snycModel.sync="searchParams.relatedWork"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" prop="details">
            <el-input type="textarea" rows="4" placeholder="请输入备注"
              v-model="searchParams.details"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
                    <el-form-item label="项目附件:" label-width="145px">
                        <div class="form-uploader">
                            <div class="form-uploader-button" @click="showUploaders('attachment')">
                                <div><i class="form-uploader-icon el-icon-plus"/></div>
                                <div>上传</div>
                            </div>
                            <div class="form-uploader-result"
                                 v-if="attachmentFiles.length > 0">
                                <div class="uploaded-number">
                                    {{attachmentFiles.length}}个
                                </div>
                                <img class="img-cover" src="@/assets/word.jpeg" alt="">
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
      </el-row>
    </el-form>
    <Uploader
      ref="uploaders"
      :title="'附件上传'"
      target="meta"
      :limt="10"
      :token="token"
      :file-type="'0'"
      @confirm="onUploadConfirms" />
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add' && permButton('71010101')">确认创建</el-button>
      <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit' && permButton('71010103')">保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import {addBillingrecord,modifyBillingrecord} from "@/api/invoiceRecording"
import _ from 'lodash'
const emptyForm = {
        invoiceStartTime:"" ,//开票开始时间
        expectedTax:"",//预期税金
        invoiceAmount:"",//开票金额
        invoiceEndTime:"",//开票结束时间
        expectedStartTimeOfCollection:"",//	收款开始时间
        expectedEndTimeOfCollection:"",//收款结束时间
        expectedTimeOfCollection:"",//预计收款时间
        invoiceStartAmount: "", //金额开始时间
        invoiceEndAmount: "", //	金额结束时间
        expectedStartTax:"",//预期开始税金
        expectedEndTax:"",//预期结束税金
        financialStatus: "", //财务有效性（0-有效，1-无效）
        associationType: null,//	关联类型（0-项目，1-工作）
        projectId: "", //	关联项目id
        relatedWork: null, //	关联工作
        invoiceTime:"",//开票时间
        hstoneFileEntityRelas:[],//保存后台返回文件的
        details:"",//备注
        id:"",//主键ID
}
export default {
  mixins: [DialogMixin],
  props: {
    dialogHandleType: {
      type: String,
      default: 'add'
    },
    dialogType: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      rules: {
        expenseAmount: [
            { required: true, type: 'number',message: '税金不能为空并且必须为数字值',trigger: 'blur'},
        ],
        // details: [
        //     { required: true, message: '请输入备注', trigger: 'blur' },
        // ],
          invoiceAmount: [
              { required: true, message: '请输入开票金额', trigger: 'blur' },
          ],
          expectedTax: [
              { required: true, message: '请输入预期税金', trigger: 'blur' },
          ],
          expectedTimeOfCollection: [
              { type: 'string', required: true, message: '请选择收款时间', trigger: 'change' }
          ],
         occurTime: [
            { type: 'string', required: true, message: '请选择日期时间', trigger: 'change' }
          ],
          associationType: [
            { required: true, message: '请选择类型', trigger: 'blur' },
          ],
          expenseType:[
             { required: true, message: '请填写开票金额', trigger: 'blur' },
          ],
          invoiceTime:[
          { required: true, message: '请填写开票时间', trigger: 'blur' },
      ],
      },
      attachmentFiles:[],
      attachmentUpdataFile:[],
      searchParams: _.clone(emptyForm),
      token: getUser().token,
      menuNode: null,
      placeVal: [],
    }
  },
  created () {
  },
  computed: {
    title () {
      return this.dialogHandleType === 'add' ? '创建开票记录' : this.dialogHandleType === 'edit' ? '修改开票记录' : '创建开票记录'
    },

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
     showUploaders (type) {
        this.uploadType = type
        if (type === 'video') {
          this.$refs['uploaders'].show(this.videoFiles)
        }
        if (type === 'tvVideo') {
          this.$refs['uploaders'].show(this.tvFiles)
        }
        if (type === 'attachment') {
          this.$refs['uploaders'].show(this.attachmentFiles)
        }
      },
    onOpen () {
      if (this.dialogHandleType === 'add') {
        this.searchParams = Object.assign({}, emptyForm)
        this.placeVal = []
        this.attachmentFiles = []
        this.$nextTick(() => {
          this.$refs['searchParams'].clearValidate()
        })
      }
    },
    async setFormDatas (data) {
      let vm = this
      vm.imageFiles = []
      vm.placeVal = []
      console.log(data)
      vm.searchParams = {
        id: data.id,
        name: data.name,
        invoiceTime:data.invoiceTime,
        expenseType:data.expenseType?data.expenseType.toString():'',
        invoiceAmount:data.invoiceAmount,
        associationType:data.associationType,
        projectId:data.projectId,
        expectedTax:data.expectedTax,
        hstoneFileEntityRelas:[],
        expectedTimeOfCollection:data.expectedTimeOfCollection,
        relatedWork:data.relatedWork?data.relatedWork.toString():null,
        details:data.details,
      }
      if (data.hstoneFileEntityRelas.length > 0) {
          vm.attachmentFiles=[]
        data.hstoneFileEntityRelas.forEach(key => {
          vm.attachmentFiles.push({
            id: key.id,
            name: key.fileName,
            fileName: key.fileName,
              originalName:key.fileName,
            fileId: key.fileId,
            part: key.part,
            uniqueCode: key.fileCode
          })
        })
      }
      console.log(vm.attachmentFiles)
    },
    async onUploadConfirms (v) {
        let vm = this
        if (vm.uploadType === 'video') {
            vm.videoFiles = v
        } else if (vm.uploadType === 'tvVideo') {
            vm.tvFiles = v
        } else{
            vm.attachmentFiles = v
        }
    },
    handleAdd () {
      let vm = this
      vm.searchParams.token = getUser().token
      vm.loading = true
      vm.$refs.searchParams.validate().then( async() => {
          vm.attachmentFiles.forEach(function (v) {
              vm.searchParams.hstoneFileEntityRelas.push({
                  fileCode: v.uniqueCode,
                  fileId: v.id,
                  fileName: v.originalName,
                  part: '08'
              })
          })
        await addBillingrecord(vm.searchParams)
        vm.loading = false
        vm.$message.success('创建成功')
        vm.$emit('success')
      })

    },
    handleEdit () {
      let vm = this
      vm.loading = true
      vm.searchParams.token = getUser().token
      vm.$refs.searchParams.validate().then( async() => {
          vm.attachmentFiles.forEach(function(v) {
              vm.searchParams.hstoneFileEntityRelas.push({
                  fileCode: v.uniqueCode,
                  fileId: v.id,
                  fileName: v.originalName,
                  part: "08"
              });
          });
        await modifyBillingrecord(vm.searchParams)
        vm.loading = false
        vm.$message.success('修改成功')
        vm.$emit('success')
      })
      // alert(1)
    }
  }
}
</script>
<style lang="scss">
  .myDialog {
    .el-dialog__body{
      padding-left: 0px;
    }
    .el-input-number{
      width: 100%;
      .el-input__inner{
        text-align: left;
      }
    }
    .el-date-editor{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
  }
</style>
