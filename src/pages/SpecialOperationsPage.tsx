import { type FC, useState } from 'react';
import {
    Box,
    Heading,
    VStack,
    Card,
    CardHeader,
    CardBody,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
} from '@chakra-ui/react';
import { flatsService } from '../services/flatsService';
import type { Flat } from '../types/models';

export const SpecialOperationsPage: FC = () => {
    const toast = useToast();
    
    // Состояния для поиска
    const [minRooms, setMinRooms] = useState('');
    const [nameSubstring, setNameSubstring] = useState('');
    const [maxLivingSpace, setMaxLivingSpace] = useState('');
    
    // Состояния для результатов
    const [roomsCount, setRoomsCount] = useState<number | null>(null);
    const [flatsWithName, setFlatsWithName] = useState<Flat[] | null>(null);
    const [flatsWithSpace, setFlatsWithSpace] = useState<Flat[] | null>(null);
    const [cheapestWithBalcony, setCheapestWithBalcony] = useState<Flat | null>(null);
    const [sortedByMetro, setSortedByMetro] = useState<Flat[] | null>(null);
    
    // Состояния загрузки
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const handleOperation = async (operation: string, action: () => Promise<void>) => {
        try {
            setLoading(prev => ({ ...prev, [operation]: true }));
            await action();
        } catch (error) {
            toast({
                title: 'Ошибка',
                description: error instanceof Error ? error.message : 'Произошла ошибка',
                status: 'error',
            });
        } finally {
            setLoading(prev => ({ ...prev, [operation]: false }));
        }
    };

    // Обработчики для каждой операции
    const handleCountRooms = () => {
        handleOperation('rooms', async () => {
            const count = await flatsService.countByRoomsGreaterThan(Number(minRooms));
            setRoomsCount(count);
        });
    };

    const handleSearchByName = () => {
        handleOperation('name', async () => {
            const flats = await flatsService.findByNameContaining(nameSubstring);
            setFlatsWithName(flats);
        });
    };

    const handleSearchBySpace = () => {
        handleOperation('space', async () => {
            const flats = await flatsService.findByLivingSpaceLessThan(Number(maxLivingSpace));
            setFlatsWithSpace(flats);
        });
    };

    const handleFindCheapest = () => {
        handleOperation('cheapest', async () => {
            const flat = await flatsService.findCheapestWithBalcony();
            setCheapestWithBalcony(flat);
        });
    };

    const handleSortByMetro = () => {
        handleOperation('metro', async () => {
            const flats = await flatsService.findAllSortedByMetroTime();
            setSortedByMetro(flats);
        });
    };

    const renderFlatsList = (flats: Flat[] | null) => {
        if (!flats) return null;
        if (flats.length === 0) {
            return (
                <Alert status="info">
                    <AlertIcon />
                    Квартиры не найдены
                </Alert>
            );
        }
        return (
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th>Название</Th>
                        <Th>Площадь</Th>
                        <Th>Цена</Th>
                        <Th>Комнат</Th>
                        <Th>До метро</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {flats.map(flat => (
                        <Tr key={flat.id}>
                            <Td>{flat.name}</Td>
                            <Td>{flat.area} м²</Td>
                            <Td>{flat.price} ₽</Td>
                            <Td>{flat.numberOfRooms}</Td>
                            <Td>{flat.timeToMetroOnFoot} мин</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    };

    return (
        <Box>
            <Heading mb={6}>Специальные операции</Heading>
            <VStack spacing={4} align="stretch">
                {/* Количество квартир с комнатами больше заданного */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Поиск по количеству комнат</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel>Минимальное количество комнат</FormLabel>
                                <NumberInput min={0} value={minRooms} onChange={(_, value) => setMinRooms(value.toString())}>
                                    <NumberInputField />
                                </NumberInput>
                            </FormControl>
                            <Button 
                                onClick={handleCountRooms}
                                isLoading={loading.rooms}
                            >
                                Найти
                            </Button>
                            {roomsCount !== null && (
                                <Text>Найдено квартир: {roomsCount}</Text>
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Поиск по подстроке в названии */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Поиск по названию</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel>Подстрока для поиска</FormLabel>
                                <Input 
                                    value={nameSubstring}
                                    onChange={(e) => setNameSubstring(e.target.value)}
                                    placeholder="Введите часть названия"
                                />
                            </FormControl>
                            <Button 
                                onClick={handleSearchByName}
                                isLoading={loading.name}
                            >
                                Найти
                            </Button>
                            {renderFlatsList(flatsWithName)}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Поиск по жилой площади */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Поиск по жилой площади</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel>Максимальная жилая площадь</FormLabel>
                                <NumberInput min={0} value={maxLivingSpace} onChange={(_, value) => setMaxLivingSpace(value.toString())}>
                                    <NumberInputField />
                                </NumberInput>
                            </FormControl>
                            <Button 
                                onClick={handleSearchBySpace}
                                isLoading={loading.space}
                            >
                                Найти
                            </Button>
                            {renderFlatsList(flatsWithSpace)}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Самая дешевая квартира с балконом */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Самая дешевая квартира с балконом</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Button 
                                onClick={handleFindCheapest}
                                isLoading={loading.cheapest}
                            >
                                Найти
                            </Button>
                            {cheapestWithBalcony && renderFlatsList([cheapestWithBalcony])}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Сортировка по времени до метро */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Квартиры по времени до метро</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Button 
                                onClick={handleSortByMetro}
                                isLoading={loading.metro}
                            >
                                Показать
                            </Button>
                            {renderFlatsList(sortedByMetro)}
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
};