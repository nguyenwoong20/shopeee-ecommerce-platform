import client from './client';
import type { Category, PagedResponse, Product } from '../types';

export const fetchProducts = (page = 0, size = 20, sort = 'bestseller') =>
  client.get<PagedResponse<Product>>('/products', { params: { page, size, sort } }).then(r => r.data);

export const fetchProductById = (id: number) =>
  client.get<Product>(`/products/${id}`).then(r => r.data);

export const searchProducts = (q: string, page = 0, size = 20) =>
  client.get<PagedResponse<Product>>('/products/search', { params: { q, page, size } }).then(r => r.data);

export const fetchFlashSale = () =>
  client.get<Product[]>('/products/flash-sale').then(r => r.data);

export const fetchFeatured = () =>
  client.get<Product[]>('/products/featured').then(r => r.data);

export const fetchCategories = () =>
  client.get<Category[]>('/categories').then(r => r.data);

export const fetchByCategory = (id: number, page = 0, size = 20, sort = 'bestseller') =>
  client.get<PagedResponse<Product>>(`/categories/${id}/products`, { params: { page, size, sort } }).then(r => r.data);
