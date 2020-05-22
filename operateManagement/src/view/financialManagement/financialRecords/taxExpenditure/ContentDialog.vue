<template>
  <el-dialog :visible.sync="visible" :title="title" width="800px" @open="onOpen" class="myDialog">
    <el-form
      ref="searchParams"
      :model="searchParams"
      :rules="rules"
      label-width="140px"
      style="padding: 0 10px;"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="发生时间：" prop="occurTime">
            <el-date-picker
              v-model="searchParams.occurTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="税务金额：" prop="taxAmount">
            <el-input v-model.number="searchParams.taxAmount" placeholder="请输入金额"></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="成本类型：">-->
<!--            <GetPlatformDict-->
<!--              :dictType="'costType'"-->
<!--              :value="searchParams.costType"-->
<!--              :snycModel.sync="searchParams.costType"-->
<!--            ></GetPlatformDict>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <!-- <el-col :span="12">
          <el-form-item label="报销人:" prop="employeeId">
            <memberSelect
              :snycModel.sync="searchParams.employeeId"
              :value="searchParams.employeeId"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
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
            <el-input type="textarea" rows="4" placeholder="请输入备注" v-model="searchParams.details"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目附件:" label-width="145px">
            <div class="form-uploader">
              <div class="form-uploader-button" @click="showUploaders('attachment')">
                <div>
                  <i class="form-uploader-icon el-icon-plus" />
                </div>
                <div>上传</div>
              </div>
              <div class="form-uploader-result" v-if="attachmentFiles.length > 0">
                <div class="uploaded-number">{{attachmentFiles.length}}个</div>
                <img class="img-cover" src="@/assets/word.jpeg" alt />
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
      @confirm="onUploadConfirms"
    />
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button
        class="button"
        type="primary"
        @click="handleAdd()"
        v-if="dialogHandleType === 'add' && permButton('71010501')"
      >确认创建</el-button>
      <el-button
        class="button"
        type="primary"
        @click="handleEdit()"
        v-if="dialogHandleType === 'edit' && permButton('71010503')"
      >保存修改</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from "@/mixins/dialog";
import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
import { taxExpenditure, taxExpenditureEdit } from "@/api/taxExpenditure";
import _ from "lodash";
const emptyForm = {
  occurTime:"",//发生时间
  taxAmount:"",//税务金额
  // costType:"",//成本分类
  financialStatus: "", //财务有效性（0-有效，1-无效）
  associationType: null, //	关联类型（0-项目，1-工作）
  projectId: null, //	关联项目id
  relatedWork: null, //	关联工作
  hstoneFileEntityRelas: [], //保存后台返回文件的
  details: "", //备注
  id: "" //主键ID
};
export default {
  mixins: [DialogMixin],
  props: {
    dialogHandleType: {
      type: String,
      default: "add"
    },
    dialogType: {
      type: String,
      default: "text"
    }
  },
  data() {
    return {
      rules: {
        expenseAmount: [
          {
            required: true,
            type: "number",
            message: "税金不能为空并且必须为数字值",
            trigger: "blur"
          }
        ],
        details: [{ required: true, message: "请输入备注哦", trigger: "blur" }],
        occurTime: [
          {
            type: "string",
            required: true,
            message: "请选择日期时间",
            trigger: "change"
          }
        ],
        associationType: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        taxAmount: [
          { required: true, message: "请填写税务金额", trigger: "blur" }
        ]
      },
      attachmentFiles: [],
      attachmentUpdataFile: [],
      searchParams: _.clone(emptyForm),
      token: getUser().token,
      menuNode: null,
      placeVal: []
    };
  },
  created() {},
  computed: {
    title() {
      return this.dialogHandleType === "add"
        ? "创建税务记录"
        : this.dialogHandleType === "edit"
        ? "修改税务支出"
        : "创建税务记录";
    }
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
    showUploaders(type) {
      this.uploadType = type;
      if (type === "video") {
        this.$refs["uploaders"].show(this.videoFiles);
      }
      if (type === "tvVideo") {
        this.$refs["uploaders"].show(this.tvFiles);
      }
      if (type === "attachment") {
        this.$refs["uploaders"].show(this.attachmentFiles);
      }
    },
    onOpen() {
      if (this.dialogHandleType === "add") {
        this.searchParams = Object.assign({}, emptyForm);
        this.placeVal = [];
        this.attachmentFiles = [];
        this.$nextTick(() => {
          this.$refs["searchParams"].clearValidate();
        });
      }
    },
    async setFormDatas(data) {
      let vm = this;
      vm.imageFiles = [];
      vm.placeVal = [];
      console.log(data);
      vm.searchParams = {
        id: data.id,
        occurTime:data.occurTime,
        taxAmount:data.taxAmount,
        costType: data.costType ? data.costType.toString() : "",
        associationType: data.associationType,
        projectId: data.projectId,
        expectedTax: data.expectedTax,
        hstoneFileEntityRelas: [],
        expectedTimeOfCollection: data.expectedTimeOfCollection,
        relatedWork: data.relatedWork ? data.relatedWork.toString() : null,
        details: data.details
      };
      if (data.hstoneFileEntityRelas.length > 0) {
        vm.attachmentFiles = [];
        data.hstoneFileEntityRelas.forEach(key => {
          vm.attachmentFiles.push({
            id: key.id,
            name: key.fileName,
            fileName: key.fileName,
            originalName:key.fileName,
            fileId: key.fileId,
            part: key.part,
            uniqueCode: key.fileCode
          });
        });
      }
      console.log(vm.attachmentFiles);
    },
    async onUploadConfirms(v) {
      let vm = this;
      if (vm.uploadType === "video") {
        vm.videoFiles = v;
      } else if (vm.uploadType === "tvVideo") {
        vm.tvFiles = v;
      } else {
        vm.attachmentFiles = v;
      }
    },
    handleAdd() {
      let vm = this;
      vm.searchParams.token = getUser().token;
      vm.loading = true;
      vm.$refs.searchParams.validate().then(async () => {
        vm.attachmentFiles.forEach(function(v) {
          vm.searchParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: "08"
          });
        });
        await taxExpenditure(vm.searchParams);
        vm.loading = false;
        vm.$message.success("创建成功");
        vm.$emit("success");
      });
    },
    handleEdit() {
      let vm = this;
      vm.searchParams.token = getUser().token;
      vm.loading = true;
      vm.$refs.searchParams.validate().then(async () => {
        vm.attachmentFiles.forEach(function(v) {
          vm.searchParams.hstoneFileEntityRelas.push({
            fileCode: v.uniqueCode,
            fileId: v.id,
            fileName: v.originalName,
            part: "08"
          });
        });
        await taxExpenditureEdit(vm.searchParams);
        vm.loading = false;
        vm.$message.success("修改成功");
        vm.$emit("success");
      });
      // alert(1)
    }
  }
};
</script>
<style lang="scss">
.myDialog {
  .el-dialog__body {
    padding-left: 0px;
  }
  .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
  .el-date-editor {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
