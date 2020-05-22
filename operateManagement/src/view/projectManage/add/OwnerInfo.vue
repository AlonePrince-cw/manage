<template>
    <div class="myFromInfo">
        <el-form
            ref="form"
            :model="project.project_add_params.cooperationInfos[0]"
            :rules="rules"
            label-width="100px"
            style="width: 775px;margin: 40px auto;padding: 30px 30px 10px 0px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="业主方:" prop="name">
                        <el-input
                            placeholder="请填写业主方名称"
                            v-model="project.project_add_params.cooperationInfos[0].name">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="地址信息:" prop="regionId">
                        <placeSelect @selectPlace="placeChange" :value="placeVal"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="详细地址:" prop="detailedAddress">
                        <el-input
                            placeholder="请填写业主方详细地址"
                            v-model="project.project_add_params.cooperationInfos[0].detailedAddress"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="关系人:" prop="participants">
                        <div class="personList" v-for="item in project.ownerList" :key="item.id" v-if="item.id">
                            <el-button type="danger" @click="deletePeople(item)" class="delPeople">X</el-button>
                            <el-card shadow="hover">
                                <p>
                                    <span>{{item.name}}</span>
                                      <span style="padding: 0px 10px;">
                                        <span v-if="item.sex === 1">男</span>
                                        <span v-else>女</span>
                                      </span>
                                    <span :title="item.duty">{{item.duty}}</span>
                                </p>
                                <p>
                                    <span>电话：{{item.telephone}}</span>
                                </p>
                                <p><span :title="item.remark">备注：{{item.remark}}</span></p>
                            </el-card>
                        </div>
                        <div class="personList">
                            <el-card class="addUser" shadow="hover">
                                <div @click="addDialog(true)" style="width: 100%;height: 100%">
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                </div>
                            </el-card>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="submit-bar text-center">
            <el-button type="primary" @click="$emit('prev')">上一步</el-button>
            <el-button type="primary" @click="editOwner" v-if="$route.name === 'projectEdit' && permButton('4112')">修改业主信息</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
        <el-dialog title="添加关系人" class="addConfirm" :visible.sync="addVisible" width="910px">
            <el-form label-width="85px" class="addInfo" ref="addInfo" :model="contactInfo" :rules="contactRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="id">
                            <el-input v-model="contactInfo.name" @change="change()" placeholder="请输入姓名"></el-input>
<!--                            <el-select-->
<!--                                v-model="contactInfo.id"-->
<!--                                filterable-->
<!--                                placeholder="请选择"-->
<!--                                @change="selectCustom"-->
<!--                                style="width: 100%">-->
<!--                                <el-option-->
<!--                                    v-for="item in customData"-->
<!--                                    :key="item.id"-->
<!--                                    :label="item.name"-->
<!--                                    :value="item.id">-->
<!--                                </el-option>-->
<!--                            </el-select>-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公司">
                            <el-input v-model="contactInfo.company" @change="change" placeholder="请输入公司"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职位">
                            <el-input v-model="contactInfo.duty" @change="change" placeholder="请输入职位"></el-input>
                        </el-form-item>
<!--                        <el-form-item label="职位:">-->
<!--                            <GetPlatformDict :dictType = "'position'" :value="contactInfo.duty" :snycModel.sync="contactInfo.duty" @selectChange="selectChange()"></GetPlatformDict>-->
<!--                        </el-form-item>-->
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话">
                            <el-input v-model="contactInfo.telephone" @change="change" placeholder="请输入电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所在地区">
                            <placeSelect @selectPlace="placeChanges" :value="placeV"/>
<!--                            <el-input placeholder="请填写所在地区" v-model="placeV[0]"></el-input>-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-radio v-model="contactInfo.sex" @change="change" :label="1">男</el-radio>
                            <el-radio v-model="contactInfo.sex" @change="change" :label="2">女</el-radio>
                        </el-form-item>
                    </el-col>
