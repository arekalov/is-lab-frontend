import { type FC, useEffect, useState } from 'react';
import { Box, Heading, Button, Spinner, Center } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { HousesTable } from '../components/HousesTable/HousesTable';
import { DeleteHouseDialog } from '../components/DeleteHouseDialog/DeleteHouseDialog';
import { housesService } from '../services/housesService';
import type { House } from '../types/models';
import { useSnackbar } from 'notistack';

export const HousesPage: FC = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(false);

    // Состояние для диалога удаления
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [houseToDelete, setHouseToDelete] = useState<House | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const loadHouses = async () => {
        try {
            setLoading(true);
            const data = await housesService.getHouses();
            setHouses(data);
        } catch (error) {
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при загрузке данных',
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHouses();
    }, []);

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
                    houses={houses}
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