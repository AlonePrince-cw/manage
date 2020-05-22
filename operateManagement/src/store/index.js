import Vue from 'vue'
import VueX from 'vuex'
import getters from './getters'
import state from './state'
import userInfo from './modules/userInfo'
import member from './modules/member'
import project from './modules/project'
import role from './modules/role'
Vue.use(VueX)
const store = new VueX.Store({
    modules:{
      userInfo,
      member,
      project,
      role
    },
    state,
    getters
})

export default store