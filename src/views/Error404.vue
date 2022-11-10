<template>
    <div class="box">
        <img src="../assets/img/404.webp" alt="" @click="$router.push('/')">
    </div>
</template>
<script>
export default {
    name:'Error404'
}
</script>
<style scoped lang='scss'>
.box{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>