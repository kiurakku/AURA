# Функціонал нарахування балансу в адмін-панелі

## Новий API Endpoint

### Нарахування балансу користувачу
**POST** `/api/admin/users/:userId/balance`

**Параметри:**
- `userId` (URL параметр) - ID користувача або Telegram ID
- `amount` (body) - Сума для нарахування (обов'язково)
- `currency` (body) - Валюта (за замовчуванням: 'USDT')
- `type` (body) - Тип балансу: 'balance' (основний) або 'bonus' (бонусний) (за замовчуванням: 'balance')
- `description` (body) - Опис транзакції (опціонально)

**Приклад запиту:**
```json
POST /api/admin/users/123456789/balance
Headers: {
  "x-telegram-init-data": "your_init_data"
}
Body: {
  "amount": 10.5,
  "currency": "USDT",
  "type": "balance",
  "description": "Бонус за активність"
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Balance updated successfully",
  "user": {
    "id": 1,
    "telegram_id": 123456789,
    "username": "username",
    "balance": 110.5,
    "bonus_balance": 0
  }
}
```

### Отримання інформації про користувача
**GET** `/api/admin/users/:userId`

**Відповідь:**
```json
{
  "user": { ... },
  "transactions": [ ... ],
  "games": [ ... ]
}
```

### Пошук користувачів
**GET** `/api/admin/users/search/:query`

Шукає користувачів за Telegram ID, username або first_name.

## Використання через API

### Приклад через curl:

```bash
# Нарахувати 10 USDT основного балансу
curl -X POST "https://auraslots.fly.dev/api/admin/users/123456789/balance" \
  -H "Content-Type: application/json" \
  -H "x-telegram-init-data: YOUR_INIT_DATA" \
  -d '{
    "amount": 10,
    "currency": "USDT",
    "type": "balance",
    "description": "Бонус за реєстрацію"
  }'

# Нарахувати 5 USDT бонусного балансу
curl -X POST "https://auraslots.fly.dev/api/admin/users/123456789/balance" \
  -H "Content-Type: application/json" \
  -H "x-telegram-init-data: YOUR_INIT_DATA" \
  -d '{
    "amount": 5,
    "currency": "USDT",
    "type": "bonus",
    "description": "Промо-бонус"
  }'
```

### Приклад через JavaScript:

```javascript
// Нарахувати баланс
async function addBalance(userId, amount, type = 'balance', description = '') {
  const response = await fetch(`/api/admin/users/${userId}/balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': window.Telegram?.WebApp?.initData
    },
    body: JSON.stringify({
      amount,
      currency: 'USDT',
      type,
      description
    })
  });
  
  return await response.json();
}

// Використання
await addBalance(123456789, 10, 'balance', 'Бонус за активність');
await addBalance(123456789, 5, 'bonus', 'Промо-бонус');
```

## Безпека

- ✅ Доступ тільки для адмінів (перевірка через `isAdmin` middleware)
- ✅ Всі операції логуються в транзакції
- ✅ Зберігається інформація про адміністратора, який виконав операцію

## Примітки

- `userId` може бути як внутрішнім ID користувача, так і Telegram ID
- Тип `balance` - основний баланс (можна виводити)
- Тип `bonus` - бонусний баланс (використовується для ігор)
- Всі операції створюють запис в таблиці `transactions` з типом `admin_bonus`
