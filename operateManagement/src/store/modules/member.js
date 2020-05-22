import { getUser, setNode, getNode } from '@/utils/auth'
import request from '@/utils/request'
import { parse } from '@/utils/util'
let memberAddParam = {
    name: "",
    phone: "",
    sex: '',
    idCard: "",
    university: "",
    education: null,
    qqCode: "",
    marryStatus: null,
    nationality: null,
    politics: null,
    hometown: "",
    habitationAddress: "",
    homeAddress: "",
    workIntro: "",
    entryTime: "",
    resignationTime: "",
    workStatus: null,
    salaryDescription: "",
    salary: 0,
    hstoneFileEntityRelas: []
}
let imgList = {
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
let addRule = {
    name:[
        { required: true, message: "请填写员工姓名", trigger: "blur" }
    ],
    phone:[
        { required: true, message: "手机号不能为空", trigger: "blur" }
    ],
    sex:[
        { required: true, message: "请选择员工性别", trigger: "blur" }
    ],
    idCard:[
        { required: true, message: "请填写员工身份证号", trigger: "blur" }
    ],
    university:[
        { required: true, message: "请填写员工毕业院校", trigger: "blur" }
    ],
    education:[
        { required: true, message: "请选择员工的学历", trigger: "blur" }
    ],
    // qqCode:[
    //     { required: true, message: "请输入员工的QQ", trigger: "blur" }
    // ],
    // marry:[
    //     { required: true, message: "请选择员工的婚姻状况", trigger: "blur" }
    // ],
    // nationality:[
    //     { required: true, message: "请选择员工的民族", trigger: "blur" }
    // ],
    // politics:[
    //     { required: true, message: "请选择员工政治面貌", trigger: "blur" }
    // ],
    // hometown:[
    //     { required: true, message: "请填写员工籍贯", trigger: "blur" }
    // ],
    // habitationAddress:[
    //     { required: true, message: "请填写员工现在地址", trigger: "blur" }
    // ],
    // homeAddress:[
    //     { required: true, message: "请填写员工家庭地址", trigger: "blur" }
    // ],
    entryTime:[
        { required: true, message: "请填写员工入职时间", trigger: "blur" }
    ],
    workStatus:[
        { required: true, message: "请选择员工就职状态", trigger: "blur" }
    ],
    salary:[
        { required: true, message: "请填写员工时薪", trigger: "blur" }
    ],
    salaryDescription:[
        { required: true, message: "请填写员工薪资描述", trigger: "blur" }
    ],
    // workIntro:[
    //     { required: true, message: "请填写员工工作经历", trigger: "blur" }
    // ]
}
const member = {
    state: {
        imageFilesList: imgList,
        member_add_params: memberAddParam,
        addRules: addRule
    },
    mutations: {
    },
    actions: {
        async member_add_fn({ commit, state }, vm) {
            let params = state.member_add_params
            params.token = vm.token
            await request.post('api/dispatch/pc/110201?token=' + vm.token, parse(params))
            vm.$message.success('添加成功')
            vm.$router.push('/business/member/' + getNode().id)

        },
        async member_edit_fn({ commit, state }, vm) {
            let params = state.member_add_params
            params.token = vm.token
            await request.post('api/dispatch/pc/110202?token=' + vm.token, parse(params))
            vm.$message.success('修改成功')
            vm.$router.push('/business/member/' + getNode().id)
        },
        async member_one_fn ({ commit, state }, vm) {
            let user = getUser();
            let params = {
                id: vm.$route.params.id,
                token: user.token
            };
            console.log(params)
            const loading = vm.$loading({
                lock: true,
                text: '正在加载...'
            });
            try {
                let { data } = await request({
                    url: 'api/dispatch/pc/110204',
                    method: 'get',
                    params: params
                });
                state.imageFilesList={
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
                state.member_add_params = {
                    id: data.id,
                    name: data.name,
                    phone: data.phone,
                    sex: data.sex?data.sex.toString():null,
                    idCard: data.idCard,
                    university: data.university?data.university.toString():null,
                    education: data.education?data.education.toString():null,
                    qqCode: data.qqCode,
                    marryStatus: data.marryStatus?data.marryStatus.toString(): null,
                    nationality: data.nationality?data.nationality.toString(): null,
                    politics: data.politics?data.politics.toString(): null,
                    hometown: data.hometown,
                    habitationAddress: data.habitationAddress,
                    homeAddress: data.homeAddress,
                    workIntro: data.workIntro,
                    entryTime: data.entryTime,
                    resignationTime: data.resignationTime,
                    workStatus: data.workStatus?data.workStatus.toString():null,
                    salaryDescription: data.salaryDescription,
                    salary: data.salary,
                }
                if (data.hstoneFileEntityRelas.length > 0) {
                    data.hstoneFileEntityRelas.forEach(key => {
                        let index = 'imageFiles'+key.part
                        state.imageFilesList[index].push({
                            id: key.id,
                            name: key.fileName,
                            fileId: key.fileId,
                            originalName: key.fileName,
                            part: key.part,
                            uniqueCode: key.fileCode
                        })
                    })
                }
                loading.close();
                vm.memberProp = data
            } catch (err) {
                vm.$message.error('页面加载失败，请刷新页面重试')
            } finally {
                loading.close()
            }
        },
        // async member_file_fn({ commit, state }, vm, v) {
            // let params = {
            //     bodyId:
            //     fileCode
            //     fileId
            //     fileName
            //     part
            // }
            // params.token = vm.token
            // await request.post('api/dispatch/pc/110211?token=' + vm.token, parse(params))
        // },
    }
}

export default member