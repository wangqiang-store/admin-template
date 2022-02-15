import request from "@/utils/request";

// 获取所有模块
export let getAllModule = () => {
  return request({
    url: "/sysModule/getModule",
    method: "get",
  });
};

export let getSide = () => {
  return request({
    url: "/sysModule/getSide",
    method: "get",
  });
};
