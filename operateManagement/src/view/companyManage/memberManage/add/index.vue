<template>
  <div class="message-page">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="title" name="content" v-loading="loading" element-loading-text="拼命加载中...">
        <el-steps
          :active="activeStep"
          finish-status="success"
          align-center
          style="margin-top: 20px;">
          <el-step title="基本信息"></el-step>
          <el-step title="工作信息"></el-step>
        </el-steps>
        <keep-alive>
          <component :member="memberProp" v-bind:is="currentComponent" @prev="onPrev" @next="onNext"></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BasicInfo from './BasicInfo'
import MainInfo from './MainInfo'
import { getUser } from '@/utils/auth'
const Components = ['BasicInfo', 'MainInfo']

export default {
  name: 'memberAdd',
  components: {
    BasicInfo,
    MainInfo,
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
      memberProp: null
    }
  },
  created () {
    if (this.$route.name === 'memberEdit') {
      this.edit()
    }
  },
  computed: {
    currentComponent () {
      return Components[this.activeStep]
    },
    title () {
      return this.$route.name === 'memberEdit' ? '编辑员工信息' : '新增员工'
    }
  },
  methods: {
    async edit() {
      let vm = this
      await vm.$store.dispatch('member_one_fn', vm)
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
