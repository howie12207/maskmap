import axios from "axios";
import { Loading, Message } from "element-ui";

let loadingInstance = null; // 加载全局的loading

const instance = axios.create({
  // 創建實例
  //   timeout: 5000,
  //   baseURL: "",
});

// instance.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";

let httpCode = {
  400: "請求參數錯誤",
  401: "權限不足，請重新登陸",
  403: "伺服器拒絕本次訪問",
  404: "請求資源未找到",
  500: "伺服器錯誤",
  501: "伺服器不支持該請求中使用的方法",
  502: "網關錯誤",
  504: "網關超時",
};

/** 請求攔截器 **/
instance.interceptors.request.use(
  (config) => {
    // config.headers["token"] = sessionStorage.getItem("token") || "";
    loadingInstance = Loading.service({
      // 發起請求時加載全局loading，請求失敗或有響應時會關閉
      spinner: "fa fa-spinner fa-spin fa-3x fa-fw",
      text: "加載中...",
    });
    // // 這裡可根據業務需求在發送請求前做些什麼;
    return config;
  },
  (error) => {
    // 如果請求錯誤，做這邊
    return Promise.reject(error);
  }
);

/** 響應攔截器 **/
instance.interceptors.response.use(
  (response) => {
    loadingInstance.close();
    // 響應結果的狀態根據實際給予
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      Message({
        message: response.data.message,
        type: "error",
      });
      return Promise.reject(response.data.message);
    }
  },
  (error) => {
    loadingInstance.close();
    if (error.response) {
      //   根據請求失敗的狀態碼給用戶提示;
      let tips =
        error.response.status in httpCode
          ? httpCode[error.response.status]
          : error.response.data.message;
      Message({
        message: tips,
        type: "error",
      });
      // 若status 為 401 則跳轉到login頁
      //   if (error.response.status === 401) {
      //     router.push({
      //       path: `/login`,
      //     });
      // }
      return Promise.reject(error);
    } else {
      Message({
        message: "請求超時，請刷新頁面重試",
        type: "error",
      });
      return Promise.reject(new Error("請求超時，請刷新頁面重試"));
    }
  }
);

// 封裝get請求
export const get = (url, params, config = {}) => {
  return instance({
    method: "get",
    url,
    params,
    ...config,
  })
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

// 封裝post請求
export const post = (url, data, config = {}) => {
  return instance({
    method: "post",
    url,
    data,
    ...config,
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
