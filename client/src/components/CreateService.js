// C:\Users\Владелец\freelance-marketplace\client\src\components\CreateService.js
// Компонент для публикации услуги:

import React, { useState } from 'react';
import { createService } from '../services/api';

const nestedCategories = {
  "Дизайн": {
    "Логотип и(или) брендинг": ["Логотипы", "Фирменный стиль", "Брендирование и(или) сувенирка", "Визитки"],
    "Веб и(или) мобильный дизайн": ["Мобильный дизайн", "Email-дизайн", "Веб-дизайн", "Баннеры и(или) иконки"],
    "Арт и(или) иллюстрации": ["Иллюстрации и(или) рисунки", "Тату, принты", "Дизайн игр", "Готовые шаблоны и(или) рисунки", "Портрет, шарж, карикатура", "Стикеры", "NFT арт"],
    "Полиграфия": ["Брошюра и(или) буклет", "Листовка и(или) флаер", "Плакат и(или) афиша", "Календарь и(или) открытка", "Каталог, меню, книга", "Грамота и(или) сертификат", "Гайд и(или) чек-лист"],
    "Интерьер и(или) экстерьер": ["Интерьер", "Дизайн домов и(или) сооружений", "Ландшафтный дизайн", "Дизайн мебели"],
    "Промышленный дизайн": ["Упаковка и(или) этикетка", "Электроника и(или) устройства", "Предметы и(или) аксессуары"],
    "Презентации и(или) инфографика": ["Презентации", "Инфографика", "Карта и(или) схема"],
    "Обработка и(или) редактирование": ["Отрисовка в векторе", "3D-графика", "Фотомонтаж и(или) обработка"],
    "Наружная реклама": ["Билборды и(или) стенды", "Витрины и(или) вывески"],
    "Маркетплейсы и(или) соцсети": ["Дизайн в соцсетях", "Дизайн для маркетплейсов"]
  },
  "Разработка и(или) IT": {
    "Доработка и(или) настройка сайта": ["Доработка сайта", "Исправление ошибок", "Защита и(или) лечение сайта", "Настройка сайта", "Плагины и(или) темы", "Ускорение сайта"],
    "Создание сайта": ["Новый сайт", "Копия сайта"],
    "Скрипты, боты, mini apps": ["Парсеры", "Чат-боты", "Скрипты", "Telegram Mini Apps"],
    "Верстка": ["Вертка по макету", "Доработка и(или) адаптация верстки"],
    "Декстоп программирование": ["Программы на заказ", "Макросы для Office", "1C", "Готовые программы"],
    "Мобильные приложения": ["iOS", "Android"],
    "Игры": ["Разработка игр", "Готовые игры", "Игровой сервер"],
    "Сервера и(или) хостинг": ["Администрирование сервера", "Хостинг", "Домены"],
    "Юзабилити, тесты, помощь": ["Компьютерная и(или) IT помощь", "Юзабилити-аудит", "Тестирование на ошибки"]
  },
  "Тексты и(или) переводы": {
    "Резюме и(или) вакансии": ["Текст вакансии", "Составление резюме", "Сопроводительное письмо"],
    "Набор текста": ["С аудио/видео", "С изображений"],
    "Продающие и(или) бизнес-тексты": ["Продающие тексты", "Реклама и email", "Коммерческие предложения", "Скрипты продаж и(или) выступлений", "Посты для соцсетей"],
    "Тексты и(или) наполнение сайта": ["Художественные тексты", "Сценарии", "Комментарии", "Корректура", "SEO-ексты", "Карточки товаров"],
    "Переводы": ["С аудио/видео", "С текста", "С изображения", "Переводы устные"]
  },
  "SEO и(или) трафик": {
    "Трафик": ["Посетители на сайт", "Поведенческие факторы"],
    "Семантическое ядро": ["С нуля", "По сайту", "Готовое ядро"],
    "Ссылки": ["В профилях", "В соцсетях", "В комментариях", "Каталоги сайтов", "Форумные", "Статейные и(или) крауд"],
    "Статистика и(или) аналитика": ["Метрики и счетчики", "Анализ сайтов, рынка"],
    "SEO аудиты, консультации": ["SEO аудит", "Консультация"],
    "Внутренняя оптимизация": ["Полная оптимизация", "Оптимизация страниц", "Robots и(или) sitemap", "Теги", "Перелинковка", "Микроразметка"],
    "Продвижение сайта в топ": []
  },
  "Соцсети и(или) маркетинг": {
    "Базы данных и(или) клиентов": ["Сбор данных", "Готовые базы", "Проверка и(или) чистка базы"],
    "Маркетплейсы и(или) доски объявлений": ["Справочники и(или) каталоги", "Маркетплейсы", "Доски объявлений"],
    "E-mail маркетинг и(или) рассылки": ["Отправка рассылки", "Почтовые ящики"],
    "Контекстная реклама": ["Яндекс Директ", "Google Ads"],
    "Маркетинг и(или) PR": ["Контент-маркетинг", "Продвижение музыки"],
    "Соцсети и(или) SMM": ["Facebook", "X", "Instagram", "Youtube", "TikTok", "Twitch"]
  },
  "Аудио, видео, съемка": {
    "Редактирование аудио": ["Обработка звука", "Выделение звука из видео"],
    "Видеосъемка и(или) монтаж": ["Видеосъемка", "Монтаж и(или) обработка видео", "Фотосъемка"],
    "Интро и(или) анимация логотипа": ["Анимация логотипа", "Интро и заставки", "GIF-анимация"],
    "Видеоролики": ["Дудл-видео", "Анимационный ролик", "Проморолик", "3D анимация", "Скринкасты и(или) видеообзоры", "Кинетическая типографика", "Слайд-шоу", "Видео с ведущим", "Видеопрезентация", "Ролики для соцсетей"],
    "Музыка и(или) песни": ["Написание музыки", "Запись вокала", "Аранжировка", "Тексты песен", "Песня(музыка+текст+вокал)"],
    "Аудиозапись и(или) озвучка": ["Озвучка и(или) дикторы", "Аудиоролик"]
  },
  "Другое": {
    "Продажа сайтов": ["Сайт без домена", "Сайт с доменом", "Соцсети, домен, приложение", "Аудит, оценка, помощь"],
    "Персональный помощник": ["Поиск информации", "Работа в MS Office", "Анализ информации", "Любая интеллектуальная работа", "Любая рутинная работа", "Менеджмент проектов"],
    "Бухгалтерия и(или) налоги": ["Для физлиц", "Для юрлиц"],
    "Юридическая помощь": ["Дистанционное составление документов", "Юридическая консультация", "Судебный документ", "Интернет-право", "Трудовое право", "Гражданское право", "Семейное право", "Административное право", "Миграционная помощь", "Госзакупки", "Исполнительное производство"],
    "Обучение и(или) консалтинг": ["Онлайн курсы", "Консалтинг", "Репетиторы"],
    "Подбор персонала": ["Подбор резюме", "Найм специалиста"]
  }
};

