import { type FC, useEffect, useState } from 'react';
import { Box, Heading, Spinner, Center } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FlatForm } from '../components/FlatForm/FlatForm';
import { flatsService } from '../services/flatsService';
import { housesService } from '../services/housesService';
import type { Flat, House } from '../types/models';
import { useSnackbar } from 'notistack';

export const EditFlatPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const [isLoading, setIsLoading] = useState(false);
    const [flat, setFlat] = useState<Flat | null>(null);
    const [houses, setHouses] = useState<House[]>([]);

    // Загружаем данные квартиры и список домов
    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const [flatData, housesResponse] = await Promise.all([
                    flatsService.getFlatById(Number(id)),
                    housesService.getHouses(0, 1000) // Запрашиваем все дома
                ]);
                setFlat(flatData);
                setHouses(housesResponse.items);
            } catch (error) {
                enqueueSnackbar(
                    error instanceof Error ? error.message : 'Ошибка при загрузке данных',
                    { variant: 'error' }
                );
                navigate('/'); // Возвращаемся на главную при ошибке
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, navigate, enqueueSnackbar]);

    const handleSubmit = async (data: any) => {
        if (!id) return;

        try {
            setIsLoading(true);
            // Преобразуем данные перед отправкой
            const updateData = {
                name: data.name,
                coordinates: {
                    x: Number(data.coordinates.x),
                    y: Number(data.coordinates.y)
                },
                area: Number(data.area),
                price: Number(data.price),
                balcony: Boolean(data.balcony),
                timeToMetroOnFoot: Number(data.timeToMetroOnFoot),
                numberOfRooms: Number(data.numberOfRooms),
                livingSpace: Number(data.livingSpace),
                furnish: data.furnish,
                view: data.view,
                houseId: data.houseId ? Number(data.houseId) : null
            };
            
            await flatsService.updateFlat(Number(id), updateData);
            enqueueSnackbar('Квартира успешно обновлена', { variant: 'success' });
            navigate('/');
        } catch (error) {
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при обновлении квартиры',
                { variant: 'error' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !flat) {
        return (
            <Center p={8}>
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Box>
            <Heading mb={6}>Редактирование квартиры</Heading>
            <FlatForm
                onSubmit={handleSubmit}
                availableHouses={houses}
                initialData={flat}
                isLoading={isLoading}
            />
        </Box>
    );
};