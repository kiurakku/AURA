import React, { useState } from 'react';
import './LegalDocuments.css';

function LegalDocuments() {
  const [activeDoc, setActiveDoc] = useState(null);

  const documents = [
    {
      id: 'privacy',
      title: 'Політика конфіденційності',
      content: `Політика конфіденційності AURA Casino

1. Збір інформації
Ми збираємо мінімальну необхідну інформацію для роботи сервісу:
- Telegram ID та username
- Історія транзакцій
- Ігрова статистика

2. Використання даних
Ваші дані використовуються виключно для:
- Надання послуг казино
- Обробки транзакцій
- Покращення сервісу

3. Захист даних
Всі дані захищені сучасними методами шифрування.
Ми не передаємо ваші дані третім особам без вашої згоди.

4. Ваші права
Ви маєте право:
- Отримати копію ваших даних
- Видалити ваші дані
- Відкликати згоду на обробку

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
    },
    {
      id: 'terms',
      title: 'Правила платформи',
      content: `Правила платформи AURA Casino

1. Загальні положення
AURA Casino - це платформа для розваг та ігор.
Мінімальний вік: 18 років.

2. Правила гри
- Всі ігри працюють на принципі Provably Fair
- Мінімальна ставка: 0.1 USDT
- Максимальна ставка: 1000 USDT

3. Транзакції
- Депозити обробляються автоматично
- Виводи до 50 USDT - автоматично
- Виводи понад 50 USDT - ручне підтвердження

4. Заборонено
- Використання ботів та скриптів
- Обхід системи безпеки
- Шахрайство та маніпуляції

5. Санкції
За порушення правил:
- Попередження
- Тимчасове блокування
- Постійне блокування

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
    },
    {
      id: 'agreement',
      title: 'Умови користувацької згоди',
      content: `Умови користувацької згоди AURA Casino

Приймаючи ці умови, ви підтверджуєте:

1. Вік та правомочність
- Вам виповнилося 18 років
- Ви маєте право укладати угоди

2. Розуміння ризиків
- Гра в казино може призвести до втрати коштів
- Ви граєте на свій ризик
- Ми не несемо відповідальності за ваші втрати

3. Відповідальність
- Ви несете повну відповідальність за свої дії
- Заборонено грати під впливом алкоголю/наркотиків
- Рекомендуємо грати відповідально

4. Згода на обробку даних
- Ви згодні на обробку ваших персональних даних
- Ви згодні отримувати сповіщення
- Ви можете відкликати згоду в будь-який час

5. Зміни умов
Ми залишаємо за собою право змінювати умови.
Про зміни буде повідомлено завчасно.

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
    }
  ];

  return (
    <div className="legal-documents">
      <h3 className="legal-title">Правові документи</h3>
      <div className="documents-list">
        {documents.map((doc) => (
          <div key={doc.id} className="document-item glass-card">
            <div className="document-header">
              <h4 className="document-title">{doc.title}</h4>
              <button
                className="document-toggle"
                onClick={() => setActiveDoc(activeDoc === doc.id ? null : doc.id)}
              >
                {activeDoc === doc.id ? '▼' : '▶'}
              </button>
            </div>
            {activeDoc === doc.id && (
              <div className="document-content">
                <pre>{doc.content}</pre>
                <button className="btn btn-secondary document-close" onClick={() => setActiveDoc(null)}>
                  Закрити
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LegalDocuments;
