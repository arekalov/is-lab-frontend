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
    Select,
    VStack,
    Grid,
    GridItem,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import type { Flat } from '../../types/models';
import { furnishLabels, viewLabels } from '../../utils/enumLabels';

interface Props {
    flats: Flat[];
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    onEdit: (flat: Flat) => void;
    onDelete: (flat: Flat) => void;
}

interface Column {
    id: keyof Flat | 'actions';
    label: string;
    minWidth?: number;
    sortable?: boolean;
    format?: (value: any) => string;
    filterable?: boolean;
    filterType?: 'text' | 'number' | 'select';
    filterOptions?: { value: string; label: string }[];
}

const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50, sortable: true, filterable: true, filterType: 'number' },
    { id: 'name', label: 'Название', minWidth: 100, sortable: true, filterable: true, filterType: 'text' },
    { 
        id: 'coordinates', 
        label: 'Координаты', 
        minWidth: 100,
        format: (value) => value ? `(${value.x}, ${value.y})` : '-'
    },
    { 
        id: 'creationDate', 
        label: 'Дата создания', 
        minWidth: 100,
        format: (value) => value ? new Date(value).toLocaleString() : '-',
        sortable: true
    },
    { 
        id: 'area', 
        label: 'Площадь', 
        minWidth: 100, 
        sortable: true, 
        filterable: true, 
        filterType: 'number'
    },
    { 
        id: 'price', 
        label: 'Цена', 
        minWidth: 100, 
        sortable: true, 
        filterable: true, 
        filterType: 'number'
    },
    { 
        id: 'balcony', 
        label: 'Балкон', 
        minWidth: 100,
        format: (value) => value ? 'Да' : 'Нет',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
            { value: 'true', label: 'Да' },
            { value: 'false', label: 'Нет' }
        ]
    },
    { 
        id: 'timeToMetroOnFoot', 
        label: 'До метро (мин)', 
        minWidth: 100,
        sortable: true,
        filterable: true,
        filterType: 'number'
    },
    { 
        id: 'numberOfRooms', 
        label: 'Комнат', 
        minWidth: 100,
        sortable: true,
        filterable: true,
        filterType: 'number'
    },
    { 
        id: 'livingSpace', 
        label: 'Жилая площадь', 
        minWidth: 100,
        sortable: true,
        filterable: true,
        filterType: 'number'
    },
    { 
        id: 'furnish', 
        label: 'Мебель', 
        minWidth: 100,
        format: (value) => furnishLabels[value] || value,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: Object.entries(furnishLabels).map(([value, label]) => ({ value, label }))
    },
    { 
        id: 'view', 
        label: 'Вид', 
        minWidth: 100,
        format: (value) => viewLabels[value] || value,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: Object.entries(viewLabels).map(([value, label]) => ({ value, label }))
    },
    { 
        id: 'house', 
        label: 'Дом', 
        minWidth: 100,
        format: (value) => value ? value.name : '-',
        sortable: true,
        filterable: true,
        filterType: 'text'
    },
    { id: 'actions', label: 'Действия', minWidth: 100 },
];

interface SortConfig {
    field: keyof Flat;
    direction: 'asc' | 'desc';
}

type Filters = {
    [K in keyof Flat]?: string;
};

