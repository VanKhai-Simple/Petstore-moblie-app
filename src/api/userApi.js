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
  login: (data) => fetchWithTimeout('/User/Login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => fetchWithTimeout('/User/Register', { method: 'POST', body: JSON.stringify(data) }),

  // --- THÊM HÀM NÀY CHO ĐỒ ÁN PET SHOP ---
  loginSocial: (data) => fetchWithTimeout('/User/ExternalLogin', { 
    method: 'POST', 
    body: JSON.stringify(data) // data này bao gồm { provider, token }
  }),
};