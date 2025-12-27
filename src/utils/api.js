// 统一的请求工具类
const BASE_URL = 'http://10.16.27.222:8080/api';

/**
 * 通用请求函数
 * @param {string} endpoint - 接口地址，例如 '/login'
 * @param {object} options - fetch 配置项
 * @returns {Promise<any>}
 */
export const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    // 这里可以根据后端的通用返回结构做统一处理
    // 比如后端如果返回 { code: 200, data: ... } 可以在这里统一判断 code
    
    return data;
  } catch (error) {
    console.error(`Request failed for ${url}:`, error);
    throw error;
  }
};

// 具体的 API 集合
export const api = {
  login: (username, password) => {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  // 后续可以在这里添加更多接口
  // getUserInfo: () => request('/user/info'),
};
