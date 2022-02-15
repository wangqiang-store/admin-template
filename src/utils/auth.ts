import Layout from "@/view/layout/index.vue";
const AUTH_FIELD = "AUTH-TOKEN";

// 获取 TOKEN
export let getToken = (): string | null => {
  return localStorage.getItem(AUTH_FIELD);
};

// 修改 TOKEN
export let setToken = (value: string) => {
  localStorage.setItem(AUTH_FIELD, value);
};

// 删除 TOKEN
export let removeToken = () => {
  localStorage.removeItem(AUTH_FIELD);
};

// 动态路由
export function generaMenu(routers: any, data: any) {
  data.forEach((item: any) => {
    if (item.component != null && item.href != null) {
      const menu = {
        path: item.href,
        name: (item.href as string).includes("/")
          ? item.href.replace("/", "")
          : item.href,
        component:
          item.component == "Layout"
            ? Layout
            : () =>
                import(
                  /* @vite-ignore */ "@/view" + item.component + "/index.vue"
                ),
        children: [],
        meta: {
          id: item.id,
          icon: item.icon,
          title: item.name,
        },
      };
      if (
        item.children !== null &&
        item.children.length > 0 &&
        item.children[0].href
      ) {
        generaMenu(menu.children, item.children);
      }
      routers.push(menu);
    }
  });
  return routers;
}
