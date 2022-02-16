import { defineStore } from "pinia";

interface globalState {
  tokenTimer: number | null;
}

export const globalStore = defineStore("global", {
  state: (): globalState => {
    return {
      tokenTimer: null, // 全局定时器  token过期时间
    };
  },
  actions: {
    setTokenTimer(timer: number | null) {
      this.tokenTimer = timer;
    },
  },
});
