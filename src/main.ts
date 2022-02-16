import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { registerStore } from "./store";
// 引入 element-plus样式
import "element-plus/dist/index.css";
import "@/styles/base.scss";
import '@/styles/reset.scss'
import "./permission";
// 引入时间处理库
import dayjs from "dayjs";
export const app = createApp(App);
app.use(router).use(store).mount("#app");
// 全局注册 dayjs 实例
app.config.globalProperties.$dayjs = dayjs;

// 注册全局store
registerStore();
