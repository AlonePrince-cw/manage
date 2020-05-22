<template>
    <div class="message-page">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane :label="title" name="content" v-loading="loading" element-loading-text="拼命加载中...">
                <el-row class="myFromInfo">
                    <el-form
                            ref="formInfo"
                            label-width="100px"
                            :model="formParams"
                            :rules="rules"
                            style="width: 1200px;margin: 40px auto;padding: 30px 30px 0px 0px;">
                        <el-row class="conBox" style="margin-bottom: 0px;padding-bottom: 0px;margin-top: 0px">
                            <el-col :span="24" class="header">
                                <span>基本信息</span>
                            </el-col>
                            <el-row class="infoBox">
                                <el-col :span="12">
                                    <el-form-item label="角色名:" prop="name">
                                        <el-input :rows="4" v-model="formParams.name" type="text" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="角色类型:" prop="type">
                                        <el-select v-model="formParams.type" placeholder="请选择" disabled>
                                            <el-option
                                                    v-for="item in roleTypeData"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="所属部门:" prop="organizationId">
                                        <organizationSelect @selectChange="orgChange" :value="formParams.organizationId" :disabled="isAble"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="状态:" prop="status">
                                        <el-radio v-model="formParams.status" :label="1" disabled>启用</el-radio>
                                        <el-radio v-model="formParams.status" :label="0" disabled>禁用</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="角色说明:" prop="remark">
                                        <el-input :rows="4" v-model="formParams.remark" type="textarea" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-row>
                        <el-row class="conBox">
                            <el-col :span="24" class="header">
                                <span>权限设置</span>
                            </el-col>
                            <el-row class="infoBox">
                                <div class="virtualTable" v-for="v in getPermListData" :key="v.id">
                                    <div class="lineBox" v-if="v.type === 1">
                                        <div class="menuTitle" style="width: 100%">{{v.permissionName}}</div>
                                    </div>
                                    <div class="lineBox" v-if="v.type === 2">
                                        <div class="menuTitle" style="padding-left:32px">{{v.permissionName}}</div>
                                        <div class="btnTitle">
                                            <template v-if="v.childPermissionRela">
<!--                                                <span class="woCao" v-for="tem in v.childPermissionRela">{{tem.permissionName}}</span>-->
                                                <el-form :inline="true" class="demo-form-inline" >
                                                    <el-form-item :label="tem.permissionName" v-for="tem in v.childPermissionRela">
                                                        <el-select v-model="tem.dataWeight" style="width: 60%" placeholder="请选择" @change="changeValue(tem,v)">
                                                            <el-option
                                                                    v-for="i in options"
                                                                    :key="i.value"
                                                                    :label="i.label"
                                                                    :value="i.value"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </template>
                                        </div>
                                    </div>
                                    <template v-if="v.childPermissionRela">
                                        <template v-for="tem in v.childPermissionRela">
                                            <template v-if="tem.type === 1">
                                                <div class="lineBox">
                                                    <div class="menuTitle" style="width: 100%;padding-left: 32px">{{tem.permissionName}}</div>
                                                </div>
                                                <template v-if="tem.childPermissionRela">
                                                    <div class="lineBox" v-if="val.type === 2" :key="val.id" v-for="val in tem.childPermissionRela">
                                                        <div class="menuTitle" style="padding-left: 48px">{{val.permissionName}}</div>
                                                        <div class="btnTitle">
                                                            <template v-if="val.childPermissionRela">
                                                                <el-form :inline="true" class="demo-form-inline">
                                                                    <el-form-item :label="vals.permissionName" v-for="vals in val.childPermissionRela">
                                                                        <el-select v-model="vals.dataWeight" style="width: 60%" placeholder="请选择" @change="changeValue(vals,v)">
                                                                            <el-option
                                                                                       v-for="i in options"
                                                                                       :key="i.value"
                                                                                       :label="i.label"
                                                                                       :value="i.value"
                                                                            ></el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                </el-form>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </template>
                                            </template>
                                            <div class="lineBox" v-if="tem.type === 2" :key="tem.id">
                                                <div class="menuTitle" style="padding-left: 32px"> {{tem.permissionName}}</div>
                                                <div class="btnTitle">
                                                    <template v-if="tem.childPermissionRela">
