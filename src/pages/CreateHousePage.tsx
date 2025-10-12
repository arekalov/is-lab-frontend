import { type FC, useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { HouseForm } from '../components/HouseForm/HouseForm';
import { housesService } from '../services/housesService';

export const CreateHousePage: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            await housesService.createHouse(data);
            navigate('/houses');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Heading mb={6}>Добавление нового дома</Heading>
            <HouseForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </Box>
    );
};
