<template>
  <div class="menu-item">
    <navigation :menuList="menuList"/>
  </div>
</template>

<script>
import { getUser, setNode, getNode } from '@/utils/auth'
import { getMenuLists } from '@/api/common'
export default {
  name: "menuItem",
  props: {},
  data() {
    return {
      menuList: [],
      menuListParams: {
        token: getUser().token
      }
    };
  },
  computed: {},
  created() {
    let vm = this;
    vm.getMenuList()
  },
  mounted() {},
  methods: {
    async getMenuList(){
      let vm = this
      let { data } = await getMenuLists(vm.menuListParams)
      console.log(data)
      vm.menuList = data
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-item {
  border-top: 1px solid rgb(221, 221, 221);
  &:last-child {
    border-bottom: 1px solid rgb(221, 221, 221);
  }
  &-header {
    position: relative;
    font-size: 14px;
    padding: 5px 10px 5px 34px;
    line-height: 40px;
    color: #333;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
      background: rgb(231, 234, 236);
      color: cornflowerblue;
    }
    &.is-active {
      background: rgb(231, 234, 236);
      .submenu-caret {
        transform: rotate(180deg);
      }
    }
  }
  .submenu-caret {
    position: absolute;
    right: 20px;
    transition: all 0.3s;
  }

  &-content {
    height: 0;
  }
}
</style>