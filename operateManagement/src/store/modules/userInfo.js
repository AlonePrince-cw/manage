import { loginByUsername, logout } from '@/api/login'
import { getUser, setNode, getNode } from '@/utils/auth'
import request from '@/utils/request'
let userInfoParam = {
    token: ''
}

const userInfo = {
    state: {
      userInfoData: [],
      userInfo_userInfoParam: userInfoParam,
      userInfo_data: []
    },
    mutations: {
    },
    actions: {
        async userInfo_fn({ commit, state }, vm) {
            let user = getUser()
            let params = state.userInfo_userInfoParam
            params.token = user.token
            let data = await request({
                url: 'api/home/getUserInfo',
                method: 'post',
                params: params
            })
            state.userInfoData = data.data
            vm.userName = state.userInfoData.user.name
        }
    }
}

export default userInfo