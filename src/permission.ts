import router from "./router";
import { getToken } from "./utils/auth";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { appStore } from "./store";
import { ElMessage } from "element-plus";
const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach(async (to, form, next) => {
  const userStore = appStore.userStore;
  NProgress.start();
  // 判断 是否登录
  if (getToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      // 验证 权限
      if (userStore.getRoles.length === 0) {
        try {
          const res = await userStore.GetInfo();
          var roles = [res.data.username];
          userStore.SET_ROLES(roles);
          await userStore.GenerateRoutes();
          next({ ...to, replace: true });
        } catch (err: any) {
          userStore.FedLogOut().then(() => {
            ElMessage.error(err || "Verification failed, please login again");
            next({
              path: "/",
            });
            NProgress.done();
          });
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next({ path: "/login" });
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
