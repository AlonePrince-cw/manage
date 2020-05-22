export default {
  computed: {
    images () {
      if (this.data && this.data.files) {
        return this.data.files.filter(v => v.dataType === '01')
      }

      return []
    },
    videos () {
      if (this.data && this.data.files) {
        return this.data.files.filter(v => v.dataType === '02')
      }
      return []
    },
    docs () {
      if (this.data && this.data.files) {
        return this.data.files.filter(v => v.dataType !== '01' && v.dataType !== '02')
      }

      return []
    }
  }
}
