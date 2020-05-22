<template>
    <div class="x-pagination">
        <span class="demonstration">共 {{total}} 条</span>

        <!--
            background:是否为分页按钮添加背景色
            layout:组件布局，子组件名用逗号分隔
            prev-text:替代图标显示的上一页文字
            next-text:替代图标显示的下一页文字
            current-page:当前页数，支持 .sync 修饰符
            page-size:每页显示条目个数
            pager-count:页码按钮的数量，当总页数超过该值时会折叠
            total:总条目数
            sizes：显示数据组件
            -->
        <el-pagination
            background
            layout="sizes,prev, pager, next,jumper"
            prev-text="上一页"
            next-text="下一页"
            :page-size="size"
            :page-sizes="pageSizes"
            @size-change="pageTotalChange"
            :page-count="total"
            :total="total"
            @current-change="pageChange"
            :current-page="current"
        >
        </el-pagination>
        <el-button type="primary" class="sure" size="small">跳转</el-button>
    </div>
</template>

<script>
const emptyFn = () => {
}

export default {
  props: {
    // 总页数
    total: { type: Number, default: 0 },
    // 当前第几页
    current: { type: Number, default: 1 },
    // 每页显示多少条
    size: { type: Number, default: 0 },
    pageSizes: { type: Array, default: () => [10, 20, 50, 100, 200, 500, 1000] },
    // current 改变时会触发
    pageChange: { type: Function, default: emptyFn },
    // // 每页总数改变时会触发
    pageTotalChange: { type: Function, default: emptyFn }
  },
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
    // 翻页
    .x-pagination {
        // padding-top: 8px;
        position: relative;
        overflow: hidden;
        text-align: right;
        padding: 20px 20px;
        width: 100%;
        background: #FFFFFF;
        .sure{position: absolute;right: 0px}
        .demonstration {
            font-size: 0.6rem;
            color: #67BCFF;
            float: left;
            line-height: 32px;
        }

        .el-pagination__sizes {
            float: left;
        }

        .pager {
            background: none;
            //color: #6f7de8;
            //border: 1px solid #6f7de8;
            border-radius: 3px;
            font-weight: normal;
        }

        .el-pagination {
            width: 90%;
            text-align: right;
            float: left;

            .el-pager li {
                @extend .pager;
                line-height: 25px;

                &.active {
                    //background: #6f7de8 !important;
                    //border-color: #6f7de8 !important;
                    color: white;
                }
            }

            .btn-next,
            .btn-prev {
                @extend .pager;
                padding: 0 10px;

                &.disabled {
                    border: 1px solid #c0c4cc;
                }
            }

            .el-pagination__total,
            .el-pagination__jump,
            .el-input__inner {
                //color: #6f7de8;
            }
        }
    }
</style>
