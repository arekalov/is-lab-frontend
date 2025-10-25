import { type FC, useState, useMemo } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Box,
    Tooltip,
    HStack,
    Text,
    ButtonGroup,
    useColorModeValue,
    Alert,
    AlertIcon,
    Input,
    VStack,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import type { House } from '../../types/models';

interface Props {
    houses: House[];
    onEdit: (house: House) => void;
    onDelete: (house: House) => void;
}

interface Column {
    id: keyof House;
    label: string;
    minWidth?: number;
    format?: (value: any) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Название', minWidth: 100 },
    { id: 'year', label: 'Год постройки', minWidth: 100 },
    { id: 'numberOfFlatsOnFloor', label: 'Квартир на этаже', minWidth: 100 },
];

interface SortConfig {
    field: keyof House;
    direction: 'asc' | 'desc';
}

interface Filters {
    name: string;
    year: string;
    numberOfFlatsOnFloor: string;
}

export const HousesTable: FC<Props> = ({
    houses,
    onEdit,
    onDelete
}) => {
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'id', direction: 'asc' });
    const [filters, setFilters] = useState<Filters>({
        name: '',
        year: '',
        numberOfFlatsOnFloor: '',
    });

    const handleSort = (field: keyof House) => {
        setSortConfig(current => ({
            field,
            direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedHouses = useMemo(() => {
        return [...houses]
            .filter(house => {
                const nameMatch = house.name.toLowerCase().includes(filters.name.toLowerCase());
                const yearMatch = !filters.year || house.year.toString().includes(filters.year);
                const flatsMatch = !filters.numberOfFlatsOnFloor || 
                    house.numberOfFlatsOnFloor.toString().includes(filters.numberOfFlatsOnFloor);
                return nameMatch && yearMatch && flatsMatch;
            })
            .sort((a, b) => {
                const aValue = a[sortConfig.field];
                const bValue = b[sortConfig.field];
                
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc' 
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                
                // Приводим значения к числам для сравнения
                const numA = Number(aValue);
                const numB = Number(bValue);
                
                return sortConfig.direction === 'asc'
                    ? (numA > numB ? 1 : numA < numB ? -1 : 0)
                    : (numB > numA ? 1 : numB < numA ? -1 : 0);
            });
    }, [houses, sortConfig, filters]);

    if (!Array.isArray(houses)) {
        console.error('Houses is not an array:', houses);
        return (
            <Alert status="error">
                <AlertIcon />
                Ошибка загрузки данных
            </Alert>
        );
    }

    return (
        <VStack spacing={4} align="stretch">
            {/* Фильтры */}
            <HStack spacing={4}>
                <Input
                    placeholder="Поиск по названию"
                    value={filters.name}
                    onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                    placeholder="Поиск по году"
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                />
                <Input
                    placeholder="Поиск по кол-ву квартир"
                    value={filters.numberOfFlatsOnFloor}
                    onChange={(e) => setFilters(prev => ({ ...prev, numberOfFlatsOnFloor: e.target.value }))}
                />
            </HStack>

            {/* Таблица */}
            <Box overflowX="auto" borderWidth={1} borderRadius="lg" borderColor={borderColor}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            {columns.map((column) => (
                                <Th
                                    key={column.id}
                                    minW={column.minWidth}
                                    cursor="pointer"
                                    onClick={() => handleSort(column.id)}
                                >
                                    <HStack spacing={2}>
                                        <Text>{column.label}</Text>
                                        {sortConfig.field === column.id && (
                                            sortConfig.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                        )}
                                    </HStack>
                                </Th>
                            ))}
                            <Th>Действия</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredAndSortedHouses.length === 0 ? (
                            <Tr>
                                <Td colSpan={columns.length + 1} textAlign="center">
                                    Нет данных
                                </Td>
                            </Tr>
                        ) : (
                            filteredAndSortedHouses.map((house) => (
                                <Tr key={house.id}>
                                    {columns.map((column) => (
                                        <Td key={column.id}>
                                            {column.format ? column.format(house[column.id]) : String(house[column.id] ?? '-')}
                                        </Td>
                                    ))}
                                    <Td>
                                        <ButtonGroup size="sm" variant="ghost">
                                            <Tooltip label="Редактировать">
                                                <IconButton
                                                    aria-label="Редактировать"
                                                    icon={<EditIcon />}
                                                    onClick={() => onEdit(house)}
                                                />
                                            </Tooltip>
                                            <Tooltip label="Удалить">
                                                <IconButton
                                                    aria-label="Удалить"
                                                    icon={<DeleteIcon />}
                                                    onClick={() => onDelete(house)}
                                                />
                                            </Tooltip>
                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>
            </Box>
        </VStack>
    );
};