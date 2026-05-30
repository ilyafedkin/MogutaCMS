/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_PRODUCTS, INITIAL_CHILD_PROFILES, SYSTEM_PROMPT_DEFAULT } from "./src/data";
import { Product, ChildProfile, Order, WebhookDelivery, TelegramMessage, OrderItem } from "./src/types";

// In-memory simple storage to represent database on the backend container
let products: Product[] = [...INITIAL_PRODUCTS];
let childProfiles: ChildProfile[] = [...INITIAL_CHILD_PROFILES];
let orders: Order[] = [
  {
    id: "ord-1001",
    customerName: "София Романова",
    customerPhone: "+7 (999) 123-45-67",
    customerEmail: "romanova.sofia@example.com",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        name: "Classic Beige Trench Coat",
        brand: "Burberry Kids",
        size: "6Y",
        price: 35700,
        quantity: 1
      },
      {
        id: "item-2",
        productId: "prod-8",
        name: "Prestige Leather Booties",
        brand: "Dior Kids",
        size: "30",
        price: 45000,
        quantity: 1
      }
    ],
    totalAmount: 80700,
    status: "new",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    source: "Moguta Simulator"
  },
  {
    id: "ord-1002",
    customerName: "Дмитрий Петров",
    customerPhone: "+7 (911) 777-88-99",
    customerEmail: "dima.petrov@example.com",
    items: [
      {
        id: "item-3",
        productId: "prod-6",
        name: "Majolica Print Casual T-Shirt",
        brand: "Dolce & Gabbana",
        size: "8Y",
        price: 19800,
        quantity: 1
      }
    ],
    totalAmount: 19800,
    status: "new",
    paymentStatus: "unpaid",
    createdAt: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    source: "PWA Concierge"
  }
];

let webhooks: WebhookDelivery[] = [
  {
    id: "wh-1",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    url: "https://tg-bot-webhook.timeweb.cloud/api/v1",
    event: "order.create",
    payload: JSON.stringify({ orderId: "ord-1001", total: 80700, customer: "София Романова" }),
    status: "sent",
    responseCode: 200,
    responseBody: "{\"ok\":true,\"description\":\"Message sent to chat ID -1001844919\"}"
  },
  {
    id: "wh-2",
    timestamp: new Date(Date.now() - 3600000 * 2 + 10000).toISOString(),
    url: "https://tg-bot-webhook.timeweb.cloud/api/v1",
    event: "payment.success",
    payload: JSON.stringify({ orderId: "ord-1001", status: "paid" }),
    status: "sent",
    responseCode: 200,
    responseBody: "{\"ok\":true,\"description\":\"Payment notification broadcasted\"}"
  }
];

let telegramMessages: TelegramMessage[] = [
  {
    id: "tg-1",
    chatId: "-1001844919",
    text: `🌟 <b>Новый Заказ в Moguta.CMS!</b>\n\n🆔 <b>Заказ №:</b> #ord-1001\n👤 <b>Клиент:</b> София Романова\n📞 <b>Телефон:</b> +7 (999) 123-45-67\n💰 <b>Сумма:</b> 80 700 ₽\n🛍️ <b>Товары:</b>\n  1. Burberry Kids — Classic Beige Trench Coat (6Y) — 35 700 ₽\n  2. Dior Kids — Prestige Leather Booties (30) — 45 000 ₽\n\n🎯 <i>Источник: Moguta CMS (Timeweb VPS)</i>`,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isBotOutbound: true,
    type: "order_notification"
  },
  {
    id: "tg-2",
    chatId: "-1001844919",
    text: `💰 <b>Оплата Получена! (Moguta.CMS)</b>\n\n✅ Заказ <b>#ord-1001</b> успешно оплачен на сервере Timeweb VPS!\n💵 Сумма: <b>80 700 ₽</b>\n⚙️ Статус заказа изменен на: <code>ОПЛАЧЕН / ПРИНЯТ В РАБОТУ</code>\n\n⏱️ <i>Real-time трансляция событий Moguta CMS в Telegram завершена успешно.</i>`,
    timestamp: new Date(Date.now() - 3600000 * 2 + 10000).toISOString(),
    isBotOutbound: true,
    type: "payment_notification"
  },
  {
    id: "tg-3",
    chatId: "-1001844919",
    text: `🌟 <b>Новый Заказ в Moguta.CMS!</b>\n\n🆔 <b>Заказ №:</b> #ord-1002\n👤 <b>Клиент:</b> Дмитрий Петров\n📞 <b>Телефон:</b> +7 (911) 777-88-99\n💰 <b>Сумма:</b> 19 800 ₽\n🛍️ <b>Товары:</b>\n  1. Dolce & Gabbana — Majolica Print Casual T-Shirt (8Y) — 19 800 ₽\n\n🎯 <i>Источник: PWA Luxury Concierge</i>`,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    isBotOutbound: true,
    type: "order_notification"
  }
];

