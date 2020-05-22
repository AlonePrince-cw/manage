<template>
    <div>
        <el-tabs
            v-model="activeName"
            type="border-card"
            ref="tabs"
        >
            <el-tab-pane label="知识管理" name="first">
                <el-row class="content">
                    <el-row class="contentView">
                        <el-col :span="24" class="cont">
                            <div class="title">{{queryOneData.title}}</div>
                            <div class="name"><span>内容数量:{{queryOneData.depositoriesCount}}</span></div>
                            <div class="name"><span>内容类型:{{queryOneData.catgoryType | dict('catgoryType')}}</span></div>
                            <div class="name">
                                <span>重要度:{{queryOneData.importantStatus | dict('importantStatus')}}</span></div>
                        </el-col>
                        <el-col :span="24" class="cont">
                            <el-tag type="success" v-if="queryOneData.hstoneProject">
                                {{queryOneData.hstoneProject.projectTypeDictionary.value}}
                            </el-tag>
                            <el-tag v-if="queryOneData.hstoneProject" style="margin-left: 10px">
                                {{queryOneData.hstoneProject.projectName}}
                            </el-tag>
                        </el-col>
                        <el-col :span="24" class="contView" :class="{contH: isOpen}">{{queryOneData.describle}}
                            <a class="open" v-if="!isOpen" @click="open">展开 <i class="el-icon-arrow-down"></i></a>
                            <a class="open" v-if="isOpen" @click="stop">收起 <i class="el-icon-arrow-up"></i></a>
                        </el-col>
                    </el-row>
                    <el-divider/>
                </el-row>
                <el-row class="mb-20">
                    <el-col :span="24" style="padding: 0px 10px">
                        <div class="fl">
                            <el-button type="primary" @click="$router.back()">返回</el-button>
                        </div>
                        <div class="fr">
                            <el-button type="primary" @click="createTheme" v-if="permButton('3107')">创建知识</el-button>
                        </div>
                    </el-col>
                </el-row>
                <!-- 知识管理列表 -->
                <div class="contentPage">
                    <div v-for="(v,n) in knowledgeData" class="contViews">
                        <div class="titleLine">
                            <span class="title">{{v.title}}</span>
                            <div class="work">
                                <span class="name" v-if="v.hstoneEmployee">{{v.hstoneEmployee.name}}</span>
                                <span class="name" v-if="v.hstoneEmployee">
                  <template v-for="(tem,n) in v.hstoneEmployee.hstoneEmployeePosition">
                    {{tem.organization.fullName}}
                    <span v-if="n < v.hstoneEmployee.hstoneEmployeePosition.length - 1">;</span>
                  </template>
                </span>
                                <span @click="check(v)" class="name handle" v-if="permButton('3109')">详情</span>
                                <span @click="edit(v)" class="name handle" v-if="permButton('3108')">编辑</span>
                                <!--<span  class="name handle">操作日志</span>-->
                            </div>
                        </div>
                        <div class="divLift">
                            <div class="cont"><span v-html="v.content">{{v.content}}</span></div>
                            <div class="hefLine">
                                <span>阅读数：{{v.pageview}}</span>
                                <span>下载数：{{v.downloadCount}}</span>
                                <span>{{v.modifyTime | dateFormatYmdHms}}</span>
                            </div>
                            <div class="divRight">
                                <el-col :span="24">
                                    <el-form ref="form" label-width="100px">
                                        <el-form-item label="附件:">
                                            <div class="form-uploader">
                                                <div class="form-uploader-result">
                                                    <div class="uploaded-number">{{v.hstoneFileEntityRelas.length}}个
                                                    </div>
                                                    <img class="img-cover" @click="fileInfo(v.hstoneFileEntityRelas)"
                                                         src="@/assets/word.jpeg" alt="">
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </div>
                        </div>
                    </div>
                    <div v-if="knowledgeData.length === 0">
                        <el-divider content-position="center">查询数据为空</el-divider>
                    </div>
                </div>
                <Pager
                    :total="knowledgeParams.total"
                    :pageTotalChange="handleSizeChange"
                    :size="knowledgeParams.size"
                    :current="knowledgeParams.page"
                    :pageChange="pageChange">
                </Pager>
            </el-tab-pane>
            <el-dialog :visible.sync="fileDialog" title="附件详情" width="600px">
                <el-form ref="addJob" style="padding: 0px 12px 0 12px;" label-width="100px">
                    <el-row>
                        <v-doc-list :list="fileList"/>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialogFooter">
                    <el-button @click="fileDialog = false">关闭</el-button>
                </div>
            </el-dialog>
            <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' :topicId='topicId'
                           @success="refreshTable"/>
            <ContentViewDialog ref="checkDialog" @success="refreshCheckTable"/>
        </el-tabs>
    </div>
</template>

