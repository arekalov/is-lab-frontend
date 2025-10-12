import { type FC, useEffect, useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FlatForm } from '../components/FlatForm/FlatForm';
import { flatsService } from '../services/flatsService';
import { housesService } from '../services/housesService';
import type { House } from '../types/models';

export const CreateFlatPage: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [houses, setHouses] = useState<House[]>([]);

    // Загружаем список доступных домов
    useEffect(() => {
        const loadHouses = async () => {
            try {
                const houses = await housesService.getHouses();
                setHouses(houses);
            } catch (error) {
                console.error('Failed to load houses:', error);
            }
        };
        loadHouses();
    }, []);

    const handleSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            await flatsService.createFlat(data);
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHousesUpdate = (updatedHouses: House[]) => {
        setHouses(updatedHouses);
    };

    return (
        <Box>
            <Heading mb={6}>Добавление новой квартиры</Heading>
            <FlatForm
                onSubmit={handleSubmit}
                availableHouses={houses}
                isLoading={isLoading}
                onHousesUpdate={handleHousesUpdate}
            />
        </Box>
    );
};