<template>
    <div class="content-page">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="栏目管理" name="menu" v-loading="loading" element-loading-text="拼命加载中...">
                <el-form
                    class="dz-toolbar"
                    ref="searchForm"
                    :model="menulistParams"
                    :inline="true"
                    style="padding: 20px 12px 0 12px;">
                    <el-form-item label="菜单名称：">
                        <el-input v-model="menulistParams.name" placeholder="请输入菜单名称"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目类型：">
                        <el-select v-model="menulistParams.type" placeholder="请选择">
                            <el-option
                                v-for="item in menuTypeData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fr">
                        <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
                        <el-button icon="el-icon-close" type="danger" @click="onRest">重置</el-button>
                    </el-form-item>
                    <div style="clear: both"></div>
                </el-form>
                <el-row class="mb-20">
                    <div class="fr">
                        <el-button type="primary" icon="el-icon-plus" @click="menuAdd" v-if="permButton('201')">新增</el-button>
                    </div>
                </el-row>
                <Table :columns="menu_menuList_columns" :selectionChange="checkBoxChange" :data="menu_menuList_data">
                    <template slot="table-exp">
                        <el-table-column label="栏目路径" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span v-if="scope.row.url">{{scope.row.url}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="栏目类型" width="150" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-tag>{{scope.row.type | menuType}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="栏目权重" align="center" prop="weight"
                                         :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="按钮权限" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span v-if="scope.row.dataApi">{{scope.row.dataApi}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="menuCheck(scope.row)" type="text">查看</el-button>
                                <el-button size="small" @click="menuEdit(scope.row)" type="text" v-if="permButton('203')">修改</el-button>
                                <el-button size="small" @click="menuDel(scope.row)" type="text" v-if="permButton('204')">删除</el-button>
                            </template>
                        </el-table-column>
                    </template>
                </Table>
                <Pager :total="menulistParams.total" :pageTotalChange="handleSizeChange" :size="menulistParams.size"
                       :current="menulistParams.page" :pageChange="pageChange"></Pager>
            </el-tab-pane>
        </el-tabs>
        <ContentDialog ref="dialog" :dialogHandleType='dialogHandleType' @success="refreshTable"/>
    </div>
</template>
<script>
    import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
    import { menuListPage, menuDel } from '@/api/menu'
    import ContentDialog from './ContentDialog'

    const nullRender = null;
    const menuColumns = [
        {
            value: 'id',
            label: '栏目ID',
            width: 100,
            formatter: nullRender
        },
        {
            value: 'name',
            label: '栏目名称',
            formatter: nullRender
        },
    ];
    export default {
        name: 'menus',
        components: {
            ContentDialog
        },
        data () {
            return {
                loading: false,
                activeName: 'menu',
                menu_menuList_data: [],
                dialogHandleType: 'add',
                menuTypeData: [
                    {
                        id: 1,
                        name: '目录'
                    },
                    {
                        id: 2,
                        name: '菜单'
                    },
                    {
                        id: 3,
                        name: '按钮'
                    }
                ],
                menulistParams: {
                    page: 1,
                    size: 10,
                    type: '',
                    name: '',
                    token: getUser().token,
                },
                delParams: {
                    id: '',
                    token: getUser().token,
                },
                menu_menuList_columns: menuColumns
            }
        },
        computed: {},
        created () {
            let vm = this;
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
            refreshTable (v) {
                let vm = this;
                vm.menulistParams.page = 1;
                vm.fetchTableData();
                vm.$refs['dialog'].hide()
            },
            checkBoxChange () {

            },
            pageChange (v) {
                let vm = this;
                vm.menulistParams.page = v;
                this.fetchTableData()
            },
            handleSizeChange (v) {
                let vm = this;
                vm.menulistParams.size = v;
                vm.fetchTableData()
            },
            async fetchTableData () {
                let vm = this;
                vm.loading = true;
                let data = await menuListPage(vm.menulistParams);
                vm.menu_menuList_data = data.data;
                vm.menulistParams.total = data.total;
                vm.loading = false
            },
            onRest () {
                let vm = this;
                vm.menulistParams.name = '';
                vm.menulistParams.type = '';
                vm.fetchTableData()
            },
            onSearch () {
                let vm = this;
                vm.menulistParams.page = 1;
                vm.fetchTableData()
            },
            menuAdd () {
                let vm = this;
                vm.dialogHandleType = 'add';
                vm.$refs['dialog'].show()
            },
            menuEdit (v) {
                let vm = this;
                vm.dialogHandleType = 'edit';
                vm.$refs['dialog'].show();
                vm.$refs['dialog'].setFormDatas(v)
            },
            menuDel (v) {
                let vm = this;
                vm.$confirm(`确定要删除栏目？`, '提示', {
                    type: 'warning'
                }).then(async () => {
                    vm.delParams.id = v.id;
                    const loading = this.$loading({
                        lock: true,
                        text: '正在删除...'
                    });
                    try {
                        await menuDel(vm.delParams);
                        vm.$message.success('删除成功');
                        vm.fetchTableData()
                    } catch (err) {
                    } finally {
                        loading.close()
                    }
                }, _.noop)
            },
            menuCheck (v) {
                let vm = this;
                vm.dialogHandleType = 'check';
                vm.$refs['dialog'].show();
                vm.$refs['dialog'].setFormDatas(v)
            },
        }
    }
</script>

<style lang="scss">
    .addManagerRoles {
        .el-dialog__body {
            padding-left: 0px;
        }

        .el-select {
            width: 100%
        }

        .el-input-number {
            width: 100%;

            .el-input__inner {
                text-align: left;
            }
        }
    }
</style>
