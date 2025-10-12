import { api } from './api';
import { API_ENDPOINTS } from '../utils/config';
import type { House } from '../types/models';

export const housesService = {
    /**
     * Получение списка всех домов
     */
    getHouses: async () => {
        try {
            const response = await api.get<{ data: House[] }>(API_ENDPOINTS.houses);
            return response.data.data || []; // Возвращаем пустой массив, если данных нет
        } catch (error) {
            console.error('Failed to fetch houses:', error);
            return []; // В случае ошибки возвращаем пустой массив
        }
    },

    /**
     * Получение дома по ID
     * @param id ID дома
     * @throws {Error} Если дом не найден
     */
    getHouseById: async (id: number) => {
        const response = await api.get<House>(`${API_ENDPOINTS.houses}/${id}`);
        return response.data;
    },

    /**
     * Создание нового дома
     * @param house Данные нового дома
     * @throws {Error} Если данные невалидны или произошла ошибка при создании
     */
    createHouse: async (house: Omit<House, 'id'>) => {
        const response = await api.post<House>(API_ENDPOINTS.houses, house);
        return response.data;
    },

    /**
     * Обновление существующего дома
     * @param id ID дома
     * @param house Обновленные данные дома
     * @throws {Error} Если дом не найден или данные невалидны
     */
    updateHouse: async (id: number, house: Omit<House, 'id'>) => {
        const response = await api.put<House>(`${API_ENDPOINTS.houses}/${id}`, house);
        return response.data;
    },

    /**
     * Удаление дома
     * @param id ID дома
     * @throws {Error} Если дом не найден или есть связанные квартиры
     */
    deleteHouse: async (id: number) => {
        await api.delete(`${API_ENDPOINTS.houses}/${id}`);
    }
};