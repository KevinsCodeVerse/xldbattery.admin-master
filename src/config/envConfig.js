const proxyConfig = {
  // 通用参数
  common: {
    // 基础路径
    baseUrl: "/newAdmin/",

    // token 名称
    tokenName: "adminToken"
  },

  //开发环境
  dev: {
    // 是否显示菜单管理操作按钮
    isShowMenuOpertionBtn: true,

    // 代理url前缀
    api: "/api"
  },

  //线上环境
  prod: {
    // 是否显示菜单管理操作按钮
    isShowMenuOpertionBtn: false,

    // api: '/api', //4.24暂改
    api: "/apiV2"
  }
};

let envConfig =
  process.env.NODE_ENV === "development" ? proxyConfig.dev : proxyConfig.prod;

let result = Object.assign(envConfig, proxyConfig.common);

module.exports = result;