<script>
  import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { knowledgePage, knowledgeQueryOne } from '@/api/knowledge'
  import ContentViewDialog from './ContentViewDialog'
  import ContentDialog from './ContentDialog'

  export default {
    name: 'knowledge',
    components: {
      ContentDialog, ContentViewDialog
    },
    beforeUpdate () {
    },
    data () {
      return {
        placeVal: [],
        fileDialog: false,
        activeName: 'first',
        dialogHandleType: 'add',
        isOpen: false,
        queryOneData: '',
        fileList: [],
        topicId: '',
        knowledgeParams: {
          topicId: '',
          page: 1,
          size: 10,
          total: 0,
          token: getUser().token
        },
        knowledgeData: [],
      };
    },
    created () {
      let vm = this
      vm.fetchOne()
      vm.fetchTableData()
    },
    methods: {
        permButton(v){
            let f = ''
            if(getPerm().indexOf(v) === -1){
                f = false
            }else {
                f = true
            }
            return f
        },
      fileInfo (v) {
        let vm = this
          console.log(v)
        vm.fileList = []
        v.forEach(function (key) {
          vm.fileList.push({
            name: key.fileName,
            originalName: key.fileName,
            fileName: key.fileName,
            fileId: key.fileId,
            part: key.part,
            uniqueCode: key.fileCode
          })
        })
        vm.fileDialog = true
      },
      open () {
        this.isOpen = true
      },
      stop () {
        this.isOpen = false
      },
      async fetchOne () {
        let vm = this
        let queryOneParams = {
          id: vm.$route.params.id,
          token: getUser().token
        }
        let {data} = await knowledgeQueryOne(queryOneParams)
        vm.queryOneData = data
      },
      selectData (v) {
        this.knowledgeParams.projectId = v.id
      },
      // 选择查询组织ID
      orgChanges (v) {
        this.knowledgeParams.id = v.id;
      },
      // 选择地区查询
      placeChange (v) {
        let vm = this
        vm.knowledgeParams.regionTreeCode = v[v.length - 1].treeCode
      },
      handleSizeChange (v) {
        this.knowledgeParams.size = v;
        this.fetchTableData();
      },
      pageChange (v) {
        this.knowledgeParams.page = v;
        this.fetchTableData();
      },
      async fetchTableData () {
        let vm = this
        const loading = vm.$loading({
          lock: true,
          text: '正在查询...'
        });
        vm.knowledgeParams.topicId = vm.$route.params.id
        vm.topicId = vm.$route.params.id
        try {
          let data = await knowledgePage(vm.knowledgeParams)
          vm.knowledgeData = data.data
          vm.knowledgeParams.total = data.total
        } catch (err) {
          console.log('页面加载失败，请刷新页面重试')
        } finally {
          loading.close()
        }
      },
      // 搜索
      onSearch () {
        this.knowledgeParams.page = 1;
        this.fetchTableData();
      },
      // 重置
      onRest () {
        let vm = this;
        vm.knowledgeParams = {
          topicId: vm.$route.params.id,
          page: 1,
          size: 10,
          total: 0,
          token: getUser().token
        }
        vm.fetchTableData()
      },
      createTheme () {
        let vm = this
        vm.dialogHandleType = 'add'
        vm.$refs['dialog'].show()
      },
      refreshTable (v) {
        let vm = this
        vm.knowledgeParams.page = 1
        vm.fetchTableData()
        vm.$refs['dialog'].hide()
      },
      refreshCheckTable () {
        let vm = this
        vm.knowledgeParams.page = 1
        vm.fetchTableData()
      },
      // 查看
      check (row) {
        let vm = this
        vm.dialogHandleType = 'check'
        vm.$refs['checkDialog'].setFormDatas(row)
        vm.$refs['checkDialog'].show()
      },
      edit (row) {
        let vm = this
        vm.dialogHandleType = 'edit'
        vm.$refs['dialog'].setFormDatas(row)
        vm.$refs['dialog'].show()
      },
    }
  };
</script>
<style>
    .divRight .el-form-item__label {
        font-size: 16px;
    }
</style>
<style lang="scss" scoped>
    .content {
        padding: 0px 10px;
    }

    .contentView {
        .cont {
            margin-bottom: 16px;
        }

        .title {
            display: inline-block;
            font-size: 22px;
            font-weight: 400;
            color: #1f2f3d;
        }

        .name {
            display: inline-block;
            font-size: 16px;
            color: #909399;
            margin-left: 16px;
        }

        .contView {
            height: 20px;
            padding-right: 65px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 18px;
            color: #606266;
            position: relative;
            -webkit-box-orient: vertical;
            -webkit-box-direction: reverse;
            -ms-flex-flow: column-reverse nowrap;
            flex-flow: column-reverse nowrap;

            .open {
                font-size: 18px;
                color: #409eff;
                position: absolute;
                right: 0px;
                top: 0px;
            }
        }

        .contH.contView {
            min-height: 100px;
            overflow: auto;
            text-overflow: inherit;
            white-space: inherit;
        }
    }

    .contentPage {
        padding: 0px 20px;
    }

    .contViews {
        border-bottom: 1px solid #DCDFE6;
        padding-bottom: 16px;

        .titleLine {
            margin-bottom: 16px;
            margin-top: 10px;

            .title {
                font-size: 18px;
                font-weight: 400;
                color: #1f2f3d;
            }

            .work {
                padding-top: 5px;
                float: right;
                color: #909399;

                .name {
                    margin-left: 10px;
                    font-size: 16px;
                }

                .name.handle:hover {
                    color: #409eff;
                }

                .handle {
                    color: green;
                    cursor: pointer;
                }
            }
        }
    }

    .divLift {
        padding-right: 230px;
        position: relative;
        height: 120px;
        color: #606266;

        .cont {
            font-size: 16px;
            margin-bottom: 16px;
            overflow: hidden;
            text-overflow: ellipsis;

            span {
                display: inline-block;
                position: relative;
                line-height: 22px;
                overflow: hidden;
                max-height: 87px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            span::after {
                content: "...";
                position: absolute;
                bottom: 0;
                font-size: 18px;
                right: 0px;
                background: -webkit-linear-gradient(left, transparent, #fff 0%);
                background: -o-linear-gradient(right, transparent, #fff 0%);
                background: -moz-linear-gradient(right, transparent, #fff 0%);
                background: linear-gradient(to right, transparent, #fff 0%);
            }
        }

        .hefLine {
            position: absolute;
            left: 0;
            bottom: 0px;
            color: #909399;
            font-size: 16px;

            span {
                margin-left: 16px
            }

            span:first-child {
                margin-left: 0px
            }
        }
    }

    .divRight {
        position: absolute;
        right: 0px;
        top: 0px
    }
</style>
