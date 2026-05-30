import { Product, ChildProfile } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    article: "BUR-TR-89",
    brand: "Burberry Kids",
    name: "Classic Beige Trench Coat",
    category: "Outerwear",
    originalPrice: 42000,
    price: 35700,
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    description: "Iconic Burberry double-breasted trench coat in sand beige honey cotton gabardine. Features the signature vintage check lining, storm flap, and buttoned epaulettes. Handcrafted in Europe, perfectly wind and rainfall resistant for small stylers.",
    stock: 5,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    season: "Spring/Autumn",
    gender: "Unisex",
    material: "100% Cotton Gabardine"
  },
  {
    id: "prod-2",
    article: "GUC-DB-12",
    brand: "Gucci Kids",
    name: "Interlocking G Double Jersey Jacket",
    category: "Jackets",
    originalPrice: 48000,
    price: 48000,
    sizes: ["6Y", "8Y", "12Y"],
    description: "Premium cotton double jersey bomber jacket adorned with signature Gucci green and red web knit collar and sleeve bands. Double interlocking G embroidered on the front chest. Easy zip-up entry, comfortable and sports-elegant for high-society outings.",
    stock: 2,
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=600",
    season: "Spring/Autumn",
    gender: "Boy",
    material: "95% Organic Cotton, 5% Polyamide"
  },
  {
    id: "prod-3",
    article: "MON-DN-44",
    brand: "Moncler Enfant",
    name: "New Maya Down Hooded Jacket",
    category: "Outerwear",
    originalPrice: 72000,
    price: 72000,
    sizes: ["6Y", "8Y", "10Y", "12Y"],
    description: "Classic lacquered nylon down coat with premium goose down quilted compartments in elegant navy. Distinct signature button pocket on the sleeve with logo emblempatch. Detachable hood with snap collars. Legendary warm protection down to -20°C.",
    stock: 3,
    image: "https://images.unsplash.com/photo-1520466809913-d482907e404d?auto=format&fit=crop&q=80&w=600",
    season: "Winter",
    gender: "Unisex",
    material: "100% Nylon outer, 100% Goose Down filling"
  },
  {
    id: "prod-4",
    article: "DIO-DR-02",
    brand: "Dior Kids",
    name: "Sartorial Tulle Party Dress",
    category: "Dresses",
    originalPrice: 89000,
    price: 75650,
    sizes: ["4Y", "6Y", "8Y"],
    description: "Majestic layered blush pink tulle gown with intricate Dior oblique sparkling silver embroidery on the chest waist band. Lightweight, celestial, features back hidden zipper and breathable silk inner lining. Ideal for birthdays, balls, and prestigious galas.",
    stock: 4,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=600",
    season: "All Season",
    gender: "Girl",
    material: "80% Silk Organza, 20% Polyester tulle, Silk lining"
  },
  {
    id: "prod-5",
    article: "LOR-PO-55",
    brand: "Loro Piana Kids",
    name: "Heritage Cashmere Sweater",
    category: "Knitwear",
    originalPrice: 56000,
    price: 56000,
    sizes: ["8Y", "10Y", "12Y"],
    description: "Finest Baby Cashmere sweater knitted with refined horizontal waffle texture in warm sand cream color. Elegant mock neck collar with wooden logo buttons detail. Extraordinarily soft on the child's skin, highly heat-insulating yet ultra light.",
    stock: 4,
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600",
    season: "Winter",
    gender: "Unisex",
    material: "100% Baby Cashmere"
  },
  {
    id: "prod-6",
    article: "DOL-SU-71",
    brand: "Dolce & Gabbana",
    name: "Majolica Print Casual T-Shirt",
    category: "T-Shirts",
    originalPrice: 22000,
    price: 19800,
    sizes: ["6Y", "8Y", "10Y"],
    description: "Soft high-grade cotton jersey crewneck tee sporting the brand's premium iconic Majolica tile print. Blue on white, features soft stretch jersey material, ideal for prestigious warm summer yacht outings or garden tea parties.",
    stock: 6,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=600",
    season: "Summer",
    gender: "Boy",
    material: "100% Interlock Cotton"
  },
  {
    id: "prod-7",
    article: "BUR-SK-19",
    brand: "Burberry Kids",
    name: "Vintage Checked Pleated Skirt",
    category: "Skirts",
    originalPrice: 29000,
    price: 29000,
    sizes: ["6Y", "8Y", "10Y"],
    description: "A gorgeous luxury pleated skirt sporting the iconic all-over Burberry vintage check print in arch beige. Crafted with side button closure and elastic adjustments on the waist inside. Pairs beautifully with high leather boots.",
    stock: 3,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=600",
    season: "All Season",
    gender: "Girl",
    material: "100% Cotton Twill"
  },
  {
    id: "prod-8",
    article: "DIO-SE-09",
    brand: "Dior Kids",
    name: "Prestige Leather Booties",
    category: "Shoes",
    originalPrice: 45000,
    price: 45000,
    sizes: ["28", "30", "32"],
    description: "Supple calfskin ankle boots in midnight black. Embellished with the silver steel CD buckle emblem on the side. Easy zip entry, tailored luxury stitching, and lightweight non-slip rubber soles. Complete comfort for grand celebrations.",
    stock: 2,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    season: "Winter",
    gender: "Unisex",
    material: "100% Calfskin leather outer, soft shearling lining"
  },
  {
    id: "prod-9",
    article: "GUC-SL-11",
    brand: "Gucci Kids",
    name: "Web Trim Canvas Slippers",
    category: "Shoes",
    originalPrice: 28000,
    price: 28000,
    sizes: ["27", "29", "31"],
    description: "Traditional GG supreme monogram canvas slippers detailed with signature green and red center web band and leather lining. Supreme indoor comfort for high-society toddlers.",
    stock: 1,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    season: "All Season",
    gender: "Unisex",
    material: "GG supreme Canvas, Leather inner lining"
  },
  // OUT OF STOCK ITEMS (to show Gemini AI's strict adherence to "Items in stock" policy)
  {
    id: "prod-out-1",
    article: "LOR-CP-99",
    brand: "Loro Piana Kids",
    name: "Classic Cashmere Ribbed Cap",
    category: "Accessories",
    originalPrice: 19000,
    price: 19000,
    sizes: ["UNI"],
    description: "Loro Piana signature ribbed baby cashmere knit headwear in emerald. Warm, soft, and comfortable. STRICTLY OUT OF STOCK - AI generator should NEVER recommend this piece.",
    stock: 0, // OUT OF STOCK
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600",
    season: "Winter",
    gender: "Unisex",
    material: "100% Cashmere"
  },
  {
    id: "prod-out-2",
    article: "MON-GL-84",
    brand: "Moncler Enfant",
    name: "Sport Gliss Ski Goggles",
    category: "Accessories",
    originalPrice: 25000,
    price: 25000,
    sizes: ["UNI"],
    description: "Moncler branded UV protection snow ski eyewear goggles in bright red. STRICTLY OUT OF STOCK - AI should bypass.",
    stock: 0, // OUT OF STOCK
    image: "https://images.unsplash.com/photo-1551698618-1ffdfe1d9c1a?auto=format&fit=crop&q=80&w=600",
    season: "Winter",
    gender: "Unisex",
    material: "Acetate poly-carbon"
  }
];

