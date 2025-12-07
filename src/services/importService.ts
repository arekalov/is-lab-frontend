import { api } from './api';
import type { ImportOperation, ImportHistory, PagedResponse } from '../types/models';

/**
 * Сервис для работы с импортом
 */

/**
 * Импорт объектов (CREATE/UPDATE/DELETE)
 */
export const importObjects = async (operations: ImportOperation[]): Promise<ImportHistory> => {
    const response = await api.post<ImportHistory>('/import', operations);
    return response.data;
};

/**
 * Получить историю импорта с пагинацией
 */
export const getImportHistory = async (page: number = 0, size: number = 10): Promise<PagedResponse<ImportHistory>> => {
    const response = await api.get<PagedResponse<ImportHistory>>('/import/history', {
        params: { page, size }
    });
    return response.data;
};

/**
 * Получить последние N записей истории импорта
 */
export const getLatestImportHistory = async (limit: number = 5): Promise<ImportHistory[]> => {
    const response = await api.get<ImportHistory[]>('/import/history/latest', {
        params: { limit }
    });
    return response.data;
};

