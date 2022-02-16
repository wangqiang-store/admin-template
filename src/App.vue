<template>
  <el-config-provider :locale="locale">
    <router-view v-if="isRouterAlive"></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, ref } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { userStore } from '@/store/userStore';
let isRouterAlive = ref(true);
let locale = zhCn;
let user = userStore();
let reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide('reload', reload);
onMounted(() => {
  localStorage.removeItem('Router');
  user.SET_ROLES([]);
});
</script>

<style lang="scss">
.el-input__suffix-inner,
.el-input__prefix-inner {
  align-items: center !important;
}
</style>
