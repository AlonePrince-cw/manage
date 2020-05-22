<template>
  <div>
    <el-table
      highlight-current-row
      style="width: 100%;"
      :data="data"
      :height="height"
      @row-click="rowClick"
      @sort-change="sortChange"
      @selection-change="selectionChange"
      @row-dblclick="rowDblClick"
      border>
      <el-table-column v-if="checkBox" type="selection" width="50"  align="center"></el-table-column>
      <slot name="table-exp-top"></slot>
      <el-table-column v-for="column in columns"
         :fixed="column.fixed"
         :prop="column.value"
         :label="column.label"
         :key="column.value"
         :width="column.width"
         :sortable="column.sortable"
         :formatter="column.formatter"
         :class-name="column.className"
         :show-overflow-tooltip="true"
         align="center">
      </el-table-column>
      <slot name="table-exp"></slot>
    </el-table>
  </div>
</template>

<script>
import TableMixin from '@/mixins/table'
const emptyFn = () => {}
export default {
  name: 'Table',
  mixins: [TableMixin],
  props: {
    // 数据
    data: { type: Array, default: () => [], required: true },
    // 列数据
    columns: { type: Array, default: () => [], required: true },
    // 是否显示checkbox
    checkBox: { type: Boolean, default: false },
    // 是否显示序号
    indexShow: { type: Boolean, default: false },
    // 高度
    height: { type: Number },
    // 行点击事件
    rowClick: { type: Function, default: emptyFn },
    // 行双击事件
    rowDblClick: { type: Function, default: emptyFn },
    // 排序事件
    sortChange: { type: Function, default: emptyFn },
    // 当选择项发生变化时会触发该事件
    selectionChange: { type: Function, default: emptyFn }
  }
}
</script>

<style lang="scss">
</style>
