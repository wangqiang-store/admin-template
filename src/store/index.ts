import { createPinia } from "pinia";
import { createPersistedState } from "pinia-persistedstate-plugin";
import { userStore } from "./userStore";
const store = createPinia();
store.use(
  createPersistedState({
    /**
     * storage, default is `window.localStorage`
     */
    storage: window.sessionStorage,
    /**
     * storage key, default is `pinia`
     */
    key: "pinia",
    /**
     * is open logger, default is `false`
     */
    logger: false,
  })
);

// 全局注册 appStore
export let appStore: any = {};

export let registerStore = () => {
  appStore.userStore = userStore();
};
export default store;
