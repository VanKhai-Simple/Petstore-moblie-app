import { apiClient, API_BASE_URL } from './client';
import { products as fallbackProducts } from '../data/mockProducts';
import { resolveProductImage } from '../data/localAssets';

const isUsableImage = (imageUrl) =>
  Boolean(imageUrl && imageUrl.trim() && imageUrl.trim().toLowerCase() !== 'string');

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveDbImageUrl = (product) => {
  const defaultImage = Array.isArray(product?.productImages)
    ? product.productImages.find((image) => image?.isDefault)?.imageUrl ?? product.productImages[0]?.imageUrl
    : undefined;
  const imageUrl = product?.mainImage ?? product?.imageUrl ?? defaultImage;

  if (!isUsableImage(imageUrl)) {
    return undefined;
  }

  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${API_ORIGIN}${trimmed}`;
  }

  return trimmed;
};

const normalizeApiList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const mapCategory = (category) =>
  category
    ? {
        id: category.id,
        name: category.name ?? category.categoryName ?? 'Pet Shop'
      }
    : undefined;

const getFallbackByProduct = (product, index = 0) => {
  if (product?.categoryId === 1) {
    return fallbackProducts[index % 6];
  }

  if (product?.categoryId === 2) {
    return fallbackProducts[6 + (index % 3)] ?? fallbackProducts[6];
  }

  return fallbackProducts[index % fallbackProducts.length];
};

export const mapApiProduct = (product, index = 0) => {
  if (!product) {
    const fallback = fallbackProducts[index % fallbackProducts.length];
    return fallback;
  }

  const fallback = getFallbackByProduct(product, index);
  const description =
    product.description ??
    product.fullDescription ??
    product.condition ??
    product.healthStatus ??
    fallback.description;
  const imageUrl = resolveDbImageUrl(product) ?? fallback.imageUrl;

  return {
    id: product.id,
    name: product.name ?? product.productName ?? fallback.name,
    description: description && description !== 'string' ? description : fallback.description,
    price: Number(product.finalPrice ?? product.price ?? fallback.price),
    imageUrl,
    rating: Number(product.rating ?? fallback.rating),
    reviewCount: Number(product.reviewCount ?? fallback.reviewCount),
    stock: Number(product.stock ?? product.stockQuantity ?? fallback.stock),
    originalPrice: Number(product.price ?? fallback.price),
    discountPrice: product.discountPrice == null ? null : Number(product.discountPrice),
    discountPercent: product.discountPercent ?? null,
    isDiscount: Boolean(product.isDiscount),
    categoryId: product.categoryId,
    category: mapCategory(product.category),
    badge: product.badge ?? (product.isDiscount && product.discountPercent ? `${product.discountPercent}% OFF` : fallback.badge),
    createdAt: product.createdAt,
    image: resolveProductImage(imageUrl),
    size: fallback.size
  };
};

const hydrateProducts = (data) => normalizeApiList(data).map((product, index) => mapApiProduct(product, index));

export const productService = {
  async getProducts() {
    const { data } = await apiClient.get('/Product/Search');
    return hydrateProducts(data);
  },

  async getProductsByCategory(categoryId) {
    const { data } = await apiClient.get('/Product/Search', { params: { categoryId } });
    return hydrateProducts(data);
  },

  async getProduct(id) {
    const { data } = await apiClient.get(`/Product/${id}`);
    return mapApiProduct(data);
  },

  async searchProducts(keyword) {
    const { data } = await apiClient.get('/Product/Search', { params: { search: keyword } });
    return hydrateProducts(data);
  },

  async getCategories() {
    const { data } = await apiClient.get('/Category');
    return data.map((category) => ({
      id: category.id,
      name: category.name ?? category.categoryName ?? 'Pet Shop'
    }));
  },

  async getCuratedProducts() {
    try {
      return await this.getProducts();
    } catch {
      return fallbackProducts;
    }
  }
};
