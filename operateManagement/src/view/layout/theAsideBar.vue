<template>
  <el-aside class="aside-bar" width="240px" ref="aside">
    <menuItem>
    </menuItem>
  </el-aside>
</template>

<script>
import menuItem from './menuItem'
import _ from 'lodash'

export default {
  name:'theAsideBar',
  components:{
    menuItem
  },
  data(){
    return {

    }
  },
  created (){
    
  },
  computed:{

  },
  methods:{

  }
}
</script>

<style lang="scss">
  .el-aside{
    height:100%;
    .el-submenu__title{height: 50px;line-height: 50px;}
    .el-submenu__title i{color: #333}
    .menu-icon{display:inline-block;width: 30px;height: 30px;font-size: 20px;line-height: 30px;text-align: center;}
    .el-submenu__icon-arrow{font-size: 16px}
    .el-menu-item.menuTree:focus,.el-menu-item.menuTree:hover{
      background-color: #fff;
    }
    .menuTopLevel {
      &:last-child {
        border-bottom: 1px solid #dddddd;
      }
    }
    .menuTopLevel>.el-submenu__title{
      padding-left:5px;border-top: 1px solid #dddddd;
    }
    .menuTopLevel.is-opened>.el-submenu__title{
      background: #e7eaec;
    }
    .el-submenu__title:hover, .el-submenu__title:focus{
      background: #e7eaec;
    }
    .el-menu-vertical{
      position: relative;
      left: 0;
      width: 100%
    }
  }
</style>
<style lang="scss" scoped>

  .menuItem {
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
      height: 50px;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgb(231, 234, 236);
      }

      &.is-active {
        background: rgb(231, 234, 236);

        .submenu-caret {
          transform: rotate(180deg);
        }
      }
    }

    &-icon {
      position: absolute;
      left: 5px;
      top: 10px;
      display: block;
      width: 30px;
      height: 30px;
      font-size: 20px;
      line-height: 30px;
      text-align: center;
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