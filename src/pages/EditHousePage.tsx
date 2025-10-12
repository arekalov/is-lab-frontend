import { type FC, useEffect, useState } from 'react';
import { Box, Heading, Spinner, Center } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { HouseForm } from '../components/HouseForm/HouseForm';
import { housesService } from '../services/housesService';
import type { House } from '../types/models';
import { useSnackbar } from 'notistack';

export const EditHousePage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const [isLoading, setIsLoading] = useState(false);
    const [house, setHouse] = useState<House | null>(null);

    useEffect(() => {
        const loadHouse = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await housesService.getHouseById(Number(id));
                setHouse(data);
            } catch (error) {
                enqueueSnackbar(
                    error instanceof Error ? error.message : 'Ошибка при загрузке данных',
                    { variant: 'error' }
                );
                navigate('/houses');
            } finally {
                setIsLoading(false);
            }
        };

        loadHouse();
    }, [id, navigate, enqueueSnackbar]);

    const handleSubmit = async (data: any) => {
        if (!id) return;

        try {
            setIsLoading(true);
            await housesService.updateHouse(Number(id), data);
            enqueueSnackbar('Дом успешно обновлен', { variant: 'success' });
            navigate('/houses');
        } catch (error) {
            enqueueSnackbar(
                error instanceof Error ? error.message : 'Ошибка при обновлении дома',
                { variant: 'error' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !house) {
        return (
            <Center p={8}>
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Box>
            <Heading mb={6}>Редактирование дома</Heading>
            <HouseForm
                onSubmit={handleSubmit}
                initialData={house}
                isLoading={isLoading}
            />
        </Box>
    );
};
