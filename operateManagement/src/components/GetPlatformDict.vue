<template>
  <treeselect
    :multiple="multiple"
    :placeholder="placeholder"
    :close-on-select="true"
    loading-text="正在加载..."
    noChildrenText="没有更多选项了"
    retryText="点击重试?"
    :value="value"
    :disabled="disabled"
    @open="openNodesFocus"
    :load-options="loadOrgOptions"
    @input="dictChange"
    :options="options"
    :clearable="clearable"
    v-bind="$attrs"
    :searchable="true"
    v-on="$listeners"/>
  <!--value-format="object"-->
</template>

<script>
  import { getTreeAllDict } from '@/api/common'
  import { getUser, getNode } from '@/utils/auth'
  import { transformDictTree } from '@/utils/util'

  export default {
    name: 'GetPlatformDict',
    props: {
      clearable: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      value: [String, Object, Array],
      dictType: { type: String, default: '' },
      placeholder: {
        type: String,
        default: '请选择'
      },
      businessType: {
        type: String,
        default: null
      },
      organizationId: {
        type: String,
        default: null
      },
    },
    data () {
      return {
        options: null
      }
    },
    methods: {
      openNodesFocus () {
        let vm = this
        let action = 'LOAD_ROOT_OPTIONS'
        let parentNode = ''
        let callback = null
        vm.loadOrgOptions({ action, parentNode, callback })
      },
      async loadOrgOptions ({ action, parentNode, callback }) {
        try {
          const parentId = parentNode ? parentNode.id : ''
          const type = this.dictType
          let params = {
            token: getUser().token,
            id: parentId,
            type: type,
          }
          const data = await getTreeAllDict(params)
          switch (action) {
            case 'LOAD_ROOT_OPTIONS':
              const nodes = transformDictTree(data.data).map(v => {
                v.isRoot = true
                return v
              })
              this.options = nodes
              break
            case 'LOAD_CHILDREN_OPTIONS':
              parentNode.children = transformDictTree(data.data)
              break
            default:

          }
        } catch (error) {
          callback(new Error('加载失败: 网络错误.'))
        }
      },
      dictChange(v){
        let vm = this
        vm.$emit('update:snycModel', v)
        vm.$emit('selectChange', v)
      }
    }
  }
</script>