let customSystemPrompt = SYSTEM_PROMPT_DEFAULT;

// Lazy GenAI Client initialization to prevent app crash if missing GEMINI_API_KEY environment variable.
let aiInstance: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is currently empty. Please configure it in your Settings > Secrets tab.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. PRODUCTS API
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.post("/api/products/toggle-stock", (req, res) => {
    const { id } = req.body;
    const prod = products.find(p => p.id === id);
    if (prod) {
      prod.stock = prod.stock > 0 ? 0 : 5; // toggle between out of stock and 5 in stock
      res.json({ success: true, product: prod });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/products/update-stock-val", (req, res) => {
    const { id, stock } = req.body;
    const prod = products.find(p => p.id === id);
    if (prod) {
      prod.stock = Math.max(0, Number(stock));
      res.json({ success: true, product: prod });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // 2. CHILD PROFILES
  app.get("/api/profiles", (req, res) => {
    res.json(childProfiles);
  });

  app.post("/api/profiles", (req, res) => {
    const newProfile: ChildProfile = {
      id: "child-" + Date.now(),
      name: req.body.name || "Ребенок",
      gender: req.body.gender || "Girl",
      age: Number(req.body.age) || 5,
      height: Number(req.body.height) || 110,
      sizePreference: req.body.sizePreference || "6Y",
      stylePreference: req.body.stylePreference || "Классический"
    };
    childProfiles.push(newProfile);
    res.json({ success: true, profile: newProfile });
  });

  // 3. ORDERS (Moguta / PWA Order Generator)
  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    const { customerName, customerPhone, customerEmail, items, source } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    // Double check availability and decrease stock
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) {
        return res.status(400).json({ error: `Товар ${item.name} не найден в каталоге` });
      }
      if (prod.stock <= 0) {
        return res.status(400).json({ error: `Товар ${prod.name} закончился на складе и недоступен к заказу.` });
      }
      
      // Decrease stock
      prod.stock = Math.max(0, prod.stock - 1);

      orderItems.push({
        id: "item-" + Math.random().toString(36).substr(2, 9),
        productId: prod.id,
        name: prod.name,
        brand: prod.brand,
        size: item.size || "8Y",
        price: prod.price,
        quantity: 1
      });
      total += prod.price;
    }

    const orderId = "ord-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: orderId,
      customerName: customerName || "Анонимный Покупатель",
      customerPhone: customerPhone || "+7 (999) 000-00-00",
      customerEmail: customerEmail || "customer@boutique.ru",
      items: orderItems,
      totalAmount: total,
      status: "new",
      paymentStatus: "unpaid",
      createdAt: new Date().toISOString(),
      source: source || "Moguta Simulator"
    };

    orders.unshift(newOrder);

    // 1. Simulate real-time Webhook in CRM
    const webhookLog: WebhookDelivery = {
      id: "wh-" + Date.now(),
      timestamp: new Date().toISOString(),
      url: "https://tg-bot-webhook.timeweb.cloud/api/v1",
      event: "order.create",
      payload: JSON.stringify({ orderId: newOrder.id, customer: newOrder.customerName, total: newOrder.totalAmount }),
      status: "sent",
      responseCode: 200,
      responseBody: JSON.stringify({ ok: true, message: "Order broadcasted successfully" })
    };
    webhooks.unshift(webhookLog);

    // 2. Fire immediate Real-time simulated TG message
    let itemsText = "";
    orderItems.forEach((it, idx) => {
      itemsText += `  ${idx + 1}. ${it.brand} — ${it.name} (${it.size}) — ${it.price.toLocaleString("ru-RU")} ₽\n`;
    });

    const telegramMsg: TelegramMessage = {
      id: "tg-" + Date.now(),
      chatId: "-1001844919",
      text: `🌟 <b>Новый Заказ в Moguta.CMS!</b>\n\n🆔 <b>Заказ №:</b> #${newOrder.id}\n👤 <b>Клиент:</b> ${newOrder.customerName}\n📞 <b>Телефон:</b> ${newOrder.customerPhone}\n💰 <b>Сумма:</b> ${newOrder.totalAmount.toLocaleString("ru-RU")} ₽\n🛍️ <b>Товары:</b>\n${itemsText}\n🎯 <i>Источник: ${source || "Moguta CMS (Timeweb VPS)"}</i>`,
      timestamp: new Date().toISOString(),
      isBotOutbound: true,
      type: "order_notification"
    };
    telegramMessages.unshift(telegramMsg);

    res.json({ success: true, order: newOrder });
  });

  // Pay Order Endpoint (Trigger Real-time TG and Webhook update)
  app.post("/api/orders/pay", (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.paymentStatus = "paid";

    // Create webhook log
    const webhookLog: WebhookDelivery = {
      id: "wh-" + Date.now(),
      timestamp: new Date().toISOString(),
      url: "https://tg-bot-webhook.timeweb.cloud/api/v1",
      event: "payment.success",
      payload: JSON.stringify({ orderId: order.id, status: "paid" }),
      status: "sent",
      responseCode: 200,
      responseBody: JSON.stringify({ ok: true, message: "Payment status transitioned" })
    };
    webhooks.unshift(webhookLog);

    // Telegram Notification
    const telegramMsg: TelegramMessage = {
      id: "tg-" + Date.now(),
      chatId: "-1001844919",
      text: `💰 <b>Оплата Получена! (Moguta.CMS)</b>\n\n✅ Заказ <b>#${order.id}</b> успешно оплачен на сервере Timeweb VPS!\n💵 Сумма: <b>${order.totalAmount.toLocaleString("ru-RU")} ₽</b>\n⚙️ Статус заказа изменен на: <code>ОПЛАЧЕН / ПРИНЯТ В РАБОТУ</code>\n\n⏱️ <i>Real-time трансляция событий Moguta CMS в Telegram завершена успешно.</i>`,
      timestamp: new Date().toISOString(),
      isBotOutbound: true,
      type: "payment_notification"
    };
    telegramMessages.unshift(telegramMsg);

    res.json({ success: true, order });
  });

  // Reset demo store system state
  app.post("/api/system/reset", (req, res) => {
    products = [...INITIAL_PRODUCTS];
    childProfiles = [...INITIAL_CHILD_PROFILES];
    orders = [
      {
        id: "ord-1001",
        customerName: "София Романова",
        customerPhone: "+7 (999) 123-45-67",
        customerEmail: "romanova.sofia@example.com",
        items: [
          {
            id: "item-1",
            productId: "prod-1",
            name: "Classic Beige Trench Coat",
            brand: "Burberry Kids",
            size: "6Y",
            price: 35700,
            quantity: 1
          },
          {
            id: "item-2",
            productId: "prod-8",
            name: "Prestige Leather Booties",
            brand: "Dior Kids",
            size: "30",
            price: 45000,
            quantity: 1
          }
        ],
        totalAmount: 80700,
        status: "new",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        source: "Moguta Simulator"
      }
    ];
    webhooks = [
      {
        id: "wh-1",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        url: "https://tg-bot-webhook.timeweb.cloud/api/v1",
        event: "order.create",
        payload: JSON.stringify({ orderId: "ord-1001", total: 80700, customer: "София Романова" }),
        status: "sent",
        responseCode: 200,
        responseBody: "{\"ok\":true,\"description\":\"Message sent to chat ID -1001844919\"}"
      }
    ];
    telegramMessages = [
      {
        id: "tg-1",
        chatId: "-1001844919",
        text: `🌟 <b>Новый Заказ в Moguta.CMS!</b>\n\n🆔 <b>Заказ №:</b> #ord-1001\n👤 <b>Клиент:</b> София Романова\n📞 <b>Телефон:</b> +7 (999) 123-45-67\n💰 <b>Сумма:</b> 80 700 ₽\n🛍️ <b>Товары:</b>\n  1. Burberry Kids — Classic Beige Trench Coat (6Y) — 35 700 ₽\n  2. Dior Kids — Prestige Leather Booties (30) — 45 000 ₽\n\n🎯 <i>Источник: Moguta CMS (Timeweb VPS)</i>`,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        isBotOutbound: true,
        type: "order_notification"
      }
    ];
    res.json({ success: true, message: "System state reset successful" });
  });

  // 4. WEBHOOKS & TG CHAT SIMULATOR APIS
  app.get("/api/webhooks", (req, res) => {
    res.json(webhooks);
  });

  app.get("/api/tg-messages", (req, res) => {
    res.json(telegramMessages);
  });

  // Simulate Telegram client inbound prompt from customer directly to Bot
  app.post("/api/tg-messages/client-query", async (req, res) => {
    const { messageText } = req.body;
    if (!messageText) return res.status(400).json({ error: "Empty message" });

    // 1. Post user question
    const userInboundMsg: TelegramMessage = {
      id: "tg-user-" + Date.now(),
      chatId: "-1001844919",
      text: `👤 [Покупатель в Телеграм]: ${messageText}`,
      timestamp: new Date().toISOString(),
      isBotOutbound: false,
      type: "client_query"
    };
    telegramMessages.unshift(userInboundMsg);

    // 2. Call server-side Gemini to answer as the high-society AI stylist, but STRICTLY filtering catalog
    try {
      const ai = getAIClient();
      const inStockSummary = products
        .filter(p => p.stock > 0)
        .map(p => `- ${p.brand} | ${p.name} (Код: ${p.article}) | Цена: ${p.price} ₽ | Доступные размеры: ${p.sizes.join(", ")} | Описание: ${p.description}`)
        .join("\n");

      const finalPrompt = `
      You are the luxury Kids' boutique AI Bot responder. 
      Answer the buyer query: "${messageText}"

      IMPORTANT: Ensure that you DO NOT offer or mention items that are out of stock. Here is the list of active in-stock item catalog which you are restricted to:
      ${inStockSummary}

      Respond briefly, keeping a premium high-brand aesthetic, but addressing the user query in Russian directly. Keep under 120 words.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: finalPrompt,
        config: {
          systemInstruction: customSystemPrompt,
          temperature: 0.7
        }
      });

      const replyText = response.text || "Извините, сейчас я настраиваюсь. Пожалуйста, обратитесь к менеджеру.";

      // Post bot response
      const botResponse: TelegramMessage = {
        id: "tg-bot-" + Date.now(),
        chatId: "-1001844919",
        text: `🤖 <b>AI Стилист-Бот (Moguta AI):</b>\n\n${replyText}`,
        timestamp: new Date().toISOString(),
        isBotOutbound: true,
        type: "client_query"
      };
      telegramMessages.unshift(botResponse);

      res.json({ success: true, replyText });
    } catch (err: any) {
      console.error(err);
      const errText = `⚙️ <b>Бот на Timeweb VPS получил запрос, но для AI-ответов необходимо настроить API-ключ Gemini.</b>\n\nПожалуйста, введите ваш действующий <code>GEMINI_API_KEY</code> в настройках Secrets в AI Studio.\n\n<i>(Ошибка: ${err.message})</i>`;
      
      const botResponse: TelegramMessage = {
        id: "tg-bot-" + Date.now(),
        chatId: "-1001844919",
        text: errText,
        timestamp: new Date().toISOString(),
        isBotOutbound: true,
        type: "technical_service"
      };
      telegramMessages.unshift(botResponse);
      res.json({ success: false, error: err.message });
    }
  });

  // 5. SETTINGS APIs
  app.get("/api/settings/prompt", (req, res) => {
    res.json({ systemPrompt: customSystemPrompt });
  });

  app.post("/api/settings/prompt", (req, res) => {
    const { systemPrompt } = req.body;
    if (systemPrompt) {
      customSystemPrompt = systemPrompt;
      res.json({ success: true, systemPrompt });
    } else {
      res.status(400).json({ error: "Prompt cannot be empty" });
    }
  });

  // 6. SERVER-SIDE GEMINI API INTEGRATIONS
  // A) AI STYLIST FOR LOOK CREATION
  app.post("/api/ai/styler", async (req, res) => {
    const { gender, age, height, occasion, stylePreference } = req.body;
    
    try {
      const ai = getAIClient();

      // Only pass in-stock items
      const activeInStockProducts = products.filter(p => p.stock > 0);
      const inStockDataStr = JSON.stringify(activeInStockProducts, null, 2);

      const lookPrompt = `
      Пожалуйста, создай один эксклюзивный законченный детский образ (Look) для ребенка со следующими параметрами:
      - Пол: ${gender || "Любой"}
      - Возраст: ${age || 6} лет
      - Рост: ${height || 116} см
      - Событие: ${occasion || "Праздничный вечер"}
      - Предпочтения по стилю: ${stylePreference || "Премиальный классический"}

      Доступный ассортимент в наличии (ПРЕДЛАГАТЬ СТРОГО ИЗ ЭТОГО СПИСКА):
      ${inStockDataStr}

      Верни ответ в формате JSON. JSON должен иметь следующую структуру:
      {
        "lookTitle": "Название образа (например, \"Royal Garden Gala by Gucci & Burberry\")",
        "description": "Элегантное описание концепции, настроения и стиля данного образа в премиум-тоне на русском языке.",
        "suitabilityExplain": "Объяснение, почему этот подбор идеально соответствует росту ${height} см и событию: ${occasion}.",
        "items": [
          {
            "id": "ID товара из входного каталога",
            "name": "Название товара",
            "brand": "Бренд",
            "price": "цена числом",
            "chosenSize": "выбранный подходящий по возрасту/росту ребенка размер",
            "stylingRole": "роль этой вещи в образе (например: Базовый элемент, Обувь, Акцентный верх, Защита от ветра)"
          }
        ],
        "totalAmount": "сумма цен всех входящих в комплект вещей"
      }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: lookPrompt,
        config: {
          systemInstruction: customSystemPrompt,
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });

      const parsedJSON = JSON.parse(response.text?.trim() || "{}");
      res.json({ success: true, look: parsedJSON });
    } catch (err: any) {
      console.error("Styler error:", err);
      res.status(500).json({
        error: "Failed to generate AI Look",
        message: err.message,
        missingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
      });
    }
  });

  // B) AI PRODUCT Q&A PORTAL
  app.post("/api/ai/qa", async (req, res) => {
    const { productId, question } = req.body;
    
    try {
      const ai = getAIClient();
      const product = products.find(p => p.id === productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const qPrompt = `
      Отыгрывай роль высококлассного стилиста-консультанта. Покупатель спрашивает о товаре:
      Товар: ${product.brand} - ${product.name} (Материал: ${product.material}, Сезон: ${product.season}, В наличии размерный ряд: ${product.sizes.join(", ")}, Текущий остаток: ${product.stock} шт., Цена: ${product.price} ₽).
      Описание товара: ${product.description}

      Вопрос клиента: "${question}"

      Дай развернутый, вежливый ответ на русском языке в премиальном, экспертном стиле. Подчеркни качество материалов (металлическая фурнитура, органический итальянский хлопок, кашемир или гусиный пух), особенности ухода, размерность или сочетаемость. Keep under 150 words.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: qPrompt,
        config: {
          systemInstruction: customSystemPrompt,
          temperature: 0.6
        }
      });

      res.json({ success: true, answer: response.text });
    } catch (err: any) {
      console.error("QA error:", err);
      res.status(500).json({
        error: "Failed to answer question",
        message: err.message,
        missingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
      });
    }
  });

  // C) AI PRODUCT DESCRIPTION GENERATOR
  app.post("/api/ai/describe", async (req, res) => {
    const { brand, name, category, material, season, keywords } = req.body;

    try {
      const ai = getAIClient();
      const prepPrompt = `
      Напиши роскошное, притягательное, экспертное описание карточки премиального детского товара для интернет-магазина Moguta.CMS на русском языке.
      Бренд: ${brand}
      Наименование: ${name}
      Категория: ${category}
      Материалы: ${material}
      Сезон: ${season}
      Ключевые слова/акценты: ${keywords || "высокий статус, комфортный крой"}

      Описание должно содержать:
      1. Эмоциональный роскошный абзац о теплоте, мягкости и уникальном превосходстве изделия на ребенке.
      2. Маркированный список ключевых преимуществ (крой, ткань, ручная стирка, прочность, фирменные детали лейбла).
      3. Стильный совет "С чем гармонично сочетать данный бренд в капсуле".
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prepPrompt,
        config: {
          systemInstruction: "You are an elite children luxury copywriter for Harper's Bazaar and high-fashion child magazines.",
          temperature: 0.7
        }
      });

      res.json({ success: true, description: response.text });
    } catch (err: any) {
      console.error("Description generator error:", err);
      res.status(500).json({
        error: "Failed to write product description",
        message: err.message,
        missingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
      });
    }
  });

  // Mount Vite middleware for development or serve built bundle in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Moguta.CMS full stack simulation listening on port ${PORT}`);
  });
}

startServer();
