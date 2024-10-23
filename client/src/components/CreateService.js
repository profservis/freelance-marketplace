//C:\Users\Владелец\freelance-marketplace\client\src\components\CreateService.js
//Компонент для публикации услуги:

import React, { useState } from 'react';
import { createService } from '../services/api';

const CreateService = ({ onServiceCreated }) => { //4 Мы добавим состояние для предварительно созданных услуг и функцию для добавления услуг в это состояние:
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
  });

  //const [preview, setPreview] = useState(false); //1
	
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

	/* const handlePreview = (e) => { //2
		e.preventDefault();
		setPreview(true);
	}; */

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await createService(formData); // const response = await createService({ ...formData, status: 'published' });
			console.log(response.data);
			
			onServiceCreated(response.data);  // Сообщаем родительскому компоненту о созданной услуге
			//setPreview(false); // 3 Очистка превью после успешной отправки
			
			setFormData({// Очистка формы после успешной отправки
				title: '',
				description: '',
				price: '',
				duration: '',
			});
		} catch (error) {
			console.error(error.response.data.message);
		}
	};

   return (
		<div>
			<form onSubmit={handleSubmit}>
			<h2>Объявление услуги</h2>
			<input type="text" name="title" placeholder="Заголовок" value={formData.title} onChange={handleChange} />
			<input type="text" name="description" placeholder="Описание" value={formData.description} onChange={handleChange} />
			<input type="number" name="price" placeholder="Цена" value={formData.price} onChange={handleChange} />
			<input type="number" name="duration" placeholder="Срок выполнения (в днях)" value={formData.duration} onChange={handleChange} />
			<button type="submit">Создать услугу</button>
      </form>
		</div>
  );
};

export default CreateService;