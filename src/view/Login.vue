<template>
  <div class="container">
    <div class="login_box">
      <h3 class="title">超长电缆安全监控系统管理平台</h3>
      <div class="login_item">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item prop="username">
            <el-input
              v-model="ruleForm.username"
              placeholder="请输入用户名"
              style="margin-bottom:10px"
              @keydown.enter="signIn(ruleFormRef)"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <user-filled />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="ruleForm.password"
              placeholder="请输入密码"
              show-password
              @keydown.enter="signIn(ruleFormRef)"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <calendar />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="sign_btn"
              type="primary"
              @click="signIn(ruleFormRef)"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { UserFilled, Calendar } from '@element-plus/icons-vue';
import md5 from 'js-md5';
import { appStore } from '@/store';
import { RES_SUCCESS } from '@/api/common';
import { ElMessage, ElNotification } from 'element-plus';
import type { ElForm } from 'element-plus';
import { useRouter } from 'vue-router';
const ROUTER = useRouter();
const userStore = appStore.userStore;
type FormInstance = InstanceType<typeof ElForm>;
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref({
  username: '',
  password: '',
});
let rules = ref({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
});
let signIn = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      ruleForm.value.password = md5(ruleForm.value.password);
      let data = await userStore.signIn(ruleForm.value);
      if (data.code === RES_SUCCESS) {
        nextTick(() => {
          ElMessage({
            message: '登录成功',
            type: 'success',
          });
        });
        ROUTER.push('/');
      }
    }
  });
};
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #282c34;
  position: relative;
  background-image: url('../assets/image/login_bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  .login_box {
    width: 20%;
    height: 60%;
    min-width: 325px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f6f6f6;
    box-shadow: 0 0 10px 0 #eee;
    border-radius: 8px;
    opacity: 0.8;
    overflow: hidden;
    .title {
      width: 100%;
      text-align: center;
      letter-spacing: 0.2em;
      color: #282c34;
      flex: 1;
      margin-top: 30px;
    }
    .login_item {
      width: 70%;
      flex: 3;
      .sign_btn {
        width: 100%;
        background-color: #1a3459;
        border-radius: 28px;
        border: 0;
        margin-top: 20px;
        font-weight: bold;
        color: #f6f6f6;
      }
    }
  }
}
</style>