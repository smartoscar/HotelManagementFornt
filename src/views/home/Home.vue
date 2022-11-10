<template>
  <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
</template>
<script>
import { inject, onMounted } from "vue";

export default {
  name: "App",
  setup() {
    //引入
    let echarts = inject("ec");
    //需要获取到element,所以是onMounted的Hook
    onMounted(() => {
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "总用户量" },
        tooltip: {},
        xAxis: {
          data: ["12-3", "12-4", "12-5", "12-6", "12-7", "12-8"],
        },
        yAxis: {},
        series: [
          {
            name: "用户量",
            type: "line",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
      //自适应大小
      window.onresize = function () {
        myChart.resize();
      };
    });
  },
  components: {},
  mounted() {},
};
</script>
<style scoped lang='scss'>
</style>