import { getUser, setNode, getNode } from '@/utils/auth'
import request from '@/utils/request'
import { parse } from '@/utils/util'
let projectAddParam = {
    projectName: "",
    projectType: null,
    employeeId: null,
    settingTime: "",
    deliveryTime: "",
    projectFunding: "",
    projectStatus: null,
    regionId:'',
    treeCode:'',
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
const project = {
    state: {
        project_add_params: projectAddParam,
        ownerList: [],
        cooperList: []
    },
    mutations: {},
    actions: {
        async project_add_fn({ commit, state }, vm) {
            const loading = vm.$loading({
                lock: true,
                text: '正在创建...'
            });
            vm.project.project_add_params.hstoneFileEntityRelas.forEach(function (v) {
                v.fileCode = v.uniqueCode
                v.fileId = v.id
                v.fileName = v.originalName
                v.part = '06'
            })
            try {
                let params = state.project_add_params
                params.token = vm.token
                await request.post('api/dispatch/pc/4101?token=' + vm.token, parse(params))
                vm.$message.success('创建成功')
                vm.$router.push('/business/projectManage/' + getNode().id)
            } catch (err) {
                console.log('页面加载失败，请刷新页面重试')
            } finally {
                loading.close()
            }
        },
        async project_editBasic_fn({ commit, state }, vm) {
            const loading = vm.$loading({
                lock: true,
                text: '正在修改项目基础信息...'
            });
            vm.project.project_add_params.hstoneFileEntityRelas.forEach(function (v) {
                v.bodyId = vm.$route.params.id,
                v.fileCode = v.uniqueCode
                v.fileId = v.id
                v.fileName = v.originalName
                v.part = '06'
            })
            try {
                let params = {
                    id: state.project_add_params.id,
                    projectName: state.project_add_params.projectName,
                    regionId:state.project_add_params.regionId,
                    regionTreeCode:state.project_add_params.treeCode,
                    projectType: state.project_add_params.projectType,
                    employeeId: state.project_add_params.employeeId,
                    settingTime: state.project_add_params.settingTime,
                    deliveryTime: state.project_add_params.deliveryTime,
                    projectFunding: state.project_add_params.projectFunding,
                    projectStatus: state.project_add_params.projectStatus,
                    hstoneFileEntityRelas: state.project_add_params.hstoneFileEntityRelas,
                }
                await request.post('api/dispatch/pc/4103?token=' + vm.token, parse(params))
                vm.$message.success('修改成功')
            } catch (err) {
                console.log('页面加载失败，请刷新页面重试')
            } finally {
                loading.close()
            }
        },
        async project_delEditor_fn({ commit, state }, vm) {
          const loading = vm.$loading({
            lock: true,
            text: '正在删除...'
          });
          try {
              console.log(vm.isEditData)
            let params = {
                id: vm.isEditData.id
            }
            await request.post('api/dispatch/pc/4110?token=' + vm.token, parse(params))
            vm.$message.success('删除成功')
            vm.showEditorList = {
              projectFundShow: false,
              solveShow: false,
              amiShow: false,
              needShow: false,
              baseShow: false,
              explainShow: false,
            }
          } catch (err) {
            console.log('页面加载失败，请刷新页面重试')
          } finally {
            loading.close()
          }
        },
        async project_saveEditor_fn({ commit, state }, vm) {
            let arr = []
            vm.checkedList.forEach(function (v) {
                vm.typesData.forEach(function (val) {
                    if(v===val.value){
                        arr.push(val.id)
                    }
                })
            })
            const loading = vm.$loading({
                lock: true,
                text: '正在保存...'
            });
            try {
                let params = vm.isEditData
                params.types = arr.join(',')
                await request.post('api/dispatch/pc/4109?token=' + vm.token, parse(params))
                vm.isEditData = ''
                vm.showEditorList = {
                    projectFundShow: false,
                    solveShow: false,
                    amiShow: false,
                    needShow: false,
                    baseShow: false,
                    explainShow: false,
                }
                vm.$message.success('保存成功')
            } catch (err) {
                console.log('页面加载失败，请刷新页面重试')
            } finally {
                loading.close()
            }
        },
        async project_editOwner_fn({ commit, state }, vm) {
            const loading = vm.$loading({
                lock: true,
                text: '正在保存...'
            });
            try {
                let params = state.project_add_params.cooperationInfos[0]
                await request.post('api/dispatch/pc/4112?token=' + vm.token, parse(params))
                vm.$message.success('修改成功')
            } catch (err) {
                console.log('页面加载失败，请刷新页面重试')
            } finally {
                loading.close()
            }
        },
        async project_editCooper_fn({ commit, state }, vm) {
            const loading = vm.$loading({
                lock: true,
                text: '正在保存...'
            });
            let advantageArr = []
            vm.checkedLists.forEach(function (v) {
                vm.advantageData.forEach(function (val) {
                    if(v===val.value){
                        advantageArr.push(val.id)
                    }
                })
            })
            try {
                let params = state.project_add_params.cooperationInfos[1]
                params.advantageType = advantageArr.join(',')
                await request.post('api/dispatch/pc/4112?token=' + vm.token, parse(params))
                vm.$message.success('修改成功')
                vm.$router.back()
            } catch (err) {
                console.log('页面加载失败，请刷新页面重试')
            } finally {
                loading.close()
            }
        },
        async project_edit_fn({ commit, state }, vm) {
            let params = state.project_add_params
            params.token = vm.token
            vm.project.project_add_params.hstoneFileEntityRelas.forEach(function (v) {
                v.fileCode = v.uniqueCode
                v.fileId = v.id
                v.fileName = v.originalName
                v.part = '06'
            })
            await request.post('api/dispatch/pc/110202?token=' + vm.token, parse(params))
            vm.$message.success('修改成功')
            vm.$router.push('/business/project/' + getNode().id)
        },
        async project_one_fn ({ commit, state }, vm) {
            let user = getUser();
            let params = {
                id: vm.projectId?vm.projectId:vm.$route.params.id,
                token: user.token
            };
            const loading = vm.$loading({
                lock: true,
                text: '正在加载...'
            });
            try {
                let { data } = await request({
                    url: 'api/dispatch/pc/4102',
                    method: 'get',
                    params: params
                });
                data.hstoneProjectRichEdits.forEach(function (v) {
                  if(!v.content){
                    v.content = ''
                  }
                })
                state.project_add_params = {
                    id: data.id,
                    regionId:data.regionId,
                    projectName: data.projectName,
                    projectType: data.projectType.toString(),
                    employeeId: data.employeeId,
                    employeeName: data.employee.name,
                    settingTime: data.settingTime,
                    deliveryTime: data.deliveryTime,
                    projectFunding: data.projectFunding,
                    projectStatus: data.projectStatus.toString(),
                    cooperationInfos: [
                        {
                            id: data.cooperationInfos.length>0?data.cooperationInfos[0].id:'',
                            name: data.cooperationInfos.length>0?data.cooperationInfos[0].name:'',
                            detailedAddress: data.cooperationInfos.length>0?data.cooperationInfos[0].detailedAddress:'',
                            regionId: data.cooperationInfos.length>0?data.cooperationInfos[0].regionId: '',
                            type: 0,
                            participants: data.cooperationInfos.length>0?data.cooperationInfos[0].participants: [],
                        },
                        {
                            id: data.cooperationInfos.length>0?data.cooperationInfos[1].id:'',
                            name: data.cooperationInfos.length>0?data.cooperationInfos[1].name:'',
                            detailedAddress: data.cooperationInfos.length>0?data.cooperationInfos[1].detailedAddress:'',
                            advantageType: data.cooperationInfos.length>0?data.cooperationInfos[1].advantageType:'',
                            type: 1,
                            cooperationSupportDetails: data.cooperationInfos.length>0?data.cooperationInfos[1].cooperationSupportDetails:'',
                            participants: data.cooperationInfos.length>0?data.cooperationInfos[1].participants: [],
                        }
                    ],
                    hstoneFileEntityRelas: [],
                    hstoneProjectRichEdits: data.hstoneProjectRichEdits
                }
                state.project_add_params.hstoneFileEntityRelas = []
                if (data.hstoneFileEntityRelas.length > 0) {
                    data.hstoneFileEntityRelas.forEach(key => {
                        state.project_add_params.hstoneFileEntityRelas.push({
                            id: key.id,
                            name: key.fileName,
                            originalName: key.fileName,
                            fileName: key.fileName,
                            fileId: key.fileId,
                            part: key.part,
                            uniqueCode: key.fileCode
                        })
                    })
                }
                loading.close();
                console.log(data)
                vm.projectProp = data
            } catch (err) {
                console.log('页面加载失败，请刷新页面重试')
            } finally {
                loading.close()
            }
        },
        // 查询custom管理列表
        async project_customList_fn({ commit, state }, vm) {
            console.log(commit)
            console.log(state)
            let params = vm.contactInfo
            params.token = vm.token
            vm.loading = true
            let data = await request({
                url: 'api/dispatch/pc/2104',
                method: 'get',
                params: params
            })
            vm.customData = data.data
            vm.contactInfo.total = data.total
            vm.loading = false
        },
    }
}

export default project