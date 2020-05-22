<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @open="onOpen"
    class="myDialog">
    <el-form ref="addDialogFrom" :model="formParams" :rules="rules" label-width="140px" style="padding: 0 10px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="员工姓名:" prop="employeeId">
            <memberSelect v-if="dialogHandleType === 'add'" :snycModel.sync="formParams.employeeId" :value="formParams.employeeId"/>
            <span v-if="dialogHandleType === 'edit' || dialogHandleType === 'check'">{{formParams.employeeName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资标准:" prop="salaryStandard" class="num">
            <el-input v-model.number="formParams.salaryStandard" type="number" placeholder="薪资标准"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="num">
          <el-form-item label="人力成本(元/小时):" prop="humanCost" >
            <el-input v-model.number="formParams.humanCost" type="number" placeholder="人力成本"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计薪日期:" prop="applyDate">
            <el-date-picker
              v-model="formParams.applyDate"
              value-format="yyyy-MM-dd"
              placeholder="计薪日期"
              :picker-options="endPickerOptions"
              type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明:">
            <el-input type="textarea" rows="4" placeholder="请输入说明" v-model="formParams.details"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" type="primary" @click="handleAdd()" v-if="dialogHandleType === 'add'">确认创建</el-button>
      <el-button class="button" type="primary" @click="handleEdit()" v-if="dialogHandleType === 'edit'">保存修改</el-button>
      <el-button class="button" type="primary" @click="handleAdds()" v-if="dialogHandleType === 'check'">调薪</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getUser } from '@/utils/auth'
import { salaryAdd, salaryEdit } from '@/api/salary'
import * as moment from 'moment';
import _ from 'lodash'
const emptyForm = {
  employeeId: '',
  employeeName: '',
  salaryStandard: '',
  humanCost: '',
  applyDate: '',
  details: '',
  token: getUser().token,
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
      formParams: _.clone(emptyForm),
      token: getUser().token,
      menuNode: null,
      placeVal: [],
      endPickerOptions: {
        disabledDate: (time) => {
          let vm = this
          if (vm.dialogHandleType === 'add') {
            return null
          } else {
            return time.getTime() < Date.now()
          }
        }
      },
      rules: {
        employeeId: [
          { required: true, message: '请选择员工', trigger: 'blur' }
        ],
        salaryStandard: [
          { required: true, message: '请输入薪资标准', trigger: 'blur' }
        ],
        humanCost: [
          { required: true, message: '请输入人力成本', trigger: 'blur' }
        ],
        applyDate: [
          { required: true, message: '请选择计薪日期', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
  },
  computed: {
    title () {
      if(this.dialogHandleType === 'check'){
        this.formParams.applyDate = moment(Date.now() + 3600 * 1000 * 24).format('YYYY-MM-DD')
      }
      return this.dialogHandleType === 'add' ? '创建薪酬' : this.dialogHandleType === 'edit' ? '编辑薪酬' : '调薪'
    }
  },
  methods: {
    onOpen () {
      let vm = this
      if (vm.dialogHandleType === 'add') {
        vm.formParams = Object.assign({}, emptyForm)
        vm.placeVal = []
        vm.$nextTick(() => {
          vm.$refs['addDialogFrom'].clearValidate()
        })
      }
    },
    async setFormDatas (data) {
      let vm = this
      vm.placeVal = []
      vm.formParams = {
        id: data.id,
        employeeId: data.employeeId,
        employeeName: data.employee.name,
        salaryStandard: data.salaryStandard,
        humanCost: data.humanCost,
        applyDate: data.applyDate,
        details: data.details,
        token: getUser().token,
      }
    },
    handleAdd () {
      let vm = this
      vm.formParams.token = getUser().token
      const loading = vm.$loading({
        lock: true,
        text: '正在创建薪酬...'
      });
      try {
        vm.$refs.addDialogFrom.validate().then( async() => {
          await salaryAdd(vm.formParams)
          vm.$emit('success')
          vm.$message.success('创建成功')
          vm.loading = false
        })
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    handleEdit () {
      let vm = this
      const loading = vm.$loading({
        lock: true,
        text: '正在编辑薪酬...'
      });
      try {
        vm.$refs.addDialogFrom.validate().then( async() => {
          await salaryEdit(vm.formParams)
          vm.$emit('success')
          vm.$message.success('编辑成功')
          vm.loading = false
        })
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
    handleAdds () {
      let vm = this
      vm.formParams.token = getUser().token
      const loading = vm.$loading({
        lock: true,
        text: '正在调薪...'
      });
      try {
        vm.$refs.addDialogFrom.validate().then( async() => {
          await salaryAdd(vm.formParams)
          vm.$emit('success')
          vm.$message.success('调薪成功')
          vm.loading = false
        })
      } catch (err) {
        console.log('页面加载失败，请刷新页面重试')
      } finally {
        loading.close()
      }
    },
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
  .myDialog .num .el-input__inner{
    padding-right: 0px;
  }
</style>

