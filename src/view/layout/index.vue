<template>
  <el-container>
    <el-header class="d_flex d_flex_sb">
      <span>
        vue3.2 + ESLint + pinia + ts + element-plus 后台管理系统
      </span>
      <div class="d_flex">
        <el-dropdown
          trigger="hover"
          class="userDropdown"
        >
          <el-icon>
            <avatar />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click="signOut">
                退出登录
              </el-dropdown-item>
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
import { onMounted, ref, watch } from 'vue';
import { Avatar, WarningFilled } from '@element-plus/icons-vue';
import Menu from './menu/index.vue';
import { appStore } from '@/store';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { refreshToken } from '@/api/system/sysUser';
import { getToken, setToken } from '@/utils/auth';
import { RES_SUCCESS } from '@/api/common';
import { localRead, localWrite } from '@/utils/toolfun';
const userStore = appStore.userStore;
const globalStore = appStore.globalStore;
// 获取路由实例
let ROUTER = useRouter();
// token过期时间
let validTime = ref();
// 退出登录
let signOut = () => {
  ElMessageBox.confirm('是否确定退出登录?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.FedLogOut();
      ROUTER.push('/login');
      ElMessage({
        type: 'success',
        message: '退出成功',
      });
      clearTimeout(globalStore.setTokenTimer);
    })
    .catch(() => {});
};

// 刷新token
watch(validTime, (newValue) => {
  if (new Date().getTime() < newValue) {
    let tokenTimer = setTimeout(async () => {
      let res = await refreshToken(getToken() as string);
      if (res.data.code === RES_SUCCESS) {
        setToken(res.data.data.jws);
        localWrite('ExpirationTime', res.data.data.expirationTime);
        userStore.SET_TOKEN(res.data.data.jws);
        validTime.value = localRead('ExpirationTime');
      }
    }, newValue - new Date().getTime());
    globalStore.setTokenTimer(tokenTimer);
  } else {
    ROUTER.push('/login');
  }
});

onMounted(() => {
  validTime.value = localRead('ExpirationTime');
});
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