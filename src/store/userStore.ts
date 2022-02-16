import { defineStore } from "pinia";
import { getToken, setToken, generaMenu } from "../utils/auth";
import router, { routes } from "../router";
import { signIn, getInfo } from "@/api/system/sysUser";
import { RES_SUCCESS } from "@/api/common";
import { getSide } from "@/api/system/sysModule";

interface userState {
  username: string;
  password: string;
}

export const userStore = defineStore("user", {
  // other options...
  state: () => {
    return {
      name: "",
      username: "",
      roles: [], //角色
      routers: [],
      addRouters: [],
      roleId: "", //角色id
      userId: "", //用户id
      routerModule: [], //路由模块
      allModule: [], //所有模块
      userList: [], //所有用户
    };
  },
  getters: {
    getRoles(): Array<any> {
      return this.roles;
    },
  },
  actions: {
    // 修改用户信息
    SET_UserInfo(userInfo: any) {
      this.name = userInfo.name;
      this.username = userInfo.username;
      this.userId = userInfo.id;
      this.roleId = userInfo.roleId;
    },
    // 获取所有角色
    SET_ROLES(roles: any) {
      this.roles = roles;
    },
    // 动态添加路由
    SET_ROUTER(routers: any) {
      this.addRouters = routers;
      this.routers = routes.concat(routers) as any;
      router.options.routes = this.routers;
      for (let item of routers) {
        router.addRoute(item);
      }
      //   router.addRoute({
      //     path: "/:pathMatch(.*)", // :pathMatch(.*)  :catchAll(.*)
      //     name: "notFound",
      //     component: () => import("@/views/notFound.vue"),
      //   });
    },
    CLEAR_ROUTER(routers: any) {
      router.options.routes = routers;
    },
    SET_ROUTERMODULES(modules: any) {
      this.routerModule = modules;
    },
    SET_MODULE(modules: any) {
      this.allModule = modules;
    },
    // 获取所有用户
    SET_USERS(users: any) {
      this.userList = users;
    },
    // 登录
    signIn(userInfo: userState) {
      this.SET_ROLES([]);
      let username = userInfo.username.trim();
      return new Promise<void>(async (resolve, reject) => {
        try {
          let { data } = await signIn({
            username,
            password: userInfo.password,
          });
          if (data.code === RES_SUCCESS) {
            setToken(data.data.jws);
            localStorage.setItem("ExpirationTime", data.data.expirationTime);
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    // 获取用户信息
    GetInfo() {
      return new Promise<void>(async (resolve, reject) => {
        try {
          let { data } = await getInfo();
          if (data.code === RES_SUCCESS) {
            this.SET_UserInfo(data.data);
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    // 获取路由模块
    GenerateRoutes() {
      return new Promise<void>(async (resolve, reject) => {
        if (localStorage.getItem("Router") == null) {
          try {
            let { data } = await getSide();
            if (data.code === RES_SUCCESS) {
              this.SET_ROUTERMODULES(data.data);
              let routers: Array<any> = [];
              generaMenu(routers, data.data);
              this.SET_ROUTER(routers);
              localStorage.setItem("Router", JSON.stringify(routers));
              resolve();
            }
          } catch (error) {
            reject(error);
          }
        } else {
          this.SET_ROUTER(JSON.parse(localStorage.getItem("Router") || "{}"));
          resolve();
        }
      });
    },
    // 前端 登出
    FedLogOut() {
      return new Promise<void>((resolve) => {
        this.CLEAR_ROUTER("");
        localStorage.clear();
        sessionStorage.clear();
        resolve();
      });
    },
  },
});
