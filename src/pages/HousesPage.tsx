import { type FC, useEffect, useState } from 'react';
import { Box, Heading, Button, useDisclosure, Spinner, Center } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { HousesTable } from '../components/HousesTable/HousesTable';
import { housesService } from '../services/housesService';
import type { House } from '../types/models';
import { useSnackbar } from 'notistack';

export const HousesPage: FC = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(false);

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

    const handleDelete = async (house: House) => {
        if (!house.id) return;

        try {
            await housesService.deleteHouse(house.id);
            enqueueSnackbar('Дом успешно удален', { variant: 'success' });
            loadHouses();
        } catch (error) {
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при удалении дома',
                { variant: 'error' }
            );
        }
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
        </Box>
    );
};
