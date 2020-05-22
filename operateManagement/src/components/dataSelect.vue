<template>
  <div>
    <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
     <el-date-picker
      v-model="value2"
      type="date"
      placeholder="选择日期"
      align="right"
      :picker-options="pickerOptions">
    </el-date-picker>
    <el-date-picker
    v-model="value3"
    type="month"
    placeholder="选择月">
  </el-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
        pickerOptions:{
           shortcuts: [{
               text: '清空',
               onClick(picker){

               }
           },{
               text: '确定'
           }
           
           ] 
        },
         pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      value1: "",
      value2: "",
      value3: "",
    };
  },
  methods: {
      
  }
};
</script>