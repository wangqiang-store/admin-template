<template>
  <el-container>
    <el-header class="d_flex d_flex_sb">
      <span>
        vue3.2 + ts + vite + element-plus 后台管理系统
      </span>
      <div class="d_flex">
        <el-dropdown
          trigger="click"
          class="userDropdown"
        >
          <el-icon>
            <avatar />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>{{userStore.username}}</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
              <el-dropdown-item>帮助</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="username">当前用户: {{userStore.username}}</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Menu />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { Avatar } from '@element-plus/icons-vue';
import Menu from './menu/index.vue';
import { appStore } from '@/store';
const userStore = appStore.userStore;
</script>

<style scoped lang="scss">
.el-container {
  min-height: calc(100vh - 60px);
}
.el-header {
  background-color: #282c34;
  color: var(--el-color-primary-light-9);
  line-height: 60px;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.1em;
  .userDropdown {
    font-size: 24px;
    margin-right: 20px;
  }
  .username {
    font-size: 14px;
  }
}

.el-aside,
.el-main {
  color: var(--el-text-color-primary);
  height: calc(100vh - 60px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}
.el-aside {
  background-color: #282c34;
}
.el-main {
  background-color: #e9eef3;
}
</style>