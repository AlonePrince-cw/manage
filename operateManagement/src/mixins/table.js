import _ from 'lodash'

export default {
  data () {
    return {
      queryParams: {
        page: 1,
        size: 10
      },
      extParams: {},
      tableData: {
        rows: [],
        total: 1
      }
    }
  },
  watch: {
    queryParams: {
      deep: true,
      handler () {
        this.fetchTableData()
      }
    }
  },
  methods: {
    refreshTable () {
      const extParams = _.cloneDeep(this.extParams)
      this.queryParams = {
        ...this.queryParams,
        ...extParams,
        page: 1
      }
    },
    onSearch () {
      this.extParams = { ...this.searchFormModel }
      this.refreshTable()
    }
  }
}
