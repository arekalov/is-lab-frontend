import { type FC } from 'react';
import {
    Flex,
    HStack,
    Text,
    Select,
    Button,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    rowsPerPageOptions?: number[];
}

export const Pagination: FC<PaginationProps> = ({
    total,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50],
}) => {
    const pageCount = Math.ceil(total / rowsPerPage);

    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        onRowsPerPageChange(newRowsPerPage);
        // Всегда сбрасываем на первую страницу при изменении количества строк
        onPageChange(0);
    };

    return (
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack>
                <Text fontSize="sm">Строк на странице:</Text>
                <Select
                    value={rowsPerPage}
                    onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                    w="80px"
                    size="sm"
                >
                    {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </HStack>

            <Text fontSize="sm">
                {total === 0
                    ? 'Нет записей'
                    : `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, total)} из ${total}`}
            </Text>

            <HStack>
                <Button
                    size="sm"
                    leftIcon={<ChevronLeftIcon />}
                    onClick={() => onPageChange(page - 1)}
                    isDisabled={page === 0}
                >
                    Назад
                </Button>
                <Text fontSize="sm">
                    Страница {pageCount === 0 ? 0 : page + 1} из {pageCount}
                </Text>
                <Button
                    size="sm"
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => onPageChange(page + 1)}
                    isDisabled={page >= pageCount - 1}
                >
                    Вперед
                </Button>
            </HStack>
        </Flex>
    );
};

