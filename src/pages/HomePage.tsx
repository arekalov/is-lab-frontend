import { type FC, useEffect, useState, useCallback } from 'react';
import { Box, Heading, Spinner, Center, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FlatsTable } from '../components/FlatsTable/FlatsTable';
import { DeleteFlatDialog } from '../components/DeleteFlatDialog/DeleteFlatDialog';
import { flatsService } from '../services/flatsService';
import type { Flat } from '../types/models';
import { useSnackbar } from 'notistack';
import { useWebSocket } from '../hooks/useWebSocket';

export const HomePage: FC = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    // Состояние для данных
    const [flats, setFlats] = useState<Flat[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // Состояние для пагинации и сортировки
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    
    // Состояние для фильтров
    const [nameFilter, setNameFilter] = useState('');
    const [furnishFilter, setFurnishFilter] = useState('');
    const [viewFilter, setViewFilter] = useState('');

    // Состояние для диалога удаления
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [flatToDelete, setFlatToDelete] = useState<Flat | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const loadFlats = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Loading flats with params:', { page, rowsPerPage, sortField });
            const response = await flatsService.getFlats(page, rowsPerPage, sortField);
            console.log('Response:', response);
            if (response?.items && Array.isArray(response.items)) {
                // Сортируем локально, если нужно в обратном порядке
                const sortedItems = sortDirection === 'desc' 
                    ? [...response.items].reverse() 
                    : response.items;
                setFlats(sortedItems);
                setTotal(response.total);
            } else {
                console.error('Invalid response format:', response);
                enqueueSnackbar('Некорректный формат данных от сервера', { variant: 'error' });
                // Устанавливаем пустой массив, чтобы избежать ошибок
                setFlats([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error loading flats:', error);
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при загрузке данных',
                { variant: 'error' }
            );
            // Устанавливаем пустой массив при ошибке
            setFlats([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, sortField, sortDirection, enqueueSnackbar]);

    // Загружаем данные при изменении пагинации или сортировки
    useEffect(() => {
        loadFlats();
    }, [loadFlats]);

    // Subscribe to WebSocket updates for flats
    useWebSocket('FLAT', { 
        onCreate: (data) => {
            // Добавляем новую квартиру в начало списка
            setFlats(prev => [data, ...prev]);
            setTotal(prev => prev + 1);
        },
        onUpdate: (data) => {
            // Обновляем квартиру в списке
            setFlats(prev => prev.map(flat => flat.id === data.id ? data : flat));
        },
        onDelete: (id) => {
            // Удаляем квартиру из списка
            setFlats(prev => prev.filter(flat => flat.id !== id));
            setTotal(prev => prev - 1);
            
            // Если удаляемая квартира сейчас открыта для редактирования
            if (flatToDelete?.id === id) {
                handleDeleteCancel();
            }
        },
        showNotifications: true // Показываем WebSocket уведомления
    });

    // Subscribe to WebSocket updates for houses (для каскадного удаления)
    useWebSocket('HOUSE', { 
        onDelete: (houseId) => {
            // При удалении дома удаляем все его квартиры
            setFlats(prev => prev.filter(flat => flat.house?.id !== houseId));
            setTotal(prev => {
                const removed = flats.filter(flat => flat.house?.id === houseId).length;
                return prev - removed;
            });
        },
        onUpdate: (data) => {
            // При обновлении дома обновляем информацию о доме во всех квартирах
            setFlats(prev => prev.map(flat => 
                flat.house?.id === data.id 
                    ? { ...flat, house: data } 
                    : flat
            ));
        },
        showNotifications: false // Не показываем уведомления о домах на странице квартир
    });

    // Сбрасываем страницу при изменении фильтров
    useEffect(() => {
        setPage(0);
    }, [nameFilter, furnishFilter, viewFilter]);

    const handleEdit = (flat: Flat) => {
        if (flat.id) {
            navigate(`/flats/${flat.id}/edit`);
        }
    };

    const handleDelete = (flat: Flat) => {
        setFlatToDelete(flat);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!flatToDelete?.id) return;

        try {
            setDeleteLoading(true);
            await flatsService.deleteFlat(flatToDelete.id);
            // Уведомление придет через WebSocket
            setDeleteDialogOpen(false);
            setFlatToDelete(null);
            loadFlats();
        } catch (error) {
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при удалении квартиры',
                { variant: 'error' }
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setFlatToDelete(null);
    };

    const handleSortChange = (field: string) => {
        if (field === sortField) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Фильтруем данные локально
    const filteredFlats = flats.filter(flat => {
        const nameMatch = flat.name.toLowerCase().includes(nameFilter.toLowerCase());
        const furnishMatch = !furnishFilter || flat.furnish === furnishFilter;
        const viewMatch = !viewFilter || flat.view === viewFilter;
        return nameMatch && furnishMatch && viewMatch;
    });

    return (
        <Box>
            <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
                <Heading>Список квартир</Heading>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => navigate('/flats/create')}
                >
                    Добавить квартиру
                </Button>
            </Box>
            
            {loading ? (
                <Center p={8}>
                    <Spinner size="xl" />
                </Center>
            ) : (
                <FlatsTable
                    flats={filteredFlats}
                    total={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    nameFilter={nameFilter}
                    furnishFilter={furnishFilter}
                    viewFilter={viewFilter}
                    onPageChange={setPage}
                    onRowsPerPageChange={setRowsPerPage}
                    onSortChange={handleSortChange}
                    onNameFilterChange={setNameFilter}
                    onFurnishFilterChange={setFurnishFilter}
                    onViewFilterChange={setViewFilter}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {flatToDelete && (
                <DeleteFlatDialog
                    flat={flatToDelete}
                    isOpen={deleteDialogOpen}
                    isLoading={deleteLoading}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </Box>
    );
};