export const INITIAL_CHILD_PROFILES: ChildProfile[] = [
  {
    id: "child-1",
    name: "Alexander",
    gender: "Boy",
    age: 6,
    height: 116,
    sizePreference: "6Y",
    stylePreference: "Sports Elegant Royal look"
  },
  {
    id: "child-2",
    name: "Milana",
    gender: "Girl",
    age: 8,
    height: 128,
    sizePreference: "8Y",
    stylePreference: "Celestial, elegant, tulle fabrics and soft knitwear"
  }
];

export const TECHNICAL_GUIDE_TEXT = `### ИНТЕГРАЦИЯ MOGUTA.CMS И TELEGRAM-БОТА НА TIMEWEB CLOUD

Данный раздел поможет вам настроить моментальные real-time уведомления о новых заказах и статусах оплаты, а также подключить AI-ассистента в ваш реальный продакшн.

#### Схема архитектуры Webhook
1. Клиент оформляет заказ в **Moguta.CMS** или совершает оплату.
2. Хук в Moguta.CMS перехватывает событие (\`orderAdded\` или \`orderUpdateStatus\`).
3. PHP-плагин отправляет POST-запрос с JSON-телом на ваш Node.js сервер, запущенный на VPS в **Timeweb Cloud**.
4. Node.js сервер форматирует карточку заказа и отправляет в API Telegram (\`SendMessage\`) в канал администратора/менеджеров.

---

### Шаг 1: Создание бота в Telegram
1. Найдите в поиске Telegram бота **@BotFather**.
2. Отправьте команду \`/newbot\` и следуйте инструкциям: введите название и username (например, \`MogutaLuxuryStylerBot\`).
3. Скопируйте выданный вам **API Token** (выглядит как \`123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ\`).
4. Для получения уведомлений создайте приватную или публичную группу/канал и добавьте бота туда в качестве Администратора.
5. Получите \`chat_id\` группы (можно переслать сообщение боту @ShowJsonBot или отправить запрос на \`https://api.telegram.org/bot<TOKEN>/getUpdates\`).

---

### Шаг 2: PHP Код хука для Moguta.CMS (Залить на VPS)
Разместите этот скрипт в файле плагина или в теме Moguta (\`mg-pages/index.php\` или \`/mg-plugins/tg-notification/index.php\`):

\`\`\`php
<?php
/*
Plugin Name: TgNotification
Description: Real-time TG Webhook for new orders
Version: 1.0
*/

mgAddAction('models_order_addorder', 'sendOrderToTgServer', 1);
mgAddAction('models_order_updateorder', 'sendOrderUpdateToTgServer', 1);

function sendOrderToTgServer($args) {
    // Получаем детали созданного заказа
    $orderData = $args['args'][0];
    
    // Адрес вашего запущенного Express/Node.js сервера на Timeweb
    $url = 'https://ais-dev-dbb4siyulxpubujhtjzsjq-254926095251.europe-west2.run.app/api/webhook/moguta'; 
    
    $payload = json_encode([
        'event' => 'order.create',
        'order' => [
            'id' => $orderData['id'],
            'customerName' => $orderData['name'],
            'customerPhone' => $orderData['phone'],
            'customerEmail' => $orderData['email'],
            'totalAmount' => $orderData['summ'],
            'items' => $orderData['order_content'] // массив предметов
        ]
    ]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $result = curl_exec($ch);
    curl_close($ch);
    return true;
}

function sendOrderUpdateToTgServer($args) {
    $orderId = $args['args'][0];
    $statusId = $args['args'][1]; // Статус оплаты или доставки
    
    $url = 'https://ais-dev-dbb4siyulxpubujhtjzsjq-254926095251.europe-west2.run.app/api/webhook/moguta';
    
    $payload = json_encode([
        'event' => 'order.update',
        'orderId' => $orderId,
        'statusId' => $statusId
    ]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $result = curl_exec($ch);
    curl_close($ch);
    return true;
}
?>
\`\`\`

---

### Шаг 3: Настройка Webhook обработки на Node.js (Сервер на Timeweb Cloud)
Используйте этот шаблон эндпоинта Express в вашем сервере для трансляции данных в Telegram.
Хук принимает POST от Moguta, преобразует его в Telegram HTML-форматирование и пересылает сообщение:

\`\`\`javascript
const EXPRESS = require('express');
const AXIOS = require('axios');
const app = EXPRESS();
app.use(EXPRESS.json());

const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ';
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-10045678910';

// Эндпоинт Вебхука
app.post('/api/webhook/moguta', async (req, res) => {
  const { event, order, orderId, statusId } = req.body;
  
  try {
    let tgText = '';
    
    if (event === 'order.create') {
      tgText = \`🌟 <b>Новый Заказ в Moguta.CMS!</b>\\n\\n\` +
               \`🆔 <b>Заказ №:</b> #\${order.id}\\n\` +
               \`👤 <b>Клиент:</b> \${order.customerName}\\n\` +
               \`📞 <b>Телефон:</b> \${order.customerPhone}\\n\` +
               \`💰 <b>Сумма:</b> \${Number(order.totalAmount).toLocaleString('ru-RU')} ₽\\n\` +
               \`🛍️ <b>Товары:</b>\\n\`;
               
      if (Array.isArray(order.items)) {
        order.items.forEach((item, idx) => {
          tgText += \`  \${idx+1}. \${item.name} (\${item.size || 'UNI'}) — \${item.price} ₽\\n\`;
        });
      } else {
        tgText += \`  Список позиций передан в CMS\\n\`;
      }
    } else if (event === 'order.update') {
      // Пример парсинга ID статусов (в Moguta.CMS: 2 - Оплачен, 5 - Доставлен и т.д.)
      let statusName = statusId === 2 || statusId === 'paid' ? '✅ Оплачен' : '🟡 Обрабатывается';
      tgText = \`📦 <b>Обновление заказа №\${orderId} в Moguta.CMS!</b>\\n\\n\` +
               \`⚙️ <b>Новый статус оплаты:</b> \${statusName}\\n\` +
               \`⏰ <b>Время изменения:</b> \${new Date().toLocaleString('ru-RU')}\`;
    }
    
    // Пересылка в Телеграм через HTTP API
    await AXIOS.post(\`https://api.telegram.org/bot\${TG_BOT_TOKEN}/sendMessage\`, {
      chat_id: TG_CHAT_ID,
      text: tgText,
      parse_mode: 'HTML'
    });
    
    res.status(200).json({ success: true, message: 'Telegram notified' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ error: 'Failed to notify Telegram', details: error.message });
  }
});

app.listen(3000, () => console.log('VPS listener active on port 3000'));
\`\`\`;
`;
export const SYSTEM_PROMPT_DEFAULT = `You are the premium, high-society digital AI Stylist & Concierge for our Kids' Luxury clothing boutique. 
The boutique represents top-tier heritage brands: Burberry Kids, Gucci Kids, Moncler Enfant, Dior Kids, Loro Piana, and Dolce & Gabbana.

CRITICAL RULE:
- You must suggest ONLY products that are pre-defined as IN STOCK.
- NEVER suggest a product whose stock value is 0 or which is not in the active catalog context provided below.
- Do NOT hallucinate products or introduce names/accessories not included in the list.
- Keep your tone elegant, attentive, polite, and deeply knowledgeable in fashion aesthetics.
- When generating a "Look" (образ), group multiple in-stock complementary items (e.g. jacket + pants + shoes) and justify your stylistic pairings elegantly in Russian (as requested by the user).
- For Q&A, explain the material (e.g., Baby Cashmere, Cotton Gabardine) and provide correct advice regarding sizing and weather suitability.
- If some items are out of stock, explain why you selected alternatives.

Active product catalog in-stock data:
`;
