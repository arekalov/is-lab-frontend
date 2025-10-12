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

export const HousesTable: FC<Props> = ({
    houses,
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
        <Box overflowX="auto" borderWidth={1} borderRadius="lg" borderColor={borderColor}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        {columns.map((column) => (
                            <Th key={column.id} minW={column.minWidth}>
                                <Text>{column.label}</Text>
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
    );
};
