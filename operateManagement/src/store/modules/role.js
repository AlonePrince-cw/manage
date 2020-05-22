import store from '@/store'
import request from '@/utils/request'
import { loginByUsername, logout } from '@/api/login'
import { removeUser, setUser, getUser } from '@/utils/auth'
import { parse, dateFormatYmd } from '@/utils/util'
const addParams={
  id: '',
  addIds: '',
  hasOperate: '1',
  token: ''
}
const role = {
  state: {
    role_add_params: addParams,
    role_checked: [],
    role_menu_checked: [],
  },
  mutations: {
  },
  actions: {
    // 角色授权
    async role_add_fn({ commit, state }, vm) {
      let params = role.role_add_params
      // params.pushData = JSON.stringify(state.sence_add_params.pushData)
      const loading = vm.$loading({
        lock: true,
        text: '正在授权...'
      })
      try {
        await request.post('bubble/rolePermissionRela/saveOne?token=' + vm.token, parse(params))
        loading.close()
        vm.$message.success('授权成功')
        vm.$emit('success')
      } finally {
        loading.close()
      }
    },
  }
}

export default role
