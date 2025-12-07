import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Spinner,
    Center,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Code,
    useDisclosure,
    HStack,
    Button,
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getImportHistory } from '../services/importService';
import type { ImportHistory } from '../types/models';
import { useSnackbar } from 'notistack';

export const ImportHistoryPage = () => {
    const [history, setHistory] = useState<ImportHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedHistory, setSelectedHistory] = useState<ImportHistory | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { enqueueSnackbar } = useSnackbar();
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const pageSize = 10;

    const loadHistory = async (currentPage: number) => {
        setIsLoading(true);
        try {
            const response = await getImportHistory(currentPage, pageSize);
            setHistory(response.items);
            setTotalItems(response.total);
            setTotalPages(Math.ceil(response.total / pageSize));
        } catch (error: any) {
            console.error('Ошибка загрузки истории импорта:', error);
            enqueueSnackbar(
                error.message || 'Не удалось загрузить историю импорта',
                { variant: 'error' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadHistory(page);
    }, [page]);

    const handleViewDetails = (item: ImportHistory) => {
        setSelectedHistory(item);
        onOpen();
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const parseChangesDescription = (description: string): string => {
        try {
            const parsed = JSON.parse(description);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return description;
        }
    };

    return (
        <Box>
            <Heading mb={6}>История импорта</Heading>

            {isLoading ? (
                <Center p={8}>
                    <Spinner size="xl" />
                </Center>
            ) : (
                <Box>
                    {history.length === 0 ? (
                        <Box borderWidth={1} borderRadius="lg" borderColor={borderColor} p={6}>
                            <Center py={10}>
                                <Text color="gray.500">История импорта пуста</Text>
                            </Center>
                        </Box>
                    ) : (
                        <>
                            <Box overflowX="auto" borderWidth={1} borderRadius="lg" borderColor={borderColor}>
                                <TableContainer>
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>ID</Th>
                                                <Th>Время операции</Th>
                                                <Th isNumeric>Количество объектов</Th>
                                                <Th>Действия</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {history.map((item) => (
                                                <Tr key={item.id}>
                                                    <Td>{item.id}</Td>
                                                    <Td>
                                                        {new Date(item.operationTime).toLocaleString('ru-RU', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                        })}
                                                    </Td>
                                                    <Td isNumeric>{item.objectsCount}</Td>
                                                    <Td>
                                                        <IconButton
                                                            aria-label="Просмотр деталей"
                                                            icon={<ViewIcon />}
                                                            size="sm"
                                                            colorScheme="blue"
                                                            variant="ghost"
                                                            onClick={() => handleViewDetails(item)}
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Пагинация */}
                            <HStack justify="space-between" mt={6}>
                                <Text fontSize="sm" color="gray.500">
                                    Показано {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalItems)} из {totalItems}
                                </Text>
                                <HStack>
                                    <Button
                                        leftIcon={<ChevronLeftIcon />}
                                        onClick={handlePrevPage}
                                        isDisabled={page === 0}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        Назад
                                    </Button>
                                    <Text fontSize="sm" px={2}>
                                        {page + 1} / {totalPages || 1}
                                    </Text>
                                    <Button
                                        rightIcon={<ChevronRightIcon />}
                                        onClick={handleNextPage}
                                        isDisabled={page >= totalPages - 1}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        Вперёд
                                    </Button>
                                </HStack>
                            </HStack>
                        </>
                    )}
                </Box>
            )}

            {/* Модальное окно с деталями */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent maxW="90vw">
                    <ModalHeader>Детали импорта #{selectedHistory?.id}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedHistory && (
                            <Box>
                                <Text mb={2}>
                                    <strong>Время операции:</strong>{' '}
                                    {new Date(selectedHistory.operationTime).toLocaleString('ru-RU')}
                                </Text>
                                <Text mb={4}>
                                    <strong>Количество объектов:</strong> {selectedHistory.objectsCount}
                                </Text>
                                <Divider mb={4} />
                                <Text mb={2} fontWeight="bold">
                                    Описание изменений:
                                </Text>
                                <Code
                                    display="block"
                                    whiteSpace="pre-wrap"
                                    p={4}
                                    borderRadius="md"
                                    maxH="70vh"
                                    overflowY="auto"
                                    fontSize="sm"
                                >
                                    {selectedHistory.changesDescription
                                        ? parseChangesDescription(selectedHistory.changesDescription)
                                        : 'Нет данных'}
                                </Code>
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};
