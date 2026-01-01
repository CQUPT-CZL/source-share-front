// 统一的请求工具类
const BASE_URL = 'http://10.16.27.222:8080/api';

export const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
    return request('/tokens', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  // 获取板块根目录ID
  getResourcesRootId: (category) => {
    return request(`/resources/root-id?category=${category}`, {
      method: 'GET',
    });
  },

  // 获取子目录/文件
  getResourcesChildren: (parentId) => {
    return request(`/resources/${parentId}/children`, {
      method: 'GET',
    });
  },

  // 创建资源 (目录/文件)
  createResource: (data) => {
    return request('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 上传文件
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/files/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // 注册用户 (管理员)
  registerUser: (userData) => {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 搜索资源
  searchResources: (keyword, folderId = null) => {
    const query = new URLSearchParams({ keyword });
    if (folderId) {
      query.append('folderId', folderId);
    }
    return request(`/resources?${query.toString()}`, {
      method: 'GET',
    });
  },

  // 删除资源
  deleteResource: (resourceId) => {
    return request(`/resources/${resourceId}`, {
      method: 'DELETE',
    });
  },

  // 获取系统日志 (管理员)
  getLogs: (page = 0, size = 20) => {
    return request(`/logs?page=${page}&size=${size}`, {
      method: 'GET',
    });
  },

  // 获取统计信息
  getStatistics: () => {
    return request('/statistics', {
      method: 'GET',
    });
  },
};