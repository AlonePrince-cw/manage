<template>
  <el-dialog
    :visible.sync="visible"
    title="查看组织详情"
    :append-to-body="true"
    @open="onOpen"
    :modal-append-to-body="true"
    width="1040px">
    <el-row>
      <el-form ref="myForm" label-width="100px" style="padding: 0 10px;">
        <el-col :span="24" style="border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;">
          <span>基础信息</span>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名：">
            <div class="view-content">{{fromParams.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号：">
            <div class="view-content">{{fromParams.phone}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：">
            <div class="view-content">
              <span v-if="fromParams.sex === '1'">男</span>
              <span v-else>女</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证：">
            <div class="view-content">
              {{fromParams.idCard}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毕业院校：">
            <div class="view-content">
              {{fromParams.university}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历：">
            <div class="view-content">
              {{fromParams.education | dict("education")}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="QQ：">
            <div class="view-content">
              {{fromParams.qqCode}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="婚姻状况：">
            <div class="view-content">
              {{fromParams.marryStatus | dict("marryStatus")}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="民族：">
            <div class="view-content">
              {{fromParams.nationality | dict("nationality")}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="政治面貌：">
            <div class="view-content">
              {{fromParams.politics | dict("politics")}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="籍贯：">
            <div class="view-content">
              {{fromParams.hometown}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="现在地址：">
            <div class="view-content">
              {{fromParams.habitationAddress}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="家庭地址：">
            <div class="view-content">
              {{fromParams.homeAddress}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="12" v-if="imageFilesList.imageFiles01.length > 0">
            <el-form-item label="照片：">
              <v-image-list :list="imageFilesList.imageFiles01"></v-image-list>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="imageFilesList.imageFiles02.length > 0">
            <el-form-item label="身份证：">
              <v-image-list :list="imageFilesList.imageFiles02"></v-image-list>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="imageFilesList.imageFiles03.length > 0">
            <el-form-item label="毕业证：">
              <v-image-list :list="imageFilesList.imageFiles03"></v-image-list>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="imageFilesList.imageFiles04.length > 0">
            <el-form-item label="专业证：">
              <v-image-list :list="imageFilesList.imageFiles04"></v-image-list>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="imageFilesList.imageFiles05.length > 0">
            <el-form-item label="简历：">
              <v-image-list :list="imageFilesList.imageFiles05"></v-image-list>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24" style="border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;">
          <span>工作信息</span>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职时间：">
            <div class="view-content">
              {{fromParams.entryTime}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离职时间：">
            <div class="view-content">
              {{fromParams.resignationTime}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="就职状态：">
            <div class="view-content">
              {{fromParams.workStatus | dict('workStatus')}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时薪(元/h)：">
            <div class="view-content">
              {{fromParams.salary}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资描述：">
            <div class="view-content">
              {{fromParams.salaryDescription}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作经历：">
            <div class="view-content">
              {{fromParams.workIntro}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="imageFilesList.imageFiles06.length > 0">
          <el-form-item label="劳动合同：">
            <v-image-list :list="imageFilesList.imageFiles06"></v-image-list>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="imageFilesList.imageFiles07.length > 0">
          <el-form-item label="廉洁协议：">
            <v-image-list :list="imageFilesList.imageFiles07"></v-image-list>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="imageFilesList.imageFiles08.length > 0">
          <el-form-item label="责任状：">
            <v-image-list :list="imageFilesList.imageFiles08"></v-image-list>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="imageFilesList.imageFiles09.length > 0">
          <el-form-item label="保密协议：">
            <v-image-list :list="imageFilesList.imageFiles09"></v-image-list>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="imageFilesList.imageFiles10.length > 0">
          <el-form-item label="竞业协议：">
            <v-image-list :list="imageFilesList.imageFiles10"></v-image-list>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="imageFilesList.imageFiles11.length > 0">
          <el-form-item label="其他协议：">
            <v-image-list :list="imageFilesList.imageFiles11"></v-image-list>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" @click="visible = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import { getPlaceParent } from '@/api/common'
import { getUser } from '@/utils/auth'
const emptyForm = {
  name: "",
  phone: "",
  sex: '',
  idCard: "",
  university: "",
  education: '',
  qqCode: "",
  marryStatus: '',
  nationality: '',
  politics: '',
  hometown: "",
  habitationAddress: "",
  homeAddress: "",
  workIntro: "",
  entryTime: "",
  resignationTime: "",
  workStatus: '',
  salaryDescription: "",
  salary: 0,
  hstoneFileEntityRelas: [],
  token: getUser().token,
}
export default {
  name: 'ContentViewDialog',
  mixins: [DialogMixin],
  data () {
    return {
      imageFilesList: {
        imageFiles01: [],
        imageFiles02: [],
        imageFiles03: [],
        imageFiles04: [],
        imageFiles05: [],
        imageFiles06: [],
        imageFiles07: [],
        imageFiles08: [],
        imageFiles09: [],
        imageFiles10: [],
        imageFiles11: []
      },
      fromParams: _.clone(emptyForm),
      token: getUser().token,
    }
  },
  methods: {
    onOpen () {},
    setFormDatas (data) {
      let vm = this
      vm.imageFilesList = {
        imageFiles01: [],
        imageFiles02: [],
        imageFiles03: [],
        imageFiles04: [],
        imageFiles05: [],
        imageFiles06: [],
        imageFiles07: [],
        imageFiles08: [],
        imageFiles09: [],
        imageFiles10: [],
        imageFiles11: [],
      }
      vm.fromParams = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        sex: data.sex?data.sex.toString():'',
        idCard: data.idCard,
        university: data.university?data.university.toString():'',
        education: data.education?data.education.toString():'',
        qqCode: data.qqCode,
        marryStatus: data.marryStatus?data.marryStatus.toString():'',
        nationality: data.nationality?data.nationality.toString():'',
        politics: data.politics?data.politics.toString():'',
        hometown: data.hometown,
        habitationAddress: data.habitationAddress,
        homeAddress: data.homeAddress,
        workIntro: data.workIntro,
        entryTime: data.entryTime,
        resignationTime: data.resignationTime,
        workStatus: data.workStatus?data.workStatus.toString():'',
        salaryDescription: data.salaryDescription,
        salary: data.salary,
      }
      if (data.hstoneFileEntityRelas.length > 0) {
        data.hstoneFileEntityRelas.forEach(key => {
          let index = 'imageFiles'+key.part
          vm.imageFilesList[index].push({
            id: key.fileCode,
            name: key.fileName,
            originalName: key.fileName,
            part: key.part,
            uniqueCode: key.fileCode
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-wrap {
    font-size: 16px;
    padding-left: 30px;
  }
  .view-content{
    min-height: 40px;
    word-break:break-all
  }
  .detail-item {
    line-height: 40px;

    &__label {
      color: #666;
    }

    &__value {
      color: #333;
    }
  }
</style>
