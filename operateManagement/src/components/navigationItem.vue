<template>
  <div v-if="item.hstonePermissions">
    <template v-if="item.hstonePermissions.length == 0">
      <el-menu-item :index="item.id" @click="nodeClick(item)">
        {{item.name}}
      </el-menu-item>
    </template>
    <el-submenu v-else :index="item.id">
      <template slot="title" >
        {{item.name}}
      </template>
      <template v-for="child in item.hstonePermissions">
        <navigation-item
          v-if="child.hstonePermissions && child.hstonePermissions.length>0"
          :item="child"
          :key="child.id"/>
        <el-menu-item v-else :key="child.id" :index="child.id" @click="nodeClick(child)">
          {{child.name}}
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
  import { getUser, setNode, getNode, setPerm } from '@/utils/auth'
  import { nodePerm } from '@/api/common'
  export default {
    name: 'navigationItem',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    methods: {
      nodeClick(node){
        this.nodePerm(node.id,node)
      },
      async nodePerm(v,node){
        let params = {
          parentId: v,
          token: getUser().token
        }
        let {data} = await nodePerm(params)
        setPerm(data)
        if (node.type.toString() === '2' && node.viewUrl) {
          setNode(node)
          this.$router.push({ path: `${node.viewUrl}/${node.id}` })
        }
      }
    }
  }
</script>
