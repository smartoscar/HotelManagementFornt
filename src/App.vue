<template>
  <router-view/>
</template>

<script>
import * as echarts from 'echarts'
import { provide } from 'vue'
 
export default {
  name: 'App',
  setup(){
    provide('ec',echarts)//provide
  },
  components: {
  }
}
</script>

<style lang="scss">
*{
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
    outline: none;
}
@font-face {
  font-family: 'bing';
  src: url(./assets/font/Aa棉花糖v1.2.ttf);
}
// 搜索区域样式
.search{
  padding-bottom: 6px;
  font-size: 14px;
  color: #666;
  display: block;
  align-content: center;
  *{
    margin-right: 5px;
  }
  div{
    display: flex;
    margin-bottom: 2px;
  }
}
// 编辑区域样式
.editItem {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &>span {
    width: 70px;
    text-align: right;
  }
  div {
    flex: 1;
  }
}
// 分页区域样式
.pagination {
  margin-top: 6px;
}
</style>