<!--                                                        <div class="woCao" v-for="temsa in tem.childPermissionRela">{{temsa.permissionName}}</div>-->
                                                        <el-form :inline="true" class="demo-form-inline" >
                                                            <el-form-item :label="wocaoldou.permissionName" v-for="wocaoldou in tem.childPermissionRela" >
                                                                <el-select v-model="wocaoldou.dataWeight" style="width: 60%" placeholder="请选择" @change="changeValue(wocaoldou,v)">
                                                                    <el-option
                                                                            v-for="i in options"
                                                                            :key="i.value"
                                                                            :label="i.label"
                                                                            :value="i.value"
                                                                    ></el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-form>
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                </div>
                            </el-row>
                        </el-row>
                        <el-row class="dz-dialog-footer">
                            <el-button class="button" type="primary" @click="$router.back()">返回</el-button>
                            <el-button class="button" type="primary" @click="handleAdd(true)">提交</el-button>
<!--                            <el-button class="button" type="primary" @click="handleEdit(true)" v-if="$route.name === 'permSetEdit' && permButton('303')">修改</el-button>-->
                        </el-row>
                    </el-form>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
    import { Format } from '@/utils/util'
    import { permList, roleAdd, roleEdit, roleCheck ,jurisdiction,submission} from '@/api/role'
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    export default {
        name: 'permSet',
        data () {
            return {
                isAble:true,
                arrayData:[],
                options: [{
                    value: 0,
                    label: '本人'
                }, {
                    value: 30,
                    label: '全部'
                }],
                activeName: 'content',
                loading: false,
                checked: false,
                activeStep: 0,
                formParams: {
                    name: '',
                    type: 1,
                    remark: '',
                    organizationId: '',
                    status: 1,
                    permissionIds: '',
                    token: getUser().token
                },
                roleTypeData: [
                    // 超级管理、管理员、普通员工三级
                    {
                        id: 101,
                        name: '管理员'
                    },
                    {
                        id: 102,
                        name: '超级管理'
                    },
                    {
                        id: 103,
                        name: '普通员工三级'
                    }
                ],
                token: getUser().token,
                projectProp: null,
                rules: {
                    name: [
                        { required: true, message: '角色名称不能为空', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择角色类型', trigger: 'blur' }
                    ],
                    organizationId: [
                        { required: true, message: '请选择部门', trigger: 'blur' },
                    ],
                    status: [
                        { required: true, message: '请勾选启用状态', trigger: 'blur' },
                    ],
                },
                getPermListData: [],
                checkedList: [],
            }
        },
        created () {
            this.ftech()
        },
        computed: {
            title () {
                return this.$route.name === 'permSetEdit' ? '绑定权限' : '绑定权限'
            },
        },
        methods: {
            changeValue(v,m){
                console.log(m)
                console.log(v)
                this.arrayData.push(v,m)
            },
            permButton(v){
                let f = ''
                if(getPerm().indexOf(v) === -1){
                    f = false
                }else {
                    f = true
                }
                return f
            },
            changeBox(v){
                let vm = this
                if(vm.checkedList.indexOf(v) === -1){
                    vm.checkedList.push(v)
                }else {
                    vm.checkedList.remove(v)
                }
            },
            changeBoxed(v){
                let vm = this
                let f = ''
                if(vm.checkedList.indexOf(v.id) === -1){
                    f = false
                }else {
                    f = true
                }
                return f
            },
            async ftech() {
                let vm = this
                let params = {
                    id: vm.$route.params.id,
                    token: getUser().token
                }
                const {data} = await jurisdiction(params)
                vm.getPermListData = data
                if(vm.$route.name === 'authoRity'){
                    vm.edit()
                }
            },
            async edit() {
                let vm = this
                let params = {
                    id: vm.$route.params.id,
                    token: getUser().token
                }
                let {data} = await roleCheck(params)
                vm.formParams = {
                    id: data.id,
                    name: data.name,
                    type: data.type,
                    remark: data.remark,
                    organizationId: data.organizationId,
                    status: data.status,
                    permissionIds: data.permissionIds,
                }
                vm.checkedList = data.permissionIds
            },
            orgChange(v){
                this.formParams.organizationId = v.id
            },
            handleAdd () {
                let vm = this
                const batchDisables = {
                    rolePermissionRela:[],
                    token:getUser().token,
                }
                vm.arrayData.forEach((element)=>{
                    batchDisables.rolePermissionRela.push({
                        id:element.id,
                        dataWeight:element.dataWeight
                    })
                })
                console.log(batchDisables.rolePermissionRela)
                const loading = this.$loading({
                    lock: true,
                    text: '正在提交...'
                })
                try {
                    // vm.formParams.permissionIds = vm.checkedList
                    vm.$refs.formInfo.validate().then( async() => {
                        await submission(batchDisables)
                        vm.$emit('success')
                        vm.$message.success('提交成功')
                        vm.$router.back()
                    })
                } catch (err) {
                } finally {
                    loading.close()
                }
            },
            handleEdit () {
                let vm = this
                const loading = this.$loading({
                    lock: true,
                    text: '正在修改...'
                })
                try {
                    vm.formParams.permissionIds = vm.checkedList
                    vm.formParams.token = getUser().token
                    vm.$refs.formInfo.validate().then( async() => {
                        await roleEdit(vm.formParams)
                        loading.close()
                        vm.$message.success('修改成功')
                        vm.$router.back()
                    })
                } catch (err) {
                    loading.close()
                } finally {

                }
            }
        }
    }
</script>
<style lang="scss">
    .btnTitles{
        margin-left: 200px;
        border-left: 1px solid #d7dae2;
        padding: 16px 30px;
        min-height: 52px;
    }
    .woCao{
        color: #606266;
        font-weight: 500;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        display: inline-block;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-right: 30px;
    }
    .virtualTable{
        border: 1px solid #d7dae2;
        margin-bottom: 20px;
        .el-checkbox__label {
            display: inline-block;
            padding-left: 10px;
            line-height: 19px;
            font-size: 15px;
        }
        .lineBoxs{
            overflow: hidden;
        }
        .lineBox{
            border-bottom: 1px solid #d7dae2;
            overflow: hidden;
            .menuTitle{
                width: 200px;
                float: left;
                padding: 16px 16px;
            }
            .btnTitle{
                margin-left: 200px;
                border-left: 1px solid #d7dae2;
                padding: 16px 30px;
                min-height: 52px;
            }
        }
        .lineBox:last-child{
            border-bottom: none;
        }
    }
    .myFromInfo{
        .x-pagination {
            padding-left: 0px;
        }
        .conBox {
            width: 1100px;margin: 40px auto;padding: 0px 30px 30px 0px;
            .header {
                border-bottom: 1px solid #dedede;padding: 8px 0px;margin-bottom: 20px;font-size: 16px;
            }
            .infoBox {
                width: 1000px;margin: 40px auto;padding: 30px 30px 0px 0px;margin-bottom: 0px;
                .btns{
                    margin-bottom: 16px;
                }
            }
        }
        .dz-dialog-footer {
            text-align: center;
        }
    }
    .myFromInfo .el-date-editor{
        width: 100%;
    }
    .myFromInfo .el-input-number{
        width: 100%;
    }
    .myFromInfo .el-select{
        width: 100%;
    }
</style>