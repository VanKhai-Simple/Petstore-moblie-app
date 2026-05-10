import { apiClient } from './client';
import { mapApiProduct } from './productService';

const normalizeCartItems = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.cartItems)) {
    return data.cartItems;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.data?.cartItems)) {
    return data.data.cartItems;
  }

  return [];
};

const mapCartLine = (item, index) => {
  const product = item.product
    ? mapApiProduct(item.product, index)
    : mapApiProduct({ id: item.productId, productName: item.productName, price: item.price }, index);

  return {
    id: item.id ?? item.cartItemId ?? `${item.productId}-${index}`,
    cartId: item.cartId,
    product,
    quantity: Number(item.quantity ?? 1)
  };
};

export const cartService = {
  async getMyCart() {
    const { data } = await apiClient.get('/Cart/MyCart');
    return data;
  },

  async getMyCartLines() {
    const data = await this.getMyCart();
    return normalizeCartItems(data).map(mapCartLine).filter((line) => line.product?.id);
  },

  async addToCart(productId, quantity = 1) {
    const { data } = await apiClient.post('/Cart/Add', {
      productId,
      quantity
    });
    return data;
  },

  async updateQuantity(productId, quantity) {
    const { data } = await apiClient.put('/Cart/UpdateQuantity', {
      productId,
      quantity
    });
    return data;
  },

  async removeItem(productId) {
    const { data } = await apiClient.delete(`/Cart/RemoveItem/${productId}`);
    return data;
  },

  async getSelected(ids) {
    const { data } = await apiClient.get('/Cart/GetSelected', {
      params: { ids: Array.isArray(ids) ? ids.join(',') : ids }
    });
    return normalizeCartItems(data).map(mapCartLine).filter((line) => line.product?.id);
  }
};