<!--                    <el-col :span="24">-->
<!--                        <el-form-item label="备注：">-->
<!--                            <el-input type="textarea" v-model="contactInfo.remark" disabled rows="4"></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
                    <el-col :span="24">
                        <el-table border :data="customData" ref="customData" tooltip-effect="dark" @selection-change="handleSelectionChange">
                            <el-table-column
                                    type="selection"
                                    width="50">
                            </el-table-column>
                            >
                            <el-table-column
                               label="序号"
                               :show-overflow-tooltip="true"
                               width="50px"
                               type="index"
                               align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="姓名"
                                    :show-overflow-tooltip="true"
                                    width="100px"
                                    prop="name"
                                    align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="性别"
                                    :show-overflow-tooltip="true"
                                    width="100px"
                                    prop="sex"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.sex === 1">男</span>
                                    <span v-else>女</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="职务"
                                    :show-overflow-tooltip="true"
                                    width="135px"
                                    prop="duty"
                                    align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="电话"
                                    :show-overflow-tooltip="true"
                                    width="100px"
                                    prop="telephone"
                                    align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="公司/部委"
                                    :show-overflow-tooltip="true"
                                    width="200px"
                                    prop="company"
                                    align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="地区"
                                    :show-overflow-tooltip="true"
                                    width="134px"
                                    prop="region.remark"
                                    align="center"
                            >
                            </el-table-column>
                        </el-table>
                        <Pager
                                :total="contactInfo.total"
                                :pageTotalChange="handleSizeChange"
                                :size="contactInfo.size"
                                :current="contactInfo.page"
                                :pageChange="pageChange"
                        ></Pager>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="confrim">
                <el-button @click="addPerson" type="success">确定添加</el-button>
                <el-button @click="addVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { mapState } from 'vuex'
  import { getPlaceParent } from '@/api/common'
  import _ from 'lodash'

  export default {
    name: 'OwnerInfo',
    props: {
      projectProp: {
        default: null
      }
    },
    data () {
      return {
        addVisible: false,
        chckdeData:[],
        placeVal: [],
        placeV: [],
        contactInfo: {
          page: 1,
          size: 10,
          total: 0,
          id: '',
          name: '',
          company: '',
          duty: null,
          telephone: '',
          sex: '',
          remark: '',
            regionTreeCode:'',
          regionId: ''
        },
        rules: {
          name: [
            {required: true, message: '请填写业主方名称', trigger: 'blur'}
          ],
          regionId: [
            {required: true, message: '请选择业主方地址信息', trigger: 'change'}
          ],
          detailedAddress: [
            {required: true, message: '请填写业主方详细地址', trigger: 'blur'}
          ],
          participants: [
            {type: 'array', required: true, message: '请添加关系人'}
          ]
        },
        contactRules: {
          // id: [
          //   {required: true, message: '请选择联系人', trigger: 'blur'}
          // ],
          regionId: [
            {required: true, message: '请选择联系人所在地区', trigger: 'blur'}
          ],
          detailedAddress: [
            {required: true, message: '请填写业主方详细地址', trigger: 'blur'}
          ]
        },
        customData: [],
        menuId: getNode().id,
        token: getUser().token,
      }
    },
    computed: {
      ...mapState([
        'project'
      ]),
    },
    watch: {
      projectProp (val) {
        if (val) {
          this.setData(val)
        }
      }
    },
    created () {
      let vm = this
      vm.fetchDicts()
      vm.placeVal = []
      let val = vm.project.project_add_params.cooperationInfos[0]
      vm.project.ownerList = []
      if (val && vm.$route.name === 'projectEdit') {
        vm.getPlaceParents(val.regionId)
        if (val.participants.length > 0) {
          val.participants.forEach(function (v) {
            vm.project.ownerList.push({
              id: v.customer.id,
              name: v.customer.name,
              company: v.customer.company,
              duty: v.customer.duty,
              telephone: v.customer.telephone,
              sex: v.customer.sex,
              remark: v.customer.remark,
              regionId: v.customer.regionId
            })
          })
        }
      }
    },
    methods: {
        selectChange(){
            let  vm= this
            vm.$store.dispatch("project_customList_fn", vm);
        },
        change(){
            let  vm= this
            vm.$store.dispatch("project_customList_fn", vm);
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
        handleSelectionChange(val) {
            this.chckdeData=val
        },
            // 分页查询
        handleSizeChange(val) {
            let vm = this;
            vm.contactInfo.size = val;
            // vm.fetchTableData();
            vm.$store.dispatch("project_customList_fn", vm);
        },
        pageChange(val) {
            let vm = this;
            vm.contactInfo.page = val;
            // vm.fetchTableData();
            vm.$store.dispatch("project_customList_fn", vm);
        },
      editOwner () {
        let vm = this
        vm.$refs['form'].validate().then(() => { // 表单验证
          vm.project.project_add_params.cooperationInfos[0].participants = []
          vm.project.ownerList.forEach(function (v) {
            vm.project.project_add_params.cooperationInfos[0].participants.push(
              {
                customerId: v.id,
                type: 0,
              }
            )
          })
          vm.$store.dispatch("project_editOwner_fn", vm);
        }, _.noop)
      },
      selectCustom (v) {
        let vm = this
        vm.customData.forEach(item => {
          if (item.id === v) {
            vm.getPlaceParent(item.regionId)
            vm.contactInfo.regionId = item.regionId;
            vm.contactInfo.name = item.name;
            vm.contactInfo.company = item.company;
            vm.contactInfo.duty = item.duty;
            vm.contactInfo.telephone = item.telephone;
            vm.contactInfo.sex = item.sex
          }
        });
      },
      async getPlaceParent (v) {
        let params = {
          id: v,
          levelNum: 0,
          token: getUser().token
        }
        let {data} = await getPlaceParent(params)
        this.placeV.push(data.parentsNameStr)
      },
      async getPlaceParents (v) {
        let params = {
          id: v,
          levelNum: 0,
          token: getUser().token
        }
        let {data} = await getPlaceParent(params)
          console.log(data)
        this.placeVal.push(data.parentsNameStr)
      },
      deletePeople (val) {
        let vm = this;
        vm.$confirm('确定要删除此联系人吗？', '删除联系人确认', {
          confirmButtonText: '确定',
          cancelButtonText: '我再看看',
          customClass: 'deleteContacts',
          closeOnClickModal: false
        }).then(() => {
          vm.project.ownerList.forEach(function (v, n) {
            if (val.id === v.id) {
              vm.project.ownerList.splice(n, 1);
              return false
            }
          })
        }).catch(() => {
        })
      },
      // 添加关系人
      addDialog (v) {
        let vm = this
        vm.addVisible = true;
        vm.contactInfo = {
          id: '',
          name: '',
          company: '',
          duty: '',
          telephone: '',
          sex: '',
          remark: '',
          regionId: ''
        }
        vm.placeV = []
        vm.$store.dispatch("project_customList_fn", vm);
      },
      addPerson () {
        let vm = this
          vm.chckdeData.forEach(function (v) {
              let isRepeat = false
              vm.project.ownerList.forEach((element)=>{
                  if(v.id === element.id){
                      isRepeat =true
                      vm.$message.warning(v.name + '已被添加，请不要重复添加')
                  }
              })
          if (!isRepeat) {
              vm.project.ownerList.push({
                  id: v.id,
                  name: v.name,
                  company: v.company,
                  duty: v.duty,
                  telephone: v.telephone,
                  sex: v.sex,
                  remark: v.remark,
                  regionId: v.regionId
              })
          }
              vm.addVisible = false
      })
      },
      placeChange (v) {
        let vm = this
        vm.project.project_add_params.cooperationInfos[0].regionId = v[v.length - 1].value
      },
      placeChanges (v) {
       console.log(v)
        let vm = this
        vm.contactInfo.regionTreeCode = v[v.length - 1].treeCode
        vm.$store.dispatch("project_customList_fn", vm);
      },
      onUploadConfirm (v) {
        let vm = this
        vm.member.imageFilesList[this.imageFilesType] = v
      },
      showUploader (type, v) {
        this.uploadType = type;
        this.imageFilesType = v
        this.$refs["uploader"].show(this.member.imageFilesList[this.imageFilesType]);
      },
      async setData (data) {
        // 回显数据
      },
      fetchDicts () {
        // 初始化
      },
      nextStep () {
        let vm = this
        vm.project.project_add_params.cooperationInfos[0].participants = []
        vm.project.ownerList.forEach(function (v) {
          vm.project.project_add_params.cooperationInfos[0].participants.push(
            {
              customerId: v.id,
              type: 0,
            }
          )
        })
        vm.$refs['form'].validate().then(() => { // 表单验证
          vm.$emit('next')
        }, _.noop)
      },
    }
  }
</script>

<style lang="scss" scoped>
    .id-match {
        margin-top: 30px;
        padding-left: 200px;

        &-label {
            margin-right: 12px;
        }
    }

    .warn {
        margin-bottom: 30px;
        text-align: center;
    }

    .personList {
        width: 300px;
        height: 140px;
        display: inline-block;
        position: relative;
        margin-right: 20px;

        .delPeople {
            display: inline-block;
            position: absolute;
            right: 16px;
            top: 16px;
            height: 20px;
            width: 20px;
            border-radius: 20px;
            margin: 0;
            padding: 0;
        }

        p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .el-card {
            height: 140px;
        }
    }

    .addUser {
        font-size: 45px;
        text-align: center;
        height: 140px;
        line-height: 100px;
    }
</style>
<style lang="scss">
    .myFromInfo .el-date-editor {
        width: 100%;
    }

    .myFromInfo .el-input-number {
        width: 100%;
    }

    .deleteContacts {
        .el-message-box__message{
            text-align: center;
            font-size: 18px;
        }

        .el-message-box__btns button:not(.el-button--primary) {
            float: right;
            margin-left: 10px;
            ~button{
                margin-left: 0;
                border-color: #009688;
                background: #009688;
            }
        }
    }
</style>
