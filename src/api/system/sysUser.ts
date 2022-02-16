import request from "@/utils/request";
import qs from "qs";

// 获取token
export let signIn = (params: { username: string; password: string }) => {
  return request({
    url: "/sysUser/token",
    method: "get",
    params,
  });
};

export let twoSignIn = (params: any) => {
  return request({
    url: "/token/totp",
    method: "post",
    data: qs.stringify(params),
  });
};

//  获取用户信息
export let getInfo = () => {
  return request({
    url: "/sysUser/info",
    method: "get",
  });
};

export let refreshToken = (oldToken: string) => {
  return request({
    url: "/sysUser/refreshToken",
    method: "get",
    params: {
      jws: oldToken,
    },
  });
};
