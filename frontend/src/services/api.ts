import axios from 'axios';
import {
  ApiResponse,
  User,
  Category,
  ProductCatalogItem,
  ProductDetail,
  CartData,
  Address,
  ShippingZone,
  Order,
  OrderStatus,
  PaymentMethod,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('forme_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Extract data or handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect if already on login/register
      const isAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
      if (!isAuthPage) {
        localStorage.removeItem('forme_token');
        localStorage.removeItem('forme_user');
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post<ApiResponse<{ accessToken: string; user: User }>>('/auth/login', {
      email,
      password,
    });
    return res.data;
  },
  register: async (fullName: string, email: string, password: string, phone?: string) => {
    const res = await api.post<ApiResponse<{ accessToken: string; user: User }>>('/auth/register', {
      fullName,
      email,
      password,
      phone,
    });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};

export const productsApi = {
  getCatalog: async (params?: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get<
      ApiResponse<{
        items: ProductCatalogItem[];
        pagination: { totalItems: number; totalPages: number; currentPage: number; limit: number };
      }>
    >('/products', { params });
    return res.data;
  },
  getDetail: async (identifier: string) => {
    const res = await api.get<ApiResponse<ProductDetail>>(`/products/${identifier}`);
    return res.data;
  },
  createProduct: async (data: any) => {
    const res = await api.post<ApiResponse<ProductDetail>>('/admin/products', data);
    return res.data;
  },
  updateProduct: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<any>>(`/admin/products/${id}`, data);
    return res.data;
  },
  updateVariantStock: async (variantId: string, stock: number) => {
    const res = await api.patch<ApiResponse<any>>(`/admin/products/variants/${variantId}/stock`, {
      stock,
    });
    return res.data;
  },
  deleteProduct: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/admin/products/${id}`);
    return res.data;
  },
};

export const categoriesApi = {
  getAll: async (includeInactive = false) => {
    const res = await api.get<ApiResponse<Category[]>>('/categories', {
      params: { includeInactive },
    });
    return res.data;
  },
  create: async (data: { name: string; description?: string }) => {
    const res = await api.post<ApiResponse<Category>>('/categories', data);
    return res.data;
  },
  update: async (id: string, data: { name?: string; description?: string; isActive?: boolean }) => {
    const res = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/categories/${id}`);
    return res.data;
  },
};

export const cartApi = {
  getCart: async () => {
    const res = await api.get<ApiResponse<CartData>>('/cart');
    return res.data;
  },
  addItem: async (variantId: string, quantity = 1) => {
    const res = await api.post<ApiResponse<CartData>>('/cart/items', { variantId, quantity });
    return res.data;
  },
  updateQuantity: async (itemId: string, quantity: number) => {
    const res = await api.patch<ApiResponse<CartData>>(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },
  removeItem: async (itemId: string) => {
    const res = await api.delete<ApiResponse<CartData>>(`/cart/items/${itemId}`);
    return res.data;
  },
  clearCart: async () => {
    const res = await api.delete<ApiResponse<CartData>>('/cart/clear');
    return res.data;
  },
};

export const shippingApi = {
  getZones: async (includeInactive = false) => {
    const res = await api.get<ApiResponse<ShippingZone[]>>('/shipping/zones', {
      params: { includeInactive },
    });
    return res.data;
  },
  createZone: async (data: { name: string; description?: string; rate: number }) => {
    const res = await api.post<ApiResponse<ShippingZone>>('/shipping/zones', data);
    return res.data;
  },
  updateZone: async (id: string, data: Partial<ShippingZone>) => {
    const res = await api.put<ApiResponse<ShippingZone>>(`/shipping/zones/${id}`, data);
    return res.data;
  },
  deleteZone: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/shipping/zones/${id}`);
    return res.data;
  },
};

export const addressesApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Address[]>>('/addresses');
    return res.data;
  },
  create: async (data: Omit<Address, 'id' | 'userId' | 'shippingZone'>) => {
    const res = await api.post<ApiResponse<Address>>('/addresses', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Address>) => {
    const res = await api.put<ApiResponse<Address>>(`/addresses/${id}`, data);
    return res.data;
  },
  setDefault: async (id: string) => {
    const res = await api.patch<ApiResponse<any>>(`/addresses/${id}/default`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/addresses/${id}`);
    return res.data;
  },
};

export const ordersApi = {
  checkout: async (data: { addressId: string; paymentMethod: PaymentMethod; notes?: string }) => {
    const res = await api.post<ApiResponse<{ order: Order; paymentInstructions: any }>>(
      '/orders',
      data,
    );
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get<ApiResponse<Order[]>>('/orders/my-orders');
    return res.data;
  },
  getOrderDetail: async (orderId: string) => {
    const res = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return res.data;
  },
  getAdminOrders: async (params?: { status?: OrderStatus; search?: string }) => {
    const res = await api.get<ApiResponse<Order[]>>('/admin/orders', { params });
    return res.data;
  },
  updateOrderStatus: async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const res = await api.patch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, {
      status,
      trackingNumber,
    });
    return res.data;
  },
};

export const paymentsApi = {
  uploadProof: async (orderId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<any>>(`/payments/${orderId}/proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  getPendingVerifications: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/payments/pending');
    return res.data;
  },
  verifyPayment: async (orderId: string, status: 'PAID' | 'REJECTED', rejectionReason?: string) => {
    const res = await api.patch<ApiResponse<any>>(`/admin/payments/${orderId}/verify`, {
      status,
      rejectionReason,
    });
    return res.data;
  },
};

export const reportsApi = {
  getDashboardMetrics: async () => {
    const res = await api.get<ApiResponse<any>>('/admin/reports/dashboard');
    return res.data;
  },
};
