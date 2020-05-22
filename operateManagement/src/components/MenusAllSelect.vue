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
    :options="options"
    :clearable="clearable"
    v-bind="$attrs"
    v-on="$listeners"/>
</template>

<script>
  import { getTreeAllMenus } from '@/api/common'
  import { getUser, getNode } from '@/utils/auth'
  import { transformOrg2Tree } from '@/utils/util'

  export default {
    name: 'RegionidSelect',
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
      value: {
        type: Object,
        default: null
      },
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
          const parentId = parentNode ? parentNode.id : '0'
          let params = {
            token: getUser().token,
            permissionId: parentId,
            parentType: '',
            businessType: "",
            organizationId: this.organizationId
          }
          const data = await getTreeAllMenus(params)
          switch (action) {
            case 'LOAD_ROOT_OPTIONS':
              const nodes = transformOrg2Tree(data.data).map(v => {
                v.isRoot = true
                return v
              })
              this.options = nodes
              break
            case 'LOAD_CHILDREN_OPTIONS':
              parentNode.children = transformOrg2Tree(data.data)
              break
            default:

          }
        } catch (error) {
          callback(new Error('加载失败: 网络错误.'))
        }
      }
    }
  }
</script>
