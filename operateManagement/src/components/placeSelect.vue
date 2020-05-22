<template>
  <div class="placeSelect">
    <div class="display" :class="{active: value[0]}">
      <el-cascader ref="cascaderAddr" @change="propSelect" :value="value" :props="propData" :disabled="disabled" :placeholder="value[0]" expand-trigger="hover" style="width: 100%"></el-cascader>
    </div>
  </div>
</template>
<script>
    let id = 0;
    import { getPlace } from "@/api/common";
    import { getUser } from "@/utils/auth";
    import { packageData } from '@/utils/util'
    export default {
        props: {
          value: { type: Array, default:()=>[] },
          disabled: {
            type: Boolean,
            default: false
          },
        },
        data() {
            return {
                propData: {
                    lazy: true,
                    checkStrictly: true,
                    emitPath: true,
                    disabled: true,
                    async lazyLoad (node, resolve) {
                        let vm = this;
                        let placeParams = {
                            token: getUser().token,
                            parentId: '1'
                        }
                        placeParams.parentId = node.level === 0 ? '1' : node.data.value.value;
                        const { data } = await getPlace(placeParams)
                        let v = packageData(data)
                        resolve(v);
                    }
                }
            };
        },
        methods: {
            propSelect(v) {
                this.$emit('selectPlace',v)
            },
        }
    };
</script>
<style lang="scss">
  .placeSelect .active input.el-input__inner {
    &::placeholder {
       color:#333;
     }
  }
</style>