export const FlatsTable: FC<Props> = ({
    flats,
    total,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onDelete
}) => {
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'id', direction: 'asc' });
    const [filters, setFilters] = useState<Filters>({});

    const handleSort = (columnId: string) => {
        if (columnId === 'actions' || !columnId) return;
        setSortConfig(current => ({
            field: columnId as keyof Flat,
            direction: current.field === columnId && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (columnId: keyof Flat, value: string) => {
        setFilters(prev => ({
            ...prev,
            [columnId]: value
        }));
    };

    const filteredAndSortedFlats = useMemo(() => {
        return [...flats]
            .filter(flat => {
                return Object.entries(filters).every(([key, filterValue]) => {
                    if (!filterValue) return true;
                    
                    const value = flat[key as keyof Flat];
                    if (value === null || value === undefined) return false;

                    if (key === 'house') {
                        return flat.house?.name.toLowerCase().includes(filterValue.toLowerCase());
                    }

                    if (key === 'balcony') {
                        return value === (filterValue === 'true');
                    }

                    if (typeof value === 'number') {
                        return value.toString().includes(filterValue);
                    }

                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(filterValue.toLowerCase());
                    }

                    return true;
                });
            })
            .sort((a, b) => {
                const aValue = a[sortConfig.field];
                const bValue = b[sortConfig.field];
                
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc' 
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                
                return 0;
            });
    }, [flats, sortConfig, filters]);

    if (!Array.isArray(flats)) {
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
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                {columns.map((column) => {
                    if (!column.filterable) return null;

                    const filterValue = filters[column.id as keyof Flat] || '';

                    if (column.filterType === 'select' && column.filterOptions) {
                        return (
                            <GridItem key={column.id}>
                                <Select
                                    placeholder={`Фильтр: ${column.label}`}
                                    value={filterValue}
                                    onChange={(e) => handleFilterChange(column.id as keyof Flat, e.target.value)}
                                >
                                    {column.filterOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                        );
                    }

                    return (
                        <GridItem key={column.id}>
                            <Input
                                placeholder={`Фильтр: ${column.label}`}
                                value={filterValue}
                                onChange={(e) => handleFilterChange(column.id as keyof Flat, e.target.value)}
                                type={column.filterType === 'number' ? 'number' : 'text'}
                            />
                        </GridItem>
                    );
                })}
            </Grid>

            {/* Таблица */}
            <Box overflowX="auto" borderWidth={1} borderRadius="lg" borderColor={borderColor}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            {columns.map((column) => (
                                <Th
                                    key={column.id}
                                    minW={column.minWidth}
                                    cursor={column.sortable ? 'pointer' : 'default'}
                                    onClick={() => column.sortable && handleSort(column.id)}
                                >
                                    <HStack spacing={2}>
                                        <Text>{column.label}</Text>
                                        {column.sortable && sortConfig.field === column.id && (
                                            sortConfig.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                        )}
                                    </HStack>
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredAndSortedFlats.length === 0 ? (
                            <Tr>
                                <Td colSpan={columns.length} textAlign="center">
                                    Нет данных
                                </Td>
                            </Tr>
                        ) : (
                            filteredAndSortedFlats
                                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                .map((flat) => (
                                    <Tr key={flat.id}>
                                        {columns.map((column) => {
                                            if (column.id === 'actions') {
                                                return (
                                                    <Td key={column.id}>
                                                        <ButtonGroup size="sm" variant="ghost">
                                                            <Tooltip label="Редактировать">
                                                                <IconButton
                                                                    aria-label="Редактировать"
                                                                    icon={<EditIcon />}
                                                                    onClick={() => onEdit(flat)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip label="Удалить">
                                                                <IconButton
                                                                    aria-label="Удалить"
                                                                    icon={<DeleteIcon />}
                                                                    onClick={() => onDelete(flat)}
                                                                />
                                                            </Tooltip>
                                                        </ButtonGroup>
                                                    </Td>
                                                );
                                            }
                                            const value = flat[column.id as keyof Flat];
                                            return (
                                                <Td key={column.id}>
                                                    {column.format ? column.format(value) : String(value ?? '-')}
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                ))
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Пагинация */}
            <HStack justify="flex-end" spacing={4}>
                <Text>Строк на странице:</Text>
                <Select
                    value={rowsPerPage}
                    onChange={(e) => {
                        onRowsPerPageChange(Number(e.target.value));
                        onPageChange(0);
                    }}
                    w="auto"
                >
                    {[5, 10, 25].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </Select>
                <Text>
                    {total > 0 ? 
                        `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, total)} из ${total}` :
                        'Нет данных'
                    }
                </Text>
                <ButtonGroup size="sm">
                    <IconButton
                        aria-label="Предыдущая страница"
                        icon={<ChevronUpIcon />}
                        onClick={() => onPageChange(page - 1)}
                        isDisabled={page === 0}
                    />
                    <IconButton
                        aria-label="Следующая страница"
                        icon={<ChevronDownIcon />}
                        onClick={() => onPageChange(page + 1)}
                        isDisabled={(page + 1) * rowsPerPage >= total}
                    />
                </ButtonGroup>
            </HStack>
        </VStack>
    );
};