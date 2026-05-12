import { apiClient } from './client';
import { mapApiProduct } from './productService';

export const orderService = {
  // Gửi đơn hàng lên server
  checkout: async (orderData) => {
    const { data } = await apiClient.post('/Order/Checkout', orderData);
    return data;
  },

  // Lấy danh sách đơn hàng và map ảnh sản phẩm đầu tiên để hiển thị ở list
  getMyOrders: async () => {
    const { data } = await apiClient.get('/Order/MyOrders');
    return data.map(order => ({
      ...order,
      displayProduct: order.orderItems?.[0]?.product ? mapApiProduct(order.orderItems[0].product) : null
    }));
  },

  // Lấy chi tiết 1 đơn hàng và map toàn bộ ảnh sản phẩm bên trong
  getOrderDetail: async (id) => {
    const { data } = await apiClient.get(`/Order/Detail/${id}`);
    if (data.orderItems) {
      data.orderItems = data.orderItems.map(item => ({
        ...item,
        mappedProduct: mapApiProduct(item.product)
      }));
    }
    return data;
  }
};