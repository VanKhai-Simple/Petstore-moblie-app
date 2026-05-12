import { BASE_URL, TIMEOUT_LIMIT } from './config';

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_LIMIT);

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const userApi = {
  login: (data) => fetchWithTimeout(
    '/User/Login', 
      { method: 'POST', 
        body: JSON.stringify(data) 
      }),
  register: (data) => fetchWithTimeout(
    '/User/Register', 
      { method: 'POST',
         body: JSON.stringify(data) 
      }),

  loginSocial: (data) => fetchWithTimeout(
    '/User/ExternalLogin',
     { method: 'POST', 
        body: JSON.stringify(data)
      }),
};

export const orderApi = {
  // Checkout gửi kèm token từ AsyncStorage
  checkout: (data, token) => fetchWithTimeout('/Order/Checkout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }),

  // Lấy danh sách đơn hàng của tôi
  getMyOrders: (token) => fetchWithTimeout('/Order/MyOrders', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  // Chi tiết đơn hàng
  getOrderDetail: (id, token) => fetchWithTimeout(`/Order/GetById/${id}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
};