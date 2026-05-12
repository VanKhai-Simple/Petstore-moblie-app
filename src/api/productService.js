import { apiClient, API_BASE_URL } from './client';

const placeholderImage = require('../../assets/placeholder.png');

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

export const mapApiProduct = (product, index = 0) => {
  if (!product) {
    return null;
  }

  const description =
    product.description ??
    product.fullDescription ??
    product.condition ??
    product.healthStatus ??
    product.character ??
    'Chưa có mô tả cho sản phẩm này.';
  const imageUrl = resolveDbImageUrl(product);
  const price = Number(product.finalPrice ?? product.discountPrice ?? product.price ?? 0);
  const originalPrice = Number(product.price ?? price);
  const stock = Number(product.stock ?? product.stockQuantity ?? 0);

  return {
    id: product.id,
    name: product.name ?? product.productName ?? 'Sản phẩm ManaPet',
    description: description && description !== 'string' ? description : 'Chưa có mô tả cho sản phẩm này.',
    price,
    imageUrl,
    rating: Number(product.rating ?? 5),
    reviewCount: Number(product.reviewCount ?? 0),
    stock,
    originalPrice,
    discountPrice: product.discountPrice == null ? null : Number(product.discountPrice),
    discountPercent: product.discountPercent ?? null,
    isDiscount: Boolean(product.isDiscount),
    categoryId: product.categoryId,
    category: mapCategory(product.category),
    badge: product.badge ?? (product.isDiscount && product.discountPercent ? `-${product.discountPercent}%` : stock <= 3 && stock > 0 ? 'SẮP HẾT' : null),
    createdAt: product.createdAt,
    image: imageUrl ? { uri: imageUrl } : placeholderImage,
    isPet: product.isPet,
    ageMonths: product.ageMonths,
    gender: product.gender,
    fatherInfo: product.fatherInfo,
    motherInfo: product.motherInfo,
    furColor: product.furColor,
    healthStatus: product.healthStatus,
    condition: product.condition,
    dewormed: product.dewormed,
    origin: product.origin,
    character: product.character,
    fullDescription: product.fullDescription
  };
};

const hydrateProducts = (data) => normalizeApiList(data).map((product, index) => mapApiProduct(product, index)).filter(Boolean);

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
    return normalizeApiList(data).map((category) => ({
      id: category.id,
      name: category.name ?? category.categoryName ?? 'Pet Shop',
      description: category.description
    }));
  }
};
