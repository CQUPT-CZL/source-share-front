// 统一的请求工具类
const BASE_URL = 'http://10.16.27.222:8080/api';

export const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
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

  // --- 【请求拦截：Debug 输出】 ---
    console.groupCollapsed(`%c >>> HTTP Request: ${method} ${endpoint}`, 'color: #007bff; font-weight: bold;');
    console.log('Full URL:', url);
    console.log('Headers:', config.headers);
    if (config.body) {
      // 尝试解析 JSON 字符串，方便在控制台以对象形式查看
      try {
        console.log('Payload:', JSON.parse(config.body));
      } catch {
        console.log('Payload (Raw):', config.body);
      }
    }
    console.groupEnd();
  // ------------------------------

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    // --- 【响应拦截：Debug 输出】 ---
    console.log(`%c <<< Response from ${endpoint}:`, 'color: #28a745; font-weight: bold;', data);
    // ------------------------------

    return data;
  } catch (error) {
    console.error(`%c !!! Request Failed: ${url}`, 'color: #dc3545; font-weight: bold;', error);
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
};