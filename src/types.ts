/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  article: string;
  brand: string;
  name: string;
  category: string;
  originalPrice: number;
  price: number;
  sizes: string[];
  description: string;
  stock: number; // 0 means out of stock
  image: string;
  season: 'Winter' | 'Spring/Autumn' | 'Summer' | 'All Season';
  gender: 'Boy' | 'Girl' | 'Unisex';
  material: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  gender: 'Boy' | 'Girl';
  age: number; // in years
  height: number; // in cm
  sizePreference: string;
  stylePreference: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  createdAt: string;
  source: 'Moguta Simulator' | 'PWA Concierge';
}

export interface WebhookDelivery {
  id: string;
  timestamp: string;
  url: string;
  event: 'order.create' | 'order.update' | 'payment.success';
  payload: string; // JSON Stringified
  status: 'sent' | 'failed';
  responseCode: number;
  responseBody: string;
}

export interface TelegramMessage {
  id: string;
  chatId: string;
  text: string;
  timestamp: string;
  isBotOutbound: boolean;
  type: 'order_notification' | 'payment_notification' | 'client_query' | 'technical_service';
}
