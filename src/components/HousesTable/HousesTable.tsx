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
import { Pagination } from '../Pagination';

interface Props {
    houses: House[];
    total: number;
    page: number;
    rowsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    nameFilter: string;
    yearFilter: string;
    numberOfFlatsOnFloorFilter: string;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    onSortChange: (field: string) => void;
    onNameFilterChange: (value: string) => void;
    onYearFilterChange: (value: string) => void;
    onNumberOfFlatsOnFloorFilterChange: (value: string) => void;
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

export const HousesTable: FC<Props> = ({
    houses,
    total,
    page,
    rowsPerPage,
    sortField,
    sortDirection,
    nameFilter,
    yearFilter,
    numberOfFlatsOnFloorFilter,
    onPageChange,
    onRowsPerPageChange,
    onSortChange,
    onNameFilterChange,
    onYearFilterChange,
    onNumberOfFlatsOnFloorFilterChange,
    onEdit,
    onDelete
}) => {
    const borderColor = useColorModeValue('gray.200', 'gray.700');

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
                    value={nameFilter}
                    onChange={(e) => onNameFilterChange(e.target.value)}
                />
                <Input
                    placeholder="Поиск по году"
                    value={yearFilter}
                    onChange={(e) => onYearFilterChange(e.target.value)}
                />
                <Input
                    placeholder="Поиск по кол-ву квартир"
                    value={numberOfFlatsOnFloorFilter}
                    onChange={(e) => onNumberOfFlatsOnFloorFilterChange(e.target.value)}
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
                                    onClick={() => onSortChange(column.id)}
                                >
                                    <HStack spacing={2}>
                                        <Text>{column.label}</Text>
                                        {sortField === column.id && (
                                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                        )}
                                    </HStack>
                                </Th>
                            ))}
                            <Th>Действия</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {houses.length === 0 ? (
                            <Tr>
                                <Td colSpan={columns.length + 1} textAlign="center">
                                    Нет данных
                                </Td>
                            </Tr>
                        ) : (
                            houses.map((house) => (
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

            {/* Пагинация */}
            <Pagination
                total={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </VStack>
    );
};