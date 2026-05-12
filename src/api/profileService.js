import { apiClient, API_BASE_URL } from './client';
import { mapApiProduct } from './productService';

const placeholderAvatar = require('../../assets/ProfileScreen1.png');
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImage = (value) => {
  if (!value || value === 'string') {
    return placeholderAvatar;
  }

  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return { uri: trimmed };
  }

  if (trimmed.startsWith('/')) {
    return { uri: `${API_ORIGIN}${trimmed}` };
  }

  return { uri: trimmed };
};

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const mapOrder = (order) => {
  const details = normalizeList(order?.orderDetails, 'items');
  const firstDetail = details[0];
  const firstProduct = firstDetail?.product ? mapApiProduct(firstDetail.product) : null;

  return {
    id: order.id,
    status: order.status ?? 'Đang xử lý',
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    orderDate: order.orderDate,
    totalAmount: Number(order.totalAmount ?? 0),
    address: order.address,
    phoneNumber: order.phoneNumber,
    fullName: order.fullName,
    details,
    firstProduct
  };
};

export const profileService = {
  async getProfile() {
    const { data } = await apiClient.get('/User/Profile');
    const profile = data?.userProfile ?? data?.profile ?? data;
    return {
      id: profile?.id ?? data?.id,
      username: data?.username ?? profile?.username,
      fullName: profile?.fullName ?? data?.fullName ?? data?.username ?? 'Khách hàng ManaPet',
      email: profile?.email ?? data?.email,
      phone: profile?.phone ?? data?.phone,
      address: profile?.address ?? data?.address,
      avatar: resolveImage(profile?.avatar ?? data?.avatar),
      birthDate: profile?.birthDate,
      createdAt: data?.createdAt
    };
  },

  async getMyOrders() {
    const { data } = await apiClient.get('/Order/MyOrders');
    return normalizeList(data, 'orders').map(mapOrder);
  }
};