const CreateService = ({ onServiceCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category1: '',
    category2: '',
    category3: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Проверяем, что все поля заполнены, и описание не менее 100 символов
    if (
      !formData.title ||
      !formData.description ||
      formData.description.length < 100 ||
      !formData.price ||
      !formData.duration ||
      !formData.category1 ||
      !formData.category2 ||
      !formData.category3
    ) {
      console.error('Все поля должны быть корректно заполнены. Описание должно быть минимум 100 символов.');
      return;
    }
    try {
      const response = await createService(formData);
      console.log('Услуга создана:', response.data);
      onServiceCreated(response.data);
      // Сброс формы
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        category1: '',
        category2: '',
        category3: ''
      });
    } catch (error) {
      console.error('Ошибка создания услуги:', error.response?.data || error.message);
    }
  };

  const category1Options = Object.keys(nestedCategories);
  const category2Options = formData.category1 ? Object.keys(nestedCategories[formData.category1]) : [];
  const category3Options =
    formData.category1 && formData.category2 ? nestedCategories[formData.category1][formData.category2] : [];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Объявление услуги</h2>

        {/* Название задачи с иконкой вопроса и подсказкой */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <label htmlFor="title" style={{ fontWeight: 'bold', marginRight: '4px' }}>
            Название задачи
          </label>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              lineHeight: '16px',
              textAlign: 'center',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            title="Название должно привлечь внимание и отразить суть задачи."
          >
            ?
          </span>
        </div>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Введите название"
          value={formData.title}
          onChange={handleChange}
          maxLength={55}
          style={{ marginBottom: '4px', width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
        <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>
          {formData.title.length} из 55 символов
        </div>

        {/* Детальное описание задачи с иконкой вопроса и подсказкой */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <label htmlFor="description" style={{ fontWeight: 'bold', marginRight: '4px' }}>
            Детальное описание задачи
          </label>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              lineHeight: '16px',
              textAlign: 'center',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            title="Опишите услуги, которые вам нужны. Включите в описание важные нюансы."
          >
            ?
          </span>
        </div>
        <textarea
          id="description"
          name="description"
          placeholder="Опишите задание детально"
          value={formData.description}
          onChange={handleChange}
          maxLength={1500}
          rows={6}
          style={{
            marginBottom: '4px',
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>
          {formData.description.length} из 1500 символов (минимум 100)
        </div>

        {/* Цена */}
        <input
          type="number"
          name="price"
          placeholder="Введите цену"
          value={formData.price}
          onChange={handleChange}
          style={{ marginBottom: '12px', width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />

        {/* Срок */}
        <input
          type="number"
          name="duration"
          placeholder="Срок выполнения (в днях)"
          value={formData.duration}
          onChange={handleChange}
          style={{ marginBottom: '12px', width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />

        {/* === Категория 1 === */}
        <select
          name="category1"
          value={formData.category1}
          onChange={handleChange}
          style={{
            color: formData.category1 ? '#000' : '#888',
            marginBottom: '12px',
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box'
          }}
        >
          <option value="" disabled hidden style={{ color: '#888' }}>
            Выберите категорию
          </option>
          {category1Options.map((cat) => (
            <option key={cat} value={cat} style={{ color: '#000' }}>
              {cat}
            </option>
          ))}
        </select>

        {/* === Категория 2 === */}
        {category2Options.length > 0 && (
          <select
            name="category2"
            value={formData.category2}
            onChange={handleChange}
            style={{
              color: formData.category2 ? '#000' : '#888',
              marginBottom: '12px',
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box'
            }}
          >
            <option value="" disabled hidden style={{ color: '#888' }}>
              Выберите подкатегорию
            </option>
            {category2Options.map((subCat) => (
              <option key={subCat} value={subCat} style={{ color: '#000' }}>
                {subCat}
              </option>
            ))}
          </select>
        )}

        {/* === Категория 3 === */}
        {category3Options.length > 0 && (
          <select
            name="category3"
            value={formData.category3}
            onChange={handleChange}
            style={{
              color: formData.category3 ? '#000' : '#888',
              marginBottom: '12px',
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box'
            }}
          >
            <option value="" disabled hidden style={{ color: '#888' }}>
              Выберите уточнение
            </option>
            {category3Options.map((item) => (
              <option key={item} value={item} style={{ color: '#000' }}>
                {item}
              </option>
            ))}
          </select>
        )}

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Создать услугу
        </button>
      </form>
    </div>
  );
};

export default CreateService;
