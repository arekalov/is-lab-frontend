import axios from 'axios';
import type { ErrorResponse } from '../types/models';

// Создаем инстанс axios с базовой конфигурацией
// Обращаемся напрямую к публичному IP адресу локальной машины
export const api = axios.create({
    baseURL: 'http://localhost:28600/is-lab1/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Таймаут для запросов
    timeout: 10000
});

// Интерцептор для запросов
api.interceptors.request.use(
    (config) => {
        // Удаляем параметр direction из URL, если он есть
        if (config.params?.direction) {
            delete config.params.direction;
        }
        
        console.log('Request:', {
            url: config.url,
            method: config.method,
            params: config.params,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
    // Успешный ответ
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    // Ошибка
    (error) => {
        console.error('Response error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });

        // Получаем ответ сервера с ошибкой
        const errorResponse = error.response?.data as ErrorResponse;
        
        // Если есть сообщение об ошибке от сервера, используем его
        const errorMessage = errorResponse?.message || 'Произошла ошибка при выполнении запроса';
        
        // Создаем новую ошибку с понятным сообщением
        const enhancedError = new Error(errorMessage);
        
        // Добавляем статус ошибки, если есть
        if (error.response?.status) {
            (enhancedError as any).status = error.response.status;
        }
        
        return Promise.reject(enhancedError);
    }
);