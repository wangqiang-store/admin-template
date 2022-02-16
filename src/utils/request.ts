import axios from "axios";
import { getToken, removeToken } from "./auth";
import { ElMessage } from "element-plus";
// 创建axios实例
axios.defaults.withCredentials = true;
const service = axios.create({
  baseURL: process.env.BASE_URL, // api 的 base_url
  timeout: 5000 * 6, // 请求超时时间
});
// 拦截请求白名单
let whiteListUrls: Array<string> = [];

// 正在进行中的请求列表
let reqList: any[] = [];

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function (
  reqList: any,
  url: string,
  cancel: any,
  errorMessage?: string
) {
  const errorMsg = errorMessage || "";
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url && !whiteListUrls.includes(url)) {
      cancel(errorMsg);
      return;
    }
  }
  reqList.push(url);
};

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function (reqList: any, url: string) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url && !whiteListUrls.includes(url)) {
      reqList.splice(i, 1);
      break;
    }
  }
};

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    if (getToken()) {
      // 让每个请求携带自定义token
      config.headers["Authorization"] = getToken();
    }
    let cancel;
    // 设置cancelToken对象
    config.cancelToken = new axios.CancelToken(function (c: any) {
      cancel = c;
    });
    // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(reqList, config.url as string, cancel);
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response: any) => {
    let time = setTimeout(() => {
      allowRequest(reqList, response.config.url as string);
      clearTimeout(time);
    }, 200);
    if (response.data.code === 401) {
      removeToken();
      localStorage.removeItem("ExpirationTime");
      ElMessage.warning("用户已超时,请确认账号情况重新登录");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
    if (
      response.data.code === 500 &&
      !whiteListUrls.includes(response.config.url as string)
    ) {
      ElMessage({
        message:
          response.data.msg.indexOf(":") !== -1
            ? response.data.msg.split(":")[1]
            : response.data.msg,
        type: "error",
      });
    }
    return response;
  },
  (error: any) => {
    if (error.message) {
      ElMessage({
        message: error.message,
        type: "error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);
export default service;
