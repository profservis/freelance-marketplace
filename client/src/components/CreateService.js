// C:\Users\Владелец\freelance-marketplace\client\src\components\CreateService.js
// Компонент для публикации услуги:

//import React, { useState } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { createService, getCategories } from '../services/api';

const initialForm = {
  title: '',
  description: '',
  price: '',
  duration: '',
  category1: '',
  category2: '',
  category3: ''
};

const fieldOrder = ['title', 'description', 'price', 'duration', 'category1', 'category2', 'category3'];

const CreateService = ({ onServiceCreated }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({}); // { title: '...', price: '...', _global: '...' }
  const [isPriceValid, setIsPriceValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
	
  const [nestedCategories, setNestedCategories] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // refs для фокуса
  const refs = {
    title: useRef(null),
    description: useRef(null),
    price: useRef(null),
    duration: useRef(null),
    category1: useRef(null),
    category2: useRef(null),
    category3: useRef(null)
  };

	useEffect(() => {
    let mounted = true;
    setCategoriesLoading(true);
    getCategories()
      .then(resp => {
        if (!mounted) return;
        setNestedCategories(resp.data || {});
        setCategoriesError(null);
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        if (!mounted) return;
        setNestedCategories({});
        setCategoriesError('Не удалось загрузить категории. Попробуйте позже.');
      })
      .finally(() => {
        if (mounted) setCategoriesLoading(false);
      });
    return () => { mounted = false; };
	}, []);
	
  const category1Options = Object.keys(nestedCategories);
  const category2Options = formData.category1 ? Object.keys(nestedCategories[formData.category1] || {}) : [];
  const category3Options = formData.category1 && formData.category2 ? (nestedCategories[formData.category1] ? nestedCategories[formData.category1][formData.category2] || [] : []) : [];
	
  const validateField = (name, value) => {
    // возвращает строку с ошибкой или null
    if (name === 'title') {
      if (!value || value.trim().length === 0) return 'Название обязательно';
      if (value.trim().length > 55) return 'Название не должно превышать 55 символов';
      return null;
    }
    if (name === 'description') {
      if (!value || value.trim().length < 100) return 'Описание — минимум 100 символов';
      if (value.trim().length > 1500) return 'Описание слишком длинное';
      return null;
    }
    if (name === 'price') {
      const raw = String(value).replace(/\s/g, '');
      if (raw === '') return 'Цена обязательна';
      if (!/^\d+$/.test(raw)) return 'Введите корректное число (только цифры)';
      const num = Number(raw);
      if (num < 500 || num > 200000) return 'Цена должна быть в диапазоне 500–200000';
      return null;
    }
    if (name === 'duration') {
      if (value === '' || value === null || isNaN(Number(value))) return 'Срок должен быть положительным числом (в днях)';
      if (Number(value) <= 0) return 'Срок должен быть положительным числом (в днях)';
      return null;
    }
    if (name === 'category1' || name === 'category2' || name === 'category3') {
      // для категорий проверяем только на непустое значение; полноценную whitelist-валидацию нужно на сервере
      if (!value) return 'Выберите полную категорию';
      return null;
    }
    return null;
  };

   const handleChange = (e) => {
		const { name, value } = e.target;
		// Сброс глобальной ошибки при любом изменении
		setErrors(prev => {
			const next = { ...prev };
			delete next._global;
			return next;
		});

      // если меняем верхнюю категорию — очищаем нижестоящие
		if (name === 'category1') {
			setFormData(prev => ({ ...prev, category1: value, category2: '', category3: '' }));
			// валидация category1
			const err = validateField('category1', value);
			setErrors(prev => ({ ...prev, category1: err || undefined }));
			return;
		}
		if (name === 'category2') {
			setFormData(prev => ({ ...prev, category2: value, category3: '' }));
			const err = validateField('category2', value);
			setErrors(prev => ({ ...prev, category2: err || undefined }));
			return;
		}

		if (name === 'price') {//Если вы предпочитаете хранить в formData.price только числа (без пробелов), используйте вот такой вариант (тогда raw используется — ESLint молчит и данные нормализуются сразу):
			const raw = String(value).replace(/\s/g, ''); // теперь используется
			setFormData(prev => ({ ...prev, price: raw })); // храним "чистую" цену
			const err = validateField('price', raw);
			setErrors(prev => ({ ...prev, price: err || undefined }));
			setIsPriceValid(!err);
			return;
		}


		// обычное поле
		setFormData(prev => ({ ...prev, [name]: value }));
		const err = validateField(name, value);
		setErrors(prev => ({ ...prev, [name]: err || undefined }));
   };

  const validateAll = () => {
    const newErrors = {};
    // проверяем все поля по порядку
    Object.keys(initialForm).forEach((key) => {
      // Если категория2/3 пустые, валидируем по реальному состоянию
      const value = formData[key];
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
	 });
	  
	  // additionally check that categories exist in loaded nestedCategories (if categories loaded)
    if (!categoriesLoading && Object.keys(nestedCategories).length > 0) {
      if (formData.category1 && !nestedCategories[formData.category1]) newErrors.category1 = 'Недопустимая категория';
      if (formData.category1 && formData.category2 && nestedCategories[formData.category1] && !nestedCategories[formData.category1][formData.category2]) newErrors.category2 = 'Недопустимая подрубрика';
      if (formData.category1 && formData.category2 && formData.category3 && nestedCategories[formData.category1] && nestedCategories[formData.category1][formData.category2] && !nestedCategories[formData.category1][formData.category2].includes(formData.category3)) newErrors.category3 = 'Недопустимое уточнение';
    }
    return newErrors;
  };

  const focusFirstError = (errs) => {
    for (const key of fieldOrder) {
      if (errs[key]) {
        const r = refs[key];
        if (r && r.current && typeof r.current.focus === 'function') {
          r.current.focus();
          // плавный скролл, если нужно
          r.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // убираем предыдущие
    const validation = validateAll();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      focusFirstError(validation);
      return;
    }

    // Подготовка payload
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(String(formData.price).replace(/\s/g, '')),
      duration: Number(formData.duration),
      category1: formData.category1,
      category2: formData.category2,
      category3: formData.category3
    };

    try {
      setSubmitting(true);
      const response = await createService(payload);
      const created = response.data;
      onServiceCreated && onServiceCreated(created);
      setFormData(initialForm);
      setErrors({});
      setIsPriceValid(false);
    } catch (err) {
      // серверная ошибка — положим в _global или если есть field-specific message, распарсим
      const message = err?.response?.data?.message || err?.message || 'Ошибка создания услуги';
      // Если сервер присылает объект ошибок — используйте его (например: { field: 'price', message: '...' })
      if (err?.response?.data?.errors && typeof err.response.data.errors === 'object') {
        setErrors(err.response.data.errors);
        focusFirstError(err.response.data.errors);
      } else {
        setErrors({ _global: message });
        // опционально: скролл наверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      console.error('CreateService error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
         <h2>Объявление услуги</h2>
		   {categoriesError && (/* Лучшее место для вывода ошибки загрузки категорий — сразу после заголовка формы, чтобы пользователь сразу увидел причину, если категории не загрузились */
 				<div style={{ color: 'red', marginBottom: 12 }} role="alert">
    				{categoriesError}
  				</div>
			  )}
			  
        {/* Общая (глобальная) ошибка сверху */}
        {errors._global && (
          <div style={{ color: 'red', marginBottom: 12 }} role="alert">
            {errors._global}
          </div>
        )}

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <label htmlFor="title" style={{ fontWeight: 'bold', marginRight: 4 }}>Название задачи</label>
          <span title="Название должно привлечь внимание и отразить суть задачи." style={{ display: 'inline-block', width: 16, height: 16, textAlign: 'center', borderRadius: '50%', backgroundColor: '#ccc', color: '#fff', fontSize: 12 }}>?</span>
        </div>
        <input
          id="title"
          name="title"
          ref={refs.title}
          type="text"
          placeholder="Введите название"
          value={formData.title}
          onChange={handleChange}
          maxLength={55}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'err-title' : undefined}
          style={{ marginBottom: 4, width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
        {errors.title && <div id="err-title" style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>{errors.title}</div>}
        <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>{formData.title.length} / 55</div>

        {/* Description */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <label htmlFor="description" style={{ fontWeight: 'bold', marginRight: 4 }}>Детальное описание задачи</label>
          <span title="Опишите услуги, которые вам нужны. Включите важные нюансы." style={{ display: 'inline-block', width: 16, height: 16, textAlign: 'center', borderRadius: '50%', backgroundColor: '#ccc', color: '#fff', fontSize: 12 }}>?</span>
        </div>
        <textarea
          id="description"
          name="description"
          ref={refs.description}
          placeholder="Опишите задание детально"
          value={formData.description}
          onChange={handleChange}
          maxLength={1500}
          rows={6}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'err-description' : undefined}
          style={{ marginBottom: 8, width: '100%', padding: 8, boxSizing: 'border-box', resize: 'vertical' }}
        />
        {errors.description && <div id="err-description" style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>{errors.description}</div>}
        <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>{formData.description.length} из 1500 символов (минимум 100)</div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <label htmlFor="price" style={{ fontWeight: 'bold', marginRight: 4 }}>Цена</label>
          <span title="Отсекать предложения от исполнителей свыше указанной суммы." style={{ display: 'inline-block', width: 16, height: 16, textAlign: 'center', borderRadius: '50%', backgroundColor: '#ccc', color: '#fff', fontSize: 12 }}>?</span>
        </div>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: isPriceValid ? '#2ecc71' : (errors.price ? 'red' : '#555') }}>₽</span>
          <input
            id="price"
            name="price"
            ref={refs.price}
            type="text"
            value={formData.price}
            onChange={handleChange}
            placeholder="Введите цену"
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? 'err-price' : undefined}
            style={{ width: '100%', padding: '8px 8px 8px 28px' }}
          />
        </div>
        {errors.price && <div id="err-price" style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>{errors.price}</div>}

        {/* Duration */}
        <input
          id="duration"
          ref={refs.duration}
          type="number"
          name="duration"
          placeholder="Срок выполнения (в днях)"
          value={formData.duration}
          onChange={handleChange}
          aria-invalid={!!errors.duration}
          aria-describedby={errors.duration ? 'err-duration' : undefined}
          style={{ marginBottom: 12, width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
        {errors.duration && <div id="err-duration" style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>{errors.duration}</div>}

        {/* Categories */}
        <select
          name="category1"
          ref={refs.category1}
          value={formData.category1}
          onChange={handleChange}
          aria-invalid={!!errors.category1}
          aria-describedby={errors.category1 ? 'err-category1' : undefined}
          style={{ marginBottom: 12, width: '100%', padding: 8 }}
        >
          <option value="" disabled hidden>Выберите рубрику</option>
          {category1Options.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {errors.category1 && <div id="err-category1" style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>{errors.category1}</div>}

        {category2Options.length > 0 && (
          <>
            <select
              name="category2"
              ref={refs.category2}
              value={formData.category2}
              onChange={handleChange}
              aria-invalid={!!errors.category2}
              aria-describedby={errors.category2 ? 'err-category2' : undefined}
              style={{ marginBottom: 12, width: '100%', padding: 8 }}
            >
              <option value="" disabled hidden>Выберите подрубрику</option>
              {category2Options.map(sc => <option key={sc} value={sc}>{sc}</option>)}
            </select>
            {errors.category2 && <div id="err-category2" style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>{errors.category2}</div>}
          </>
        )}

        {category3Options.length > 0 && (
          <>
            <select
              name="category3"
              ref={refs.category3}
              value={formData.category3}
              onChange={handleChange}
              aria-invalid={!!errors.category3}
              aria-describedby={errors.category3 ? 'err-category3' : undefined}
              style={{ marginBottom: 12, width: '100%', padding: 8 }}
            >
              <option value="" disabled hidden>Выберите уточнение</option>
              {category3Options.map(it => <option key={it} value={it}>{it}</option>)}
            </select>
            {errors.category3 && <div id="err-category3" style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>{errors.category3}</div>}
          </>
        )}

        <button type="submit" disabled={submitting} style={{ padding: '10px 20px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'Создание...' : 'Создать услугу'}
        </button>
      </form>
    </div>
  );
};

export default CreateService;