import { type FC, useEffect, useState, useCallback } from 'react';
import { Box, Heading, Button, Spinner, Center } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { HousesTable } from '../components/HousesTable/HousesTable';
import { DeleteHouseDialog } from '../components/DeleteHouseDialog/DeleteHouseDialog';
import { housesService } from '../services/housesService';
import type { House } from '../types/models';
import { useSnackbar } from 'notistack';
import { useWebSocket } from '../hooks/useWebSocket';

export const HousesPage: FC = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    // Состояние для данных
    const [houses, setHouses] = useState<House[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // Состояние для пагинации и сортировки
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    
    // Состояние для фильтров
    const [nameFilter, setNameFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [numberOfFlatsOnFloorFilter, setNumberOfFlatsOnFloorFilter] = useState('');

    // Состояние для диалога удаления
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [houseToDelete, setHouseToDelete] = useState<House | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const loadHouses = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Loading houses with params:', { page, rowsPerPage, sortField });
            const response = await housesService.getHouses(page, rowsPerPage, sortField);
            console.log('Response:', response);
            if (response?.items && Array.isArray(response.items)) {
                // Сортируем локально, если нужно в обратном порядке
                const sortedItems = sortDirection === 'desc' 
                    ? [...response.items].reverse() 
                    : response.items;
                setHouses(sortedItems);
                setTotal(response.total);
            } else {
                console.error('Invalid response format:', response);
                enqueueSnackbar('Некорректный формат данных от сервера', { variant: 'error' });
                setHouses([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error loading houses:', error);
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при загрузке данных',
                { variant: 'error' }
            );
            setHouses([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, sortField, sortDirection, enqueueSnackbar]);

    // Загружаем данные при изменении пагинации или сортировки
    useEffect(() => {
        loadHouses();
    }, [loadHouses]);

    // Subscribe to WebSocket updates for houses
    useWebSocket('HOUSE', { onDataChange: loadHouses });

    // Сбрасываем страницу при изменении фильтров
    useEffect(() => {
        setPage(0);
    }, [nameFilter, yearFilter, numberOfFlatsOnFloorFilter]);

    const handleEdit = (house: House) => {
        if (house.id) {
            navigate(`/houses/${house.id}/edit`);
        }
    };

    const handleDelete = (house: House) => {
        setHouseToDelete(house);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!houseToDelete?.id) return;

        try {
            setDeleteLoading(true);
            await housesService.deleteHouse(houseToDelete.id);
            enqueueSnackbar('Дом успешно удален', { variant: 'success' });
            setDeleteDialogOpen(false);
            setHouseToDelete(null);
            loadHouses();
        } catch (error) {
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при удалении дома',
                { variant: 'error' }
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setHouseToDelete(null);
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
    const filteredHouses = houses.filter(house => {
        const nameMatch = house.name.toLowerCase().includes(nameFilter.toLowerCase());
        const yearMatch = !yearFilter || house.year.toString().includes(yearFilter);
        const flatsMatch = !numberOfFlatsOnFloorFilter || 
            house.numberOfFlatsOnFloor.toString().includes(numberOfFlatsOnFloorFilter);
        return nameMatch && yearMatch && flatsMatch;
    });

    return (
        <Box>
            <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
                <Heading>Список домов</Heading>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => navigate('/houses/create')}
                >
                    Добавить дом
                </Button>
            </Box>
            
            {loading ? (
                <Center p={8}>
                    <Spinner size="xl" />
                </Center>
            ) : (
                <HousesTable
                    houses={filteredHouses}
                    total={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    nameFilter={nameFilter}
                    yearFilter={yearFilter}
                    numberOfFlatsOnFloorFilter={numberOfFlatsOnFloorFilter}
                    onPageChange={setPage}
                    onRowsPerPageChange={setRowsPerPage}
                    onSortChange={handleSortChange}
                    onNameFilterChange={setNameFilter}
                    onYearFilterChange={setYearFilter}
                    onNumberOfFlatsOnFloorFilterChange={setNumberOfFlatsOnFloorFilter}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {houseToDelete && (
                <DeleteHouseDialog
                    house={houseToDelete}
                    isOpen={deleteDialogOpen}
                    isLoading={deleteLoading}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </Box>
    );
};