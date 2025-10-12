import { type FC } from 'react';
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
    Select,
    Text,
    ButtonGroup,
    useColorModeValue,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import type { Flat } from '../../types/models';

interface Props {
    flats: Flat[];
    total: number;
    page: number;
    rowsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    nameFilter: string;
    furnishFilter: string;
    viewFilter: string;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    onSortChange: (field: string) => void;
    onNameFilterChange: (value: string) => void;
    onFurnishFilterChange: (value: string) => void;
    onViewFilterChange: (value: string) => void;
    onEdit: (flat: Flat) => void;
    onDelete: (flat: Flat) => void;
}

interface Column {
    id: keyof Flat | 'actions';
    label: string;
    minWidth?: number;
    sortable?: boolean;
    format?: (value: any) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50, sortable: true },
    { id: 'name', label: 'Название', minWidth: 100, sortable: true },
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
        format: (value) => value ? new Date(value).toLocaleString() : '-'
    },
    { id: 'area', label: 'Площадь', minWidth: 100, sortable: true },
    { id: 'price', label: 'Цена', minWidth: 100, sortable: true },
    { 
        id: 'balcony', 
        label: 'Балкон', 
        minWidth: 100,
        format: (value) => value ? 'Да' : 'Нет'
    },
    { id: 'timeToMetroOnFoot', label: 'До метро (мин)', minWidth: 100 },
    { id: 'numberOfRooms', label: 'Комнат', minWidth: 100 },
    { id: 'livingSpace', label: 'Жилая площадь', minWidth: 100 },
    { id: 'furnish', label: 'Мебель', minWidth: 100 },
    { id: 'view', label: 'Вид', minWidth: 100 },
    { 
        id: 'house', 
        label: 'Дом', 
        minWidth: 100,
        format: (value) => value ? value.name : '-'
    },
    { id: 'actions', label: 'Действия', minWidth: 100 },
];

export const FlatsTable: FC<Props> = ({
    flats,
    total,
    page,
    rowsPerPage,
    sortField,
    sortDirection,
    nameFilter,
    furnishFilter,
    viewFilter,
    onPageChange,
    onRowsPerPageChange,
    onSortChange,
    onNameFilterChange,
    onFurnishFilterChange,
    onViewFilterChange,
    onEdit,
    onDelete
}) => {
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleSort = (columnId: string) => {
        if (columnId === 'actions') return;
        onSortChange(columnId);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        onPageChange(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        onRowsPerPageChange(parseInt(event.target.value, 10));
        onPageChange(0);
    };

    if (!Array.isArray(flats)) {
        console.error('Flats is not an array:', flats);
        return (
            <Alert status="error">
                <AlertIcon />
                Ошибка загрузки данных
            </Alert>
        );
    }

    return (
        <Box>
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
                                        {column.sortable && sortField === column.id && (
                                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                        )}
                                    </HStack>
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {flats.length === 0 ? (
                            <Tr>
                                <Td colSpan={columns.length} textAlign="center">
                                    Нет данных
                                </Td>
                            </Tr>
                        ) : (
                            flats.map((flat) => (
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
            <HStack mt={4} justify="flex-end" spacing={4}>
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
        </Box>
    );
};