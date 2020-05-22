<template>
  <div class="message-page">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="title" name="content" v-loading="loading" element-loading-text="拼命加载中...">
        <el-steps
          :active="activeStep"
          finish-status="success"
          align-center
          style="margin-top: 20px;">
          <el-step title="项目基本信息"></el-step>
          <el-step title="项目信息"></el-step>
          <el-step title="业主信息"></el-step>
          <el-step title="合作信息"></el-step>
        </el-steps>
        <keep-alive>
          <component :projectProp="projectProp" v-bind:is="currentComponent" @prev="onPrev" @next="onNext"></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BasicInfo from './BasicInfo'
import MainInfo from './MainInfo'
import OwnerInfo from './OwnerInfo'
import CooperInfo from './CooperInfo'
import { mapState } from 'vuex'
import { getUser } from '@/utils/auth'
import { Format } from '@/utils/util'

const Components = ['BasicInfo', 'MainInfo', 'OwnerInfo', 'CooperInfo']

export default {
  name: 'projectAdd',
  components: {
    BasicInfo,
    MainInfo,
    OwnerInfo,
    CooperInfo,
  },
  data () {
    return {
      activeName: 'content',
      loading: false,
      activeStep: 0,
      fromParams: {
        id: '',
        token: getUser().token
      },
      token: getUser().token,
        projectProp: null
    }
  },
  created () {
    if (this.$route.name === 'projectEdit') {
      this.edit()
    } else {
      this.project.project_add_params = {
        projectName: "",
        projectType: null,
        employeeId: null,
        settingTime: Format(new Date(),'yyyy-MM-dd'),
        deliveryTime: "",
        projectFunding: "",
        projectStatus: null,
        cooperationInfos: [
          {
            name: '',
            detailedAddress: '',
            regionId: '',
            type: 0,
            participants: [],
          },
          {
            name: '',
            detailedAddress: '',
            advantageType: '',
            type: 1,
            cooperationSupportDetails: '',
            participants: [
            ],
          }
        ],
        hstoneFileEntityRelas: [],
        hstoneProjectRichEdits: [
          {
            content: '',
            module: 1,
          },
          {
            content: '',
            module: 2,
          },
          {
            content: '',
            module: 3,
          },
          {
            content: '',
            module: 4,
          },
          {
            content: '',
            module: 5,
          },
          {
            content: '',
            types: '',
            module: 6,
          },
        ],
      }
    }
  },
  computed: {
    currentComponent () {
      return Components[this.activeStep]
    },
    title () {
      return this.$route.name === 'projectEdit' ? '编辑项目' : '创建项目'
    },
    ...mapState([
        'project'
    ]),
  },
  methods: {
    async edit() {
      let vm = this
      await vm.$store.dispatch('project_one_fn', vm)
    },
    onPrev () {
      this.activeStep = this.activeStep - 1
    },
    onNext () {
      this.activeStep = this.activeStep + 1
    },
    setStep (step) {
      this.activeStep = step
    }
  }
}
</script>
