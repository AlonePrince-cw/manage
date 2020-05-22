<template>
    <div>
        <el-select
                placeholder="所属字典"
                filterable
                :value="value"
                @change="selectData"
                class="myselect">
            <el-option
                    v-for="item in orgData"
                    :value="item.id"
                    :label="item.fullName"
                    :key="item.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import { dictionaryManagementPage } from "@/api/dictionaryManagement";
    import { getUser } from "@/utils/auth";
    export default {
        props:{
            value:{
                type:String,
                default:''
            }
        },
        data() {
            return {
                Org: [],
                orgName: "",
                show: false,
                orgData: [],
                OrgId: null,
                defaultProps: {
                    children: "children",
                    label: "label"
                }
            };
        },
        created(){
            this.selectOrg()
        },
        methods: {
            async selectOrg() {
                let params = {
                    token: getUser().token
                };
                const data = await dictionaryManagementPage(params);
                this.orgData = data.data;
            },

            selectData(Org) {
                this.orgData.forEach(key => {
                    if (key.id === Org){
                        this.$emit("selectData", Org);
                        this.$emit('update:snycModel', key.id)
                        this.$emit("selectChange",key)
                    }
                })
            }
        }
    };
</script>
<style>

</style>
<style lang="scss" scoped>
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>