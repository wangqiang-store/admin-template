<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#282c34"
    class="el-menu-vertical-demo"
    text-color="#fff"
    :default-active="activeIndex"
    mode="vertical"
    router
  >
    <template
      v-for="item of routers"
      :key="item.path"
    >
      <el-menu-item
        class="home"
        v-if="(item.children!=undefined && item.name=='Layout') || (item.children!=undefined && item.children.length === 0)"
        :index="item.path === '/' ? item.redirect : item.path"
      >{{ item.meta.title }}</el-menu-item>
      <el-sub-menu
        :index="item.path"
        v-if="item.children!=undefined &&  item.children.length>0 && item.name!=='Layout'"
      >
        <template #title>{{item.meta.title}}</template>
        <div>
          <el-menu-item
            v-for="val of item.children"
            :key="`${val.path}`"
            :index="`${item.path}/${val.path}`"
            style="width:100%;text-align:center"
          >
            {{val.meta.title}}
          </el-menu-item>
        </div>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
<script lang="ts" setup>
import { appStore } from '@/store';
import { sessionRead, sessionWrite } from '@/utils/toolfun';
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue';
import { getCurrentInstance, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 获取vue实例
const { proxy }: any = getCurrentInstance();
// 获取userStore实例
const userStore = appStore.userStore;
// 获取路由实例
const ROUTE = useRoute();
const ROUTER = useRouter();
let activeIndex = reactive(sessionRead('oldPath'));
// 当前路由
let currentRoutePath = ref('');
// 角色路由
let routers = reactive(userStore.routers);
// 路由白名单
let routeWhiteList = ref<Array<string>>([]);

watch(
  () => ROUTE.path,
  (newData, oldData) => {
    currentRoutePath.value = newData;
    if (routeWhiteList.value.includes(newData)) {
      activeIndex = ROUTE.meta.parentPath;
      if (oldData != undefined) {
        sessionWrite('oldPath', ROUTE.meta.parentPath);
      } else {
        activeIndex = sessionRead('oldPath');
      }
    } else {
      activeIndex = newData;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.el-menu {
  border: 0;
}
</style>