/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Bot, 
  Store, 
  Smartphone, 
  Database, 
  Sparkles, 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Plus, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight, 
  BookOpen, 
  Settings, 
  FileText, 
  User, 
  Layers, 
  Info,
  Sliders,
  DollarSign,
  ChevronRight,
  UserCheck,
  Search,
  Check,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ChildProfile, Order, WebhookDelivery, TelegramMessage } from './types';
import { TECHNICAL_GUIDE_TEXT } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'showroom' | 'stylist' | 'telegram' | 'crm'>('showroom');
  
  // State from core database
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookDelivery[]>([]);
  const [tgMessages, setTgMessages] = useState<TelegramMessage[]>([]);
  const [systemPrompt, setSystemPrompt] = useState('');
  
  // Interactive UI states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stylerLoading, setStylerLoading] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);
  const [systemPromptSaving, setSystemPromptSaving] = useState(false);
  
  // Showroom selection & Cart
  const [selectedProductForQa, setSelectedProductForQa] = useState<Product | null>(null);
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaResponse, setQaResponse] = useState('');
  const [cart, setCart] = useState<Array<{ product: Product; size: string }>>([]);
  
  // Checkout Form
  const [checkoutName, setCheckoutName] = useState('Алёна Кравец');
  const [checkoutPhone, setCheckoutPhone] = useState('+7 (903) 445-56-78');
  const [checkoutEmail, setCheckoutEmail] = useState('alena.kravets@luxe-style.ru');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  // AI Styler form inputs
  const [stylerGender, setStylerGender] = useState<'Boy' | 'Girl'>('Girl');
  const [stylerAge, setStylerAge] = useState<number>(6);
  const [stylerHeight, setStylerHeight] = useState<number>(116);
  const [stylerOccasion, setStylerOccasion] = useState<string>('Семейный обед на вилле в Териберке');
  const [stylerPreference, setStylerPreference] = useState<string>('Светлые песочные тона, сочетание тренча и элегантной обуви');
  const [generatedLook, setGeneratedLook] = useState<any | null>(null);
  const [stylerError, setStylerError] = useState<string | null>(null);

  // AI Styler visualization states
  const [visualizeLoading, setVisualizeLoading] = useState(false);
  const [visualizeLoadingStep, setVisualizeLoadingStep] = useState('');
  const [visualizedImage, setVisualizedImage] = useState<string | null>(null);

  // AI Product Description Generator
  const [descBrand, setDescBrand] = useState('Burberry Kids');
  const [descName, setDescName] = useState('Waterproof Gabardine Hooded Vest');
  const [descCategory, setDescCategory] = useState('Outerwear Vest');
  const [descMaterial, setDescMaterial] = useState('Luxury Cotton and Nylon windproof blend');
  const [descSeason, setDescSeason] = useState('Spring/Autumn');
  const [descKeywords, setDescKeywords] = useState('классическая клетка Nova Check, премиум-фурнитура, защита от ветра');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [descLoading, setDescLoading] = useState(false);

  // Direct bot text input
  const [tgBotInput, setTgBotInput] = useState('');

  // Save child profile form
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileGender, setNewProfileGender] = useState<'Boy' | 'Girl'>('Girl');
  const [newProfileAge, setNewProfileAge] = useState(7);
  const [newProfileHeight, setNewProfileHeight] = useState(122);
  const [newProfileSize, setNewProfileSize] = useState('7Y');
  const [newProfileStyle, setNewProfileStyle] = useState('Moncler Sport-glam');

  // Load backend statistics
  const fetchAllData = async () => {
    try {
      const prodsRes = await fetch('/api/products');
      const prods = await prodsRes.json();
      setProducts(prods);

      const profilesRes = await fetch('/api/profiles');
      const childProfs = await profilesRes.json();
      setProfiles(childProfs);

      const ordersRes = await fetch('/api/orders');
      const ords = await ordersRes.json();
      setOrders(ords);

      const webhooksRes = await fetch('/api/webhooks');
      const whs = await webhooksRes.json();
      setWebhooks(whs);

      const tgRes = await fetch('/api/tg-messages');
      const msgs = await tgRes.json();
      setTgMessages(msgs);

      const promptRes = await fetch('/api/settings/prompt');
      const p = await promptRes.json();
      setSystemPrompt(p.systemPrompt);

      setLoadingProducts(false);
    } catch (err) {
      console.error("Error fetching initial data", err);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Setup simple polling to keep simulated TG messages and order listings synced
    const interval = setInterval(fetchAllData, 6000);
    return () => clearInterval(interval);
  }, []);

  // System State Reset
  const handleSystemReset = async () => {
    if (!window.confirm("Вы уверены, что хотите сбросить симулятор Moguta CMS к исходному демонстрационному состоянию? Это очистит новые заказы и логи.")) return;
    setActionLoading(true);
    try {
      await fetch('/api/system/reset', { method: 'POST' });
      await fetchAllData();
      setCart([]);
      setGeneratedLook(null);
      setGeneratedDesc('');
      alert("Состояние симулятора успешно сброшено!");
    } catch (error) {
      alert("Ошибка при сбросе системы");
    } finally {
      setActionLoading(false);
    }
  };

  // Add item to showroom client order builder
  const addToCart = (product: Product, size: string) => {
    if (product.stock <= 0) {
      alert("Этот размер отсутствует в наличии.");
      return;
    }
    setCart([...cart, { product, size }]);
  };

  const removeFromCart = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // Simulate web checkout trigger
  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Ваша корзина пуста.");
      return;
    }
    setActionLoading(true);
    try {
      const itemsPayload = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        size: item.size
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: checkoutName,
          customerPhone: checkoutPhone,
          customerEmail: checkoutEmail,
          items: itemsPayload,
          source: 'Moguta Simulator'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ошибка при оформлении заказа");
      }

      setOrderSuccessMessage(`Заказ №${data.order.id} оформлен на сумму ${data.order.totalAmount.toLocaleString('ru-RU')} ₽! Лог отправлен в Telegram.`);
      setCart([]);
      await fetchAllData();
      
      // Auto transition order success message
      setTimeout(() => setOrderSuccessMessage(null), 8000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Pay order (simulate payment gateway hook back to Moguta)
  const handlePayOrder = async (orderId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      if (res.ok) {
        await fetchAllData();
      } else {
        alert("Ошибка оплаты заказа.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Stock level of target in-memory item to demonstrate AI-exclusion filter
  const handleToggleStock = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/products/toggle-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Update System Prompt
  const handleSavePrompt = async () => {
    setSystemPromptSaving(true);
    try {
      const res = await fetch('/api/settings/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt })
      });
      if (res.ok) {
        alert("Правила AI-стилиста успешно обновлены!");
      }
    } catch (err) {
      alert("Не удалось сохранить промпт.");
    } finally {
      setSystemPromptSaving(false);
    }
  };

  // Call server-side lookup look builder
  const handleGenerateLook = async () => {
    setStylerLoading(true);
    setStylerError(null);
    setGeneratedLook(null);
    setVisualizedImage(null);
    try {
      const res = await fetch('/api/ai/styler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: stylerGender,
          age: stylerAge,
          height: stylerHeight,
          occasion: stylerOccasion,
          stylePreference: stylerPreference
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Gemini API Lookup Failed");
      }

      setGeneratedLook(data.look);
    } catch (err: any) {
      console.error(err);
      setStylerError(err.message || "Не удалось сгенерировать образ");
    } finally {
      setStylerLoading(false);
    }
  };

  // Run look visual sketch simulation
  const handleVisualizeLook = () => {
    setVisualizeLoading(true);
    setVisualizedImage(null);
    setVisualizeLoadingStep('Инициализация ИИ-генератора Imagen 3...');
    
    setTimeout(() => {
      setVisualizeLoadingStep('Анализ состава тканей и замера роста...');
      
      setTimeout(() => {
        setVisualizeLoadingStep('Рендеринг образа в стиле бренда...');
        
        setTimeout(() => {
          let selectedImg = '/src/assets/images/luxury_kid_casual_1780162514917.png';
          
          if (stylerGender === 'Girl') {
            selectedImg = '/src/assets/images/luxury_girl_party_1780162495315.png';
          } else if (stylerGender === 'Boy') {
            selectedImg = '/src/assets/images/luxury_boy_winter_1780162476334.png';
          }
          
          setVisualizedImage(selectedImg);
          setVisualizeLoading(false);
          setVisualizeLoadingStep('');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Generate luxury child product description card
  const handleGenerateDescription = async () => {
    setDescLoading(true);
    setGeneratedDesc('');
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: descBrand,
          name: descName,
          category: descCategory,
          material: descMaterial,
          season: descSeason,
          keywords: descKeywords
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to generate description");
      }
      setGeneratedDesc(data.description);
    } catch (err: any) {
      setGeneratedDesc(`Ошибка генерации: ${err.message}. Пожалуйста, убедитесь, что в AI Studio добавлены ваши Secrets.`);
    } finally {
      setDescLoading(false);
    }
  };

  // Product Q&A modal Trigger
  const handleProductQaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProductForQa || !qaQuestion.trim()) return;
    setQaLoading(true);
    setQaResponse('');
    try {
      const res = await fetch('/api/ai/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductForQa.id,
          question: qaQuestion
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "QA lookup error");
      }
      setQaResponse(data.answer);
    } catch (err: any) {
      setQaResponse(`Раздел Q&A временно недоступен: ${err.message}. Настройте секретный GEMINI_API_KEY.`);
    } finally {
      setQaLoading(false);
    }
  };

  // Submit direct chat prompt to simulated Telegram web channel
  const handleTgBotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tgBotInput.trim()) return;
    
    const userText = tgBotInput;
    setTgBotInput('');
    
    // Optimistic user display update
    setTgMessages(prev => [
      {
        id: "tg-user-tmp-" + Date.now(),
        chatId: "-1001844919",
        text: `👤 [Покупатель в Телеграм]: ${userText}`,
        timestamp: new Date().toISOString(),
        isBotOutbound: false,
        type: 'client_query'
      },
      ...prev
    ]);

    try {
      await fetch('/api/tg-messages/client-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: userText })
      });
      await fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add children profile to mock list
  const handleAddChildProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProfileName,
          gender: newProfileGender,
          age: newProfileAge,
          height: newProfileHeight,
          sizePreference: newProfileSize,
          stylePreference: newProfileStyle
        })
      });
      if (res.ok) {
        setNewProfileName('');
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Apply a child profile template to the styler form directly!
  const applyProfileToStyler = (prof: ChildProfile) => {
    setStylerGender(prof.gender);
    setStylerAge(prof.age);
    setStylerHeight(prof.height);
    setStylerPreference(`Для ребенка по имени ${prof.name}. Стиль: ${prof.stylePreference}. Рекомендуемый размер: ${prof.sizePreference}`);
    setActiveTab('stylist');
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#FAF9F5] text-[#2c2b29] font-sans">
      {/* 1. LUXURY TOP NAVIGATION HEADER */}
      <header id="luxury-header" className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE3D2] px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1A1918] text-[#EAE3D2] rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium tracking-tight uppercase text-[#1A1918]">
                  Moguta CMS AI & Telegram Hub
                </h1>
                <span className="text-[10px] bg-[#EAE3D2] px-2 py-0.5 rounded-full text-[#6D6351] font-mono tracking-wider uppercase">
                  Timeweb VPS Partner
                </span>
              </div>
              <p className="text-xs text-[#8A7E66] font-mono">
                Интеграция телеграм-вебхука в реальном времени & AI Стилиста для люкс-брендов
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSystemReset}
              disabled={actionLoading}
              title="Сбросить состояние симулятора до дефолтных демо-данных"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D5CBB3] rounded text-xs font-medium text-[#6D6351] bg-[#FFFDFC]/40 hover:bg-[#FFFDFC] transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
              Сброс демо
            </button>
            <div className="px-3 py-1.5 bg-[#FFFDFC] border border-[#EAE3D2] rounded text-xs font-mono text-[#8A7E66] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse inline-block"></span>
              Live VPS Webhook Node Active
            </div>
          </div>
        </div>
      </header>

      {/* TABS CONTROLLER */}
      <div className="bg-[#1A1918] text-white py-1">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs">
          <div className="flex gap-2 py-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('showroom')}
              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-1.5 uppercase tracking-wider ${
                activeTab === 'showroom' ? 'bg-[#938258] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              1. Витрина Moguta
            </button>
            <button
              onClick={() => setActiveTab('stylist')}
              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-1.5 uppercase tracking-wider ${
                activeTab === 'stylist' ? 'bg-[#938258] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              2. AI Образы & Описание
            </button>
            <button
              onClick={() => setActiveTab('telegram')}
              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-1.5 uppercase tracking-wider ${
                activeTab === 'telegram' ? 'bg-[#938258] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              3. Телеграм-Бот & Интеграция
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-1.5 uppercase tracking-wider ${
                activeTab === 'crm' ? 'bg-[#938258] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              4. CRM & Вебхуки
            </button>
          </div>
          <div className="hidden lg:block text-[10px] text-gray-500 font-mono text-right">
            Разделов: 4 • Логирование: Real-Time • API: Google Gemini SDK
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE CONSTRAINED CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* TAB 1: MOGUTA CMS WEB STORE SHOWROOM */}
        {activeTab === 'showroom' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-[#1A1918] tracking-tight">
                      Каталог БутикаДетскойЛюксОдежды (Эмуляция Moguta.CMS)
                    </h2>
                    <p className="text-xs text-[#8A7E66]">
                      Здесь собраны только оригинальные коллекции premium-марок с указанием фактологических складских остатков.
                    </p>
                  </div>
                  <div className="text-xs text-[#8A7E66] border border-[#EAE3D2] px-2.5 py-1 rounded bg-[#FAF9F5]">
                    Всего товаров: {products.length}
                  </div>
                </div>

                {loadingProducts ? (
                  <div className="py-20 text-center text-[#8A7E66] flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p>Загрузка каталога с сервера...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map(prod => (
                      <div 
                        key={prod.id} 
                        className={`flex flex-col border rounded-lg overflow-hidden transition-all duration-300 ${
                          prod.stock > 0 
                            ? 'bg-[#FFFDFC] border-[#E2D9C5] shadow-sm hover:shadow-md' 
                            : 'bg-gray-100 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="relative h-48 bg-gray-200">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-[#1A1918] text-[#FAF9F5] text-[10px] font-mono px-2 py-0.5 rounded tracking-wide uppercase">
                            {prod.brand}
                          </div>
                          <div className={`absolute bottom-2 right-2 px-2 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider ${
                            prod.stock > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-red-50 text-red-700 border border-red-300'
                          }`}>
                            {prod.stock > 0 ? `В наличии: ${prod.stock} шт` : "Нет на складе"}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start text-xs font-mono text-[#8A7E66]">
                              <span>Код: {prod.article}</span>
                              <span className="bg-[#FAF9F5] px-1.5 py-0.5 rounded text-[10px]">{prod.season}</span>
                            </div>
                            <h3 className="font-semibold text-sm text-[#1A1918] leading-tight line-clamp-1">
                              {prod.name}
                            </h3>
                            <p className="text-[11px] text-[#6D6351] line-clamp-3">
                              {prod.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-[#F2EDE2] space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                {prod.originalPrice > prod.price && (
                                  <span className="text-[11px] line-through text-[#8A7E66] block">
                                    {prod.originalPrice.toLocaleString('ru-RU')} ₽
                                  </span>
                                )}
                                <span className="font-semibold text-[#1A1918] text-base">
                                  {prod.price.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <div className="text-[11px] text-right font-mono text-[#8A7E66]">
                                Sizes: {prod.sizes.join(', ')}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {prod.stock > 0 ? (
                                <>
                                  <button
                                    onClick={() => addToCart(prod, prod.sizes[0] || "8Y")}
                                    className="flex-1 bg-[#1A1918] hover:bg-[#938258] text-white text-xs font-medium py-2 rounded transition flex items-center justify-center gap-1"
                                  >
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                    В заказ (импорт)
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedProductForQa(prod);
                                      setQaQuestion("Каковы особенности ухода за данным материалом и на какую погоду рассчитан?");
                                      setQaResponse("");
                                    }}
                                    className="px-2.5 bg-[#FAF9F5] border border-[#D5CBB3] hover:bg-[#F2EDE2] text-[#6D6351] rounded text-[#1A1918] font-medium text-xs flex items-center justify-center"
                                    title="Задать вопрос AI об этом товаре"
                                  >
                                    <Bot className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <div className="w-full text-center bg-gray-200 text-gray-500 font-mono py-2 rounded text-xs select-none uppercase font-semibold">
                                  Товар распродан (AI фильтрует)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* SIDE PANEL: SHOPPING CART WEB CHECKOUT */}
            <div className="space-y-6">
              
              <div className="bg-[#FFFDFC] p-6 rounded-xl border border-[#E2D9C5] shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#938258]"></div>
                <h2 className="text-base font-semibold text-[#1a1918] tracking-tight uppercase flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-[#938258]" />
                  Корзина заказа Moguta.CMS
                </h2>

                {cart.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-full text-gray-300">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <p>Корзина пуста. Добавьте детские товары из каталога или сгенерируйте AI образ!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-xs p-2.5 bg-[#FAF9F5] rounded border border-[#EAE3D2]">
                          <div>
                            <p className="font-semibold text-[#1A1918]">{item.product.brand}</p>
                            <p className="text-[11px] text-[#6D6351] line-clamp-1">{item.product.name}</p>
                            <span className="text-[10px] uppercase font-mono text-[#8a7e66]">размер: {item.size}</span>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <span className="font-semibold text-[#1a1918]">{item.product.price.toLocaleString('ru-RU')} ₽</span>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-red-600 hover:text-red-800 p-1 font-mono text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#F1EDE1] pt-3">
                      <div className="flex justify-between items-center font-semibold text-[#1A1918] text-sm">
                        <span>Итоговая сумма:</span>
                        <span className="text-base underline underline-offset-4 decoration-[#938258]">
                          {cart.reduce((sum, item) => sum + item.product.price, 0).toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>

                    {/* CUSTOMER WEB FORM */}
                    <form onSubmit={handleCheckout} className="space-y-3 pt-4 border-t border-[#F1EDE1]">
                      <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">Контакты Покупателя для CMS:</h3>
                      
                      <div>
                        <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">ФИО представителя:</label>
                        <input 
                          type="text" 
                          value={checkoutName}
                          onChange={e => setCheckoutName(e.target.value)}
                          required
                          className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#938258]"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Телефон:</label>
                        <input 
                          type="text" 
                          value={checkoutPhone}
                          onChange={e => setCheckoutPhone(e.target.value)}
                          required
                          className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#938258]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full py-2.5 bg-[#938258] hover:bg-[#1A1918] text-white font-bold uppercase tracking-wider text-xs rounded transition shadow-md flex items-center justify-center gap-1.5"
                      >
                        {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Завершить покупку в Moguta.CMS
                      </button>
                    </form>
                    <p className="text-[10px] text-center text-[#8A7E66] leading-relaxed">
                      При оформлении система спишет остаток, сформирует JSON вебхук, и мгновенно оповестит менеджеров в Телеграм (смотрите вкладку 3).
                    </p>
                  </div>
                )}
              </div>

              {/* SAVED KIDS PROFILES TO SPEED-RUN AI LUTE */}
              <div className="bg-white p-6 rounded-xl border border-[#EAE3D2]">
                <h3 className="text-sm font-semibold text-[#1A1918] mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#938258]" />
                  Сохраненные профили детей
                </h3>
                <p className="text-[11px] text-[#8A7E66] mb-4">
                  Привязаны к CRM-карточке клиента. Редактируются администратором. Клик по профилю заполнит AI Stylist:
                </p>

                <div className="space-y-3">
                  {profiles.map(prof => (
                    <div 
                      key={prof.id} 
                      onClick={() => applyProfileToStyler(prof)}
                      className="p-3 bg-[#FAF9F5] border border-[#EAE3D2] rounded-lg hover:border-[#938258] cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#1A1918]">{prof.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                            prof.gender === 'Boy' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {prof.gender === 'Boy' ? 'Мальчик' : 'Девочка'}, {prof.age} лет
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">Рост: {prof.height} см</p>
                        <p className="text-[10px] text-[#8A7E66] italic mt-0.5 mt-1 line-clamp-1">"{prof.stylePreference}"</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#C1B59F]" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Q&A PRODUCT OVERLAY MODAL */}
            {selectedProductForQa && (
              <div className="fixed inset-0 z-50 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#D5CBB3] overflow-hidden"
                >
                  <div className="bg-[#1A1918] text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-[#938258]" />
                      <span className="font-medium text-sm tracking-tight uppercase">AI Стилист-Консультант (Остатки: {selectedProductForQa.stock} шт)</span>
                    </div>
                    <button 
                      onClick={() => setSelectedProductForQa(null)}
                      className="text-gray-400 hover:text-white font-mono text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4 p-3 bg-[#FAF9F5] rounded border border-[#EAE3D2]">
                      <img 
                        src={selectedProductForQa.image} 
                        alt="" 
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-[#938258] uppercase text-[10px] block">{selectedProductForQa.brand}</span>
                        <p className="font-semibold text-gray-900 leading-tight">{selectedProductForQa.name}</p>
                        <p className="font-mono text-[10px] text-gray-500">Материал: {selectedProductForQa.material}</p>
                      </div>
                    </div>

                    <form onSubmit={handleProductQaSubmit} className="space-y-3">
                      <label className="text-xs font-semibold text-[#1a1918] block block uppercase font-mono">Спросите AI об этом товаре или совместимости:</label>
                      <textarea
                        value={qaQuestion}
                        onChange={e => setQaQuestion(e.target.value)}
                        required
                        rows={3}
                        className="w-full border border-[#D5CBB3] bg-[#FAF9F5] rounded p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-[#938258]"
                        placeholder="Например, подойдет ли этот пуховик на сильный мороз и с какой обувью его лучше сочетать?"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={qaLoading}
                        className="w-full py-2 bg-[#1A1918] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#938258] transition"
                      >
                        {qaLoading ? "Стилист думает..." : "⚡ Задать Вопрос ИИ на русском"}
                      </button>
                    </form>

                    {qaResponse && (
                      <div className="p-3.5 bg-yellow-50/50 rounded-lg border border-yellow-200 text-xs text-[#523A12] leading-relaxed max-h-56 overflow-y-auto">
                        <p className="font-semibold text-amber-900 mb-1">🤖 Консультант Стилиста:</p>
                        <p className="italic whitespace-pre-wrap">{qaResponse}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {orderSuccessMessage && (
              <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white p-4 rounded-lg shadow-2xl border border-emerald-500 max-w-sm flex gap-3 items-start animate-bounce">
                <Check className="w-5 h-5 shrink-0 bg-white/20 p-1 rounded-full mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs uppercase font-mono">Уведомление Moguta CMS</h4>
                  <p className="text-[11px] mt-1 leading-normal">{orderSuccessMessage}</p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: AI STYLIST & COPYWRITER PRODUCT GENERATOR */}
        {activeTab === 'stylist' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUMN 1: AI LOOK CREATOR */}
            <div className="bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-medium text-[#1A1918] flex items-center gap-2">
                  <Sparkles className="text-[#938258] w-5 h-5" />
                  Персональный ИИ Стилист (Подбор Люкс-Образов)
                </h2>
                <p className="text-xs text-[#8A7E66]">
                  Генератор образов обратится по API к Gemini, проанализирует только фактически доступные (in stock) вещи, учитывая замеры ребенка и повод мероприятия.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Пол ребенка:</label>
                  <select 
                    value={stylerGender}
                    onChange={e => setStylerGender(e.target.value as any)}
                    className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs text-[#2c2b29]"
                  >
                    <option value="Boy">Мальчик / Boy</option>
                    <option value="Girl">Девочка / Girl</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Возраст ребенка:</label>
                  <select 
                    value={stylerAge}
                    onChange={e => setStylerAge(Number(e.target.value))}
                    className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs text-[#2c2b29]"
                  >
                    {[2,3,4,5,6,7,8,9,10,11,12].map(n => (
                      <option key={n} value={n}>{n} лет</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Рост (в см):</label>
                  <input 
                    type="number"
                    value={stylerHeight}
                    onChange={e => setStylerHeight(Number(e.target.value))}
                    className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs text-[#2c2b29]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Повод / Событие / Атмосфера:</label>
                <input 
                  type="text"
                  value={stylerOccasion}
                  onChange={e => setStylerOccasion(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs text-[#2c2b29]"
                  placeholder="family winter ski resort vail, birthday tea party at hermitage"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Конкретные пожелания и декор:</label>
                <textarea
                  value={stylerPreference}
                  onChange={e => setStylerPreference(e.target.value)}
                  rows={2}
                  className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded p-2.5 text-xs text-[#2c2b29]"
                  placeholder="Светлый праздничный верх, кашемировое тепло, обувь в тон"
                />
              </div>

              <button
                onClick={handleGenerateLook}
                disabled={stylerLoading}
                className="w-full py-3 bg-[#1A1918] hover:bg-[#938258] text-[#EAE3D2] font-semibold text-xs uppercase tracking-widest rounded transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                {stylerLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#938258]" />
                    <span>ИИ собирает люкс капсулу в России...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Сгенерировать Образ из Наличия</span>
                  </>
                )}
              </button>

              {stylerError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[11px]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Ошибка генерации AI
                  </div>
                  <p>{stylerError}</p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    Перейдите в AI Studio Settings и укажите рабочий <b>GEMINI_API_KEY</b> в Secrets, затем перезапустите сервер.
                  </p>
                </div>
              )}

              {/* GENERATED LOOK DISPLAY GRID */}
              {generatedLook && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="p-5 border border-[#938258] bg-[#FFFDFC] rounded-xl space-y-4 shadow-lg relative"
                >
                  <div className="absolute top-2 right-2 bg-amber-500 text-white font-mono text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                    В Складском Наличии 100%
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="font-semibold text-[#1A1918] text-base">
                      {generatedLook.lookTitle}
                    </h3>
                    <p className="text-xs italic text-[#8A7E66] mt-1 leading-relaxed">
                      {generatedLook.description}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">Составленные вещи капсулы:</h4>
                    {generatedLook.items && generatedLook.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-[#FAF9F5] p-3 rounded-lg border border-[#EAE3D2] text-xs">
                        <div>
                          <p className="font-bold text-[#1A1918]">{item.brand}</p>
                          <p className="text-[#6D6351]">{item.name}</p>
                          <span className="text-[10px] block text-amber-800 font-mono italic">Подходящий размер: {item.chosenSize} • {item.stylingRole}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800 text-xs">
                            {Number(item.price).toLocaleString('ru-RU')} ₽
                          </p>
                          <button
                            onClick={() => {
                              const found = products.find(p => p.id === item.id);
                              if (found) {
                                addToCart(found, item.chosenSize || "8Y");
                                alert(`Товар ${found.name} импортирован в корзину!`);
                              } else {
                                alert("Товар не идентифицирован во внутренней БД каталога.");
                              }
                            }}
                            className="text-[10px] text-amber-700 hover:underline font-mono"
                          >
                            В корзину 🛒
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FAF9F5] p-3 rounded border border-[#EAE3D2]">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                      <span>Сумма Капсулы:</span>
                      <span className="text-sm underline decoration-amber-500 underline-offset-4 font-bold">
                        {Number(generatedLook.totalAmount).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#EAE3D2]/40 rounded text-xs text-[#524B3B] leading-relaxed">
                    <span className="font-bold block text-[11px] uppercase tracking-wider mb-0.5">Обоснование стилиста:</span>
                    {generatedLook.suitabilityExplain}
                  </div>

                  {/* AI STYLIST LOOK PORTRAIT VISUALIZER */}
                  <div className="border-t border-[#EAE3D2] pt-4 mt-2 space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">Цифровая ИИ-Примерка:</h4>
                    {visualizedImage ? (
                      <div className="space-y-3">
                        <div className="relative rounded-lg overflow-hidden border border-[#D5CBB3] shadow-inner max-w-sm mx-auto">
                          <img 
                            src={visualizedImage} 
                            alt="AI Visualized Child Outfit Look" 
                            className="w-full h-auto object-cover max-h-96"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-[#1A1918]/80 text-[#FAF9F5] p-2.5 text-center text-[10px] uppercase tracking-wider font-mono">
                            ✨ Moguta AI Studio Photo Render ({stylerGender === 'Girl' ? 'Девочка' : 'Мальчик'}, {stylerAge} лет, рост {stylerHeight}см)
                          </div>
                        </div>
                        <button
                          onClick={handleVisualizeLook}
                          className="text-[11px] text-[#938258] hover:underline font-mono block mx-auto transition"
                        >
                          Собрать другой ракурс / Обновить визуализацию 🔄
                        </button>
                      </div>
                    ) : visualizeLoading ? (
                      <div className="p-8 bg-[#FAF9F5] rounded-lg border border-[#EAE3D2] text-center space-y-3">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#938258] mx-auto" />
                        <p className="text-xs font-mono text-[#6D6351] animate-pulse">{visualizeLoadingStep}</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleVisualizeLook}
                        className="w-full py-2.5 bg-gradient-to-r from-[#938258] to-[#1A1918] hover:from-[#1A1918] hover:to-[#938258] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        Визуализировать образ ребенка (ИИ-Примерка)
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* COLUMN 2: CUSTOM COPYWRITING PRODUCT GENERATOR */}
            <div className="bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-medium text-[#1A1918] flex items-center gap-2">
                  <BookOpen className="text-[#938258] w-5 h-5" />
                  Модуль ИИ-Копирайтинга Moguta.CMS
                </h2>
                <p className="text-xs text-[#8A7E66]">
                  Эндпоинт для автоматического создания текстов. Стилист напишет шикарное описание товара, состав, достоинства кроя и советы по подбору стиля.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Бренд:</label>
                    <input 
                      type="text"
                      className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#938258]"
                      value={descBrand}
                      onChange={e => setDescBrand(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Наименование:</label>
                    <input 
                      type="text"
                      className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#938258]"
                      value={descName}
                      onChange={e => setDescName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Категория:</label>
                    <input 
                      type="text"
                      className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#938258]"
                      value={descCategory}
                      onChange={e => setDescCategory(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Материал:</label>
                    <input 
                      type="text"
                      className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs"
                      value={descMaterial}
                      onChange={e => setDescMaterial(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Сезон:</label>
                    <input 
                      type="text"
                      className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-2.5 py-1.5 text-xs"
                      value={descSeason}
                      onChange={e => setDescSeason(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Ключевые слова / Уникальность (Luxury):</label>
                  <input 
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#D5CBB3] rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#938258]"
                    value={descKeywords}
                    onChange={e => setDescKeywords(e.target.value)}
                    placeholder="water-resistant gabardine, iconic Nova checkered pattern"
                  />
                </div>

                <button
                  onClick={handleGenerateDescription}
                  disabled={descLoading}
                  className="w-full py-2.5 bg-[#1A1918] hover:bg-[#938258] text-[#EAE3D2] font-semibold text-xs uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  {descLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#938258]" /> : <BookOpen className="w-4 h-4" />}
                  Сгенерировать Текст Описания (Moguta Copy)
                </button>

                {generatedDesc && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="bg-[#FAF9F5] p-5 rounded-lg border border-[#EAE3D2] text-xs text-[#2c2b29] leading-relaxed space-y-3 relative"
                  >
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#1A1918] text-white font-mono text-[9px] px-2 py-0.5 rounded">
                      <span>Moguta-Ready Card</span>
                    </div>
                    
                    <h4 className="font-bold text-[#1A1918] uppercase tracking-wider border-b pb-1">Результат генерации для CMS:</h4>
                    <pre className="font-sans whitespace-pre-wrap leading-relaxed italic">{generatedDesc}</pre>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: TELEGRAM CLIENT SIMULATOR SMARTPHONE & TUTORIAL WEBHOOK */}
        {activeTab === 'telegram' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* INSTRUCTIONS COLUMN (7 / 12) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm">
                <div className="flex gap-3 items-start border-b border-gray-100 pb-4 mb-4">
                  <div className="p-2.5 bg-[#0088cc]/10 text-[#0088cc] rounded-lg">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-[#1A1918]">
                      Инструкция по настройке Telegram Бота на VPS в Timeweb Cloud
                    </h2>
                    <p className="text-xs text-[#8A7E66]">
                      Наш симулятор полностью эмулирует отправку сообщений и обработку Q&A силами Gemini. Вот как перенести это на рабочий хостинг Moguta.CMS.
                    </p>
                  </div>
                </div>

                {/* VISUAL MARKDOWN CONSOLE */}
                <div className="prose prose-slate max-w-full text-xs font-mono bg-slate-900 text-slate-100 p-5 rounded-lg overflow-x-auto max-h-[500px] leading-relaxed">
                  <pre className="whitespace-pre-wrap">{TECHNICAL_GUIDE_TEXT}</pre>
                </div>
              </div>
            </div>

            {/* SMARTPHONE TELEGRAM LIVE CLIENT PREVIEW (5 / 12) */}
            <div className="lg:col-span-5 flex justify-center">
              
              <div id="iphone-preview" className="relative w-[345px] h-[670px] bg-[#1d2733] rounded-[48px] border-[12px] border-[#222] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Speaker and Camera notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-gray-800 rounded-full mb-1"></div>
                </div>

                {/* Phone Header */}
                <div className="bg-[#17212b] pt-8 pb-3 px-4 flex items-center justify-between border-b border-[#101921] z-10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <div>
                      <h3 className="font-semibold text-white text-xs leading-none flex items-center gap-1">
                        Moguta Notification Bot
                        <span className="text-[9px] bg-[#24313f] text-[#0088cc] font-mono px-1 py-0.2 rounded font-bold uppercase">
                          VIP
                        </span>
                      </h3>
                      <p className="text-[9px] text-[#A8B2C1]">Бот трансляции и AI Стилиста</p>
                    </div>
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono text-right">
                    Moguta.CMS
                  </div>
                </div>

                {/* Smartphone Messages Flow Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0e1621] flex flex-col-reverse">
                  <AnimatePresence>
                    {tgMessages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex flex-col max-w-[85%] text-xs rounded-xl p-3 shadow-md relative ${
                          msg.isBotOutbound 
                            ? 'self-start bg-[#182533] text-gray-100 border-l-4 border-amber-600' 
                            : 'self-end bg-[#2b5278] text-white border-r-4 border-teal-500'
                        }`}
                      >
                        {/* Outbound Badges */}
                        {msg.isBotOutbound && (
                          <div className="flex items-center justify-between gap-1 text-[9px] uppercase tracking-wider font-mono text-[#D5CBB3] mb-1.5 font-bold">
                            {msg.type === 'order_notification' && <span className="text-sky-400">🛍️ Заказ</span>}
                            {msg.type === 'payment_notification' && <span className="text-emerald-400">💰 Оплата</span>}
                            {msg.type === 'client_query' && <span className="text-amber-400">🤖 AI Образ Стилист</span>}
                            {msg.type === 'technical_service' && <span className="text-red-400">⚙️ Система</span>}
                            <span>{new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                        
                        <div 
                          className="leading-relaxed whitespace-pre-wrap select-text break-words html-message-render"
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />

                        {!msg.isBotOutbound && (
                          <div className="text-right text-[8px] text-blue-200 mt-1 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} • Покупатель
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="text-center py-4">
                    <span className="text-[10px] text-gray-500 font-mono bg-[#17212b] px-3 py-1 rounded-full border border-gray-800">
                      Начало демонстрационного сеанса Log
                    </span>
                  </div>
                </div>

                {/* Smartphone Chat Input */}
                <form onSubmit={handleTgBotSubmit} className="bg-[#17212b] p-3 border-t border-[#101921] flex gap-2 items-center shrink-0">
                  <input
                    type="text"
                    value={tgBotInput}
                    onChange={e => setTgBotInput(e.target.value)}
                    placeholder="Напишите боту вопрос (напр: 'какой пуховик Moncler есть в наличии?')..."
                    className="flex-1 bg-[#24313f] border-none rounded-full px-3.5 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00aaee]"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-[#0088cc] hover:bg-[#00aaee] text-white rounded-full transition"
                    title="Отправить симулированный запрос клиента боту"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

        {/* TAB 4: CRM, CATALOG CONFIG & WEBHOOK LOGS */}
        {activeTab === 'crm' && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* AI STYLIST SYSTEM PROMPT WRITER */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm space-y-4">
                <div className="flex gap-2 items-center border-b border-gray-100 pb-3">
                  <Settings className="w-5 h-5 text-[#938258]" />
                  <div>
                    <h3 className="font-semibold text-sm text-[#1A1918] tracking-tight uppercase">Панель Управления AI-Инструкциями</h3>
                    <p className="text-[11px] text-gray-400">Тон голоса стилиста, фильтрация остатков и брендов</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#8A7E66] uppercase block font-mono">Системные правила (System Prompt):</label>
                  <textarea
                    rows={12}
                    className="w-full bg-[#FAF9F5] border border-[#D5CBB3] p-3 text-xs leading-relaxed font-mono rounded"
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSavePrompt}
                  disabled={systemPromptSaving}
                  className="w-full py-2 bg-[#938258] hover:bg-[#1A1918] text-white text-xs font-bold uppercase tracking-wider rounded transition"
                >
                  {systemPromptSaving ? "Сохранение..." : "Сохранить новые ИИ Правила"}
                </button>
              </div>

              {/* STOCKS EDITOR & RESTRICTIONS DEMO PANEL */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm space-y-4">
                <div className="flex gap-2 items-center border-b border-gray-100 pb-3">
                  <Sliders className="w-5 h-5 text-[#938258]" />
                  <div>
                    <h3 className="font-semibold text-sm text-[#1A1918] uppercase">Экспериментальный Пульт Наличия & Склада</h3>
                    <p className="text-[11px] text-gray-400">Включайте/выключайте остатки, чтобы увидеть, как AI Стилист на лету отказывается рекомендовать вещи без наличия.</p>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {products.map(p => (
                    <div key={p.id} className="flex justify-between items-center text-xs p-3 bg-[#FAF9F5] rounded border border-[#EAE3D2]">
                      <div>
                        <span className="font-bold text-gray-700">{p.brand}</span>
                        <p className="text-[#1A1918]">{p.name}</p>
                        <p className="text-[10px] font-mono text-gray-500">Код: {p.article} | Изделие: {p.sizes.join(', ')}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            p.stock > 0 ? 'bg-emerald-100 text-[#065f46]' : 'bg-red-100 text-red-700 animate-pulse'
                          }`}>
                            {p.stock > 0 ? `Остатки: ${p.stock}` : "НЕТ В НАЛИЧИИ"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleStock(p.id)}
                          className="p-1 focus:outline-none"
                          title="Переключить наличие на складе"
                        >
                          {p.stock > 0 ? (
                            <ToggleRight className="w-8 h-8 text-emerald-600 transition" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400 transition" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ORDERS DATABASE INTERATIVE ROW */}
            <div className="bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm">
              <div className="flex gap-2 items-center mb-4">
                <Package className="w-5 h-5 text-[#938258]" />
                <h3 className="font-semibold text-sm text-[#1A1918] uppercase">База Данных Заказов (Синхронизировано)</h3>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#EAE3D2] font-mono uppercase text-[10px] text-[#8a7e66]">
                      <th className="p-3">ID Заказа</th>
                      <th className="p-3">Дата создания</th>
                      <th className="p-3">Покупатель</th>
                      <th className="p-3">Товары заказа</th>
                      <th className="p-3">Общий итог</th>
                      <th className="p-3">Статус оплаты</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-[#F2EDE2] hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-slate-800">#{o.id}</td>
                        <td className="p-3 font-mono text-gray-400">{new Date(o.createdAt).toLocaleString('ru-RU')}</td>
                        <td className="p-3">
                          <p className="font-semibold">{o.customerName}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{o.customerPhone}</p>
                        </td>
                        <td className="p-3 max-w-xs">
                          {o.items.map((it, i) => (
                            <p key={i} className="line-clamp-1 last:mb-0 mb-1 font-mono text-[11px]">
                              • <span className="font-bold">{it.brand}</span>: {it.name} ({it.size})
                            </p>
                          ))}
                        </td>
                        <td className="p-3 font-bold font-mono text-slate-800">{o.totalAmount.toLocaleString('ru-RU')} ₽</td>
                        <td className="p-3">
                          {o.paymentStatus === 'paid' ? (
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-mono font-bold text-[10px] uppercase">
                              Оплачено
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePayOrder(o.id)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-2 py-1 rounded font-mono text-[10px] uppercase transition"
                              title="Нажмите чтобы отправить платежный хук транзакции"
                            >
                              Оплатить 💳
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* HTTP WEBHOOK DELIVERY HISTORY LOGS */}
            <div className="bg-white p-6 rounded-xl border border-[#EAE3D2] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <FileText className="w-5 h-5 text-[#938258]" />
                  <div>
                    <h3 className="font-semibold text-sm text-[#1A1918] uppercase">Журнал Доставки Вебхуков (Moguta Webhooks)</h3>
                    <p className="text-xs text-gray-400">Мониторинг HTTP POST трансляций на VPS Timeweb Cloud</p>
                  </div>
                </div>
                <div className="text-xs font-mono px-2 py-1 bg-slate-900 text-slate-400 rounded">
                  Webhook Host: ACTIVE
                </div>
              </div>

              <div className="space-y-3.5">
                {webhooks.map((wh) => (
                  <div key={wh.id} className="p-4 bg-[#FAF9F5] rounded-lg border border-[#EAE3D2] text-xs font-mono space-y-2">
                    <div className="flex flex-col md:flex-row justify-between gap-1 border-b border-[#F2EDE2] pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${wh.status === 'sent' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span className="font-bold text-[#1A1918]">{wh.event}</span>
                        <span className="text-gray-400">| ID: {wh.id}</span>
                      </div>
                      <div className="text-gray-500">
                        {new Date(wh.timestamp).toLocaleString('ru-RU')}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[#8A7E66] text-[10px] uppercase font-bold">Целевой Hook URL:</p>
                        <p className="bg-[#FAF9F5] border p-1 rounded font-mono text-[10px] break-all truncate text-slate-800">{wh.url}</p>
                        
                        <p className="text-[#8A7E66] text-[10px] uppercase font-bold pt-1">Payload JSON (Параметры транзакции):</p>
                        <pre className="bg-[#1A1918] text-amber-100 p-2 rounded text-[10px] overflow-x-auto max-w-full italic">{wh.payload}</pre>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[#8A7E66] text-[10px] uppercase font-bold">Отреагировавший сервер (Response):</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-800">
                          <span>HTTP Код ответа:</span>
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-[#065f46] rounded text-[10px] font-bold">{wh.responseCode} OK</span>
                        </div>
                        <p className="text-[#8A7E66] text-[10px] uppercase font-bold pt-1">Тело ответа (Telegram Bot Log):</p>
                        <pre className="bg-[#FAF9F5] border p-2 rounded text-[10px] text-gray-500 overflow-x-auto truncate">{wh.responseBody}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-[#EAE3D2] py-8 bg-[#FAF9F5] text-center text-xs text-[#8A7E66] font-mono max-w-7xl mx-auto px-6">
        <p>Moguta.CMS Integration & Premium AI Stylist Prototyping Workshop.</p>
        <p className="mt-1">Для работы ИИ-диалогов требуется наличие Секретного Ключа Google Gemini в настройках окружения.</p>
      </footer>
    </div>
  );
}
