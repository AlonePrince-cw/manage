export default {
  data: () => ({
    visible: false
  }),
  methods: {
    show () {
      this.visible = true
      this.$emit('onShow')
    },
    hide () {
      this.visible = false
      this.$emit('onHide')
    }
  }
}
