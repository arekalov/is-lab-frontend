import { useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Text,
    Textarea,
    VStack,
    useToast,
    HStack,
    Divider,
    Code,
    useColorModeValue,
    UnorderedList,
    ListItem,
} from '@chakra-ui/react';
import { importObjects } from '../services/importService';
import type { ImportOperation } from '../types/models';

export const ImportPage = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastResult, setLastResult] = useState<any>(null);
    const toast = useToast();
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const exampleJson = `[
  {
    "type": "FLAT",
    "operation": "CREATE",
    "data": {
      "name": "Квартира 101",
      "floor": 1,
      "area": 50,
      "price": 5000000,
      "balcony": true,
      "timeToMetroOnFoot": 10,
      "numberOfRooms": 2,
      "livingSpace": 35,
      "furnish": "DESIGNER",
      "view": "YARD",
      "coordinates": {
        "x": 100.5,
        "y": 200
      },
      "house": {
        "name": "Дом на Невском",
        "year": 2020,
        "numberOfFlatsOnFloor": 4
      }
    }
  }
]`;

    const handleImport = async () => {
        if (!jsonInput.trim()) {
            toast({
                title: 'Ошибка',
                description: 'Введите JSON для импорта',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);
        setLastResult(null);

        try {
            // Парсим JSON
            const operations: ImportOperation[] = JSON.parse(jsonInput);

            // Отправляем запрос
            const result = await importObjects(operations);

            setLastResult(result);
            toast({
                title: 'Успешно!',
                description: `Импортировано объектов: ${result.objectsCount}`,
                status: 'success',
                duration: 5000,
            });

            // Очищаем поле ввода после успешного импорта
            setJsonInput('');
        } catch (error: any) {
            console.error('Ошибка импорта:', error);
            
            let errorMessage = 'Произошла ошибка при импорте';
            if (error instanceof SyntaxError) {
                errorMessage = 'Неверный формат JSON: ' + error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: 'Ошибка импорта',
                description: errorMessage,
                status: 'error',
                duration: 7000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const loadExample = () => {
        setJsonInput(exampleJson);
    };

    return (
        <Box>
            <Heading mb={6}>Импорт объектов</Heading>

            <VStack spacing={6} align="stretch">
                {/* Инструкция */}
                <Box borderWidth={1} borderRadius="lg" borderColor={borderColor} p={6}>
                    <Heading size="md" mb={4}>Инструкция по импорту</Heading>
                    <VStack align="stretch" spacing={3}>
                        <Text>
                            Импорт позволяет создавать, обновлять или удалять объекты в одной транзакции. 
                            Если хотя бы одна операция завершится с ошибкой, все изменения будут отменены.
                        </Text>
                        
                        <Divider />
                        
                        <Text fontWeight="bold">Формат JSON:</Text>
                        <Code p={3} borderRadius="md" whiteSpace="pre" overflowX="auto" display="block">
{`[
  {
    "type": "FLAT" | "HOUSE" | "COORDINATES",
    "operation": "CREATE" | "UPDATE" | "DELETE",
    "data": { ... }
  }
]`}
                        </Code>
                        
                        <Text fontWeight="bold">Типы сущностей:</Text>
                        <UnorderedList pl={4}>
                            <ListItem><strong>FLAT</strong> - квартира</ListItem>
                            <ListItem><strong>HOUSE</strong> - дом</ListItem>
                            <ListItem><strong>COORDINATES</strong> - координаты</ListItem>
                        </UnorderedList>
                        
                        <Text fontWeight="bold">Операции:</Text>
                        <UnorderedList pl={4}>
                            <ListItem><strong>CREATE</strong> - создание объекта (без id)</ListItem>
                            <ListItem><strong>UPDATE</strong> - обновление объекта (с id)</ListItem>
                            <ListItem><strong>DELETE</strong> - удаление объекта (только id)</ListItem>
                        </UnorderedList>
                        
                        <Text fontSize="sm" color="gray.500">
                            Поле operation опционально. Если не указано, определяется автоматически по наличию id.
                            Поддерживается вложенное создание объектов.
                        </Text>
                    </VStack>
                </Box>

                {/* Форма импорта */}
                <Box borderWidth={1} borderRadius="lg" borderColor={borderColor} p={6}>
                    <HStack justify="space-between" mb={4}>
                        <Heading size="md">JSON для импорта</Heading>
                        <Button 
                            size="sm" 
                            colorScheme="blue" 
                            variant="outline" 
                            onClick={loadExample}
                        >
                            Загрузить пример
                        </Button>
                    </HStack>
                    <VStack spacing={4}>
                        <Textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder="Вставьте JSON для импорта..."
                            minH="400px"
                            maxH="600px"
                            fontFamily="monospace"
                            fontSize="sm"
                            resize="vertical"
                        />
                        <Button
                            colorScheme="blue"
                            onClick={handleImport}
                            isLoading={isLoading}
                            loadingText="Импорт..."
                            width="full"
                            size="lg"
                        >
                            Выполнить импорт
                        </Button>
                    </VStack>
                </Box>

                {/* Результат последнего импорта */}
                {lastResult && (
                    <Box borderWidth={1} borderRadius="lg" borderColor={borderColor} p={6}>
                        <Heading size="md" mb={4}>Результат импорта</Heading>
                        <VStack align="stretch" spacing={3}>
                            <Text>
                                <strong>ID операции:</strong> {lastResult.id}
                            </Text>
                            <Text>
                                <strong>Импортировано объектов:</strong> {lastResult.objectsCount}
                            </Text>
                            <Text>
                                <strong>Время:</strong> {new Date(lastResult.operationTime).toLocaleString('ru-RU')}
                            </Text>
                            {lastResult.changesDescription && (
                                <>
                                    <Divider />
                                    <Text fontWeight="bold">Изменения:</Text>
                                    <Code 
                                        display="block" 
                                        p={3} 
                                        borderRadius="md" 
                                        whiteSpace="pre-wrap" 
                                        maxH="300px" 
                                        overflowY="auto"
                                        fontSize="sm"
                                    >
                                        {lastResult.changesDescription}
                                    </Code>
                                </>
                            )}
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};
