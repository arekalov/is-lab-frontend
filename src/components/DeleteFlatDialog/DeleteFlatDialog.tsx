import { type FC } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    Text,
    VStack,
    Badge,
} from '@chakra-ui/react';
import { useRef } from 'react';
import type { Flat } from '../../types/models';

interface Props {
    flat: Flat;
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteFlatDialog: FC<Props> = ({
    flat,
    isOpen,
    isLoading,
    onClose,
    onConfirm,
}) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Удаление квартиры
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <VStack align="start" spacing={3}>
                            <Text>
                                Вы действительно хотите удалить квартиру "{flat.name}"?
                            </Text>

                            <Text fontWeight="bold">Информация о квартире:</Text>
                            <VStack align="start" spacing={1} pl={4}>
                                <Text>
                                    Площадь: <Badge>{flat.area} м²</Badge>
                                </Text>
                                <Text>
                                    Цена: <Badge>{flat.price} ₽</Badge>
                                </Text>
                                <Text>
                                    Комнат: <Badge>{flat.numberOfRooms}</Badge>
                                </Text>
                                {flat.house && (
                                    <Text>
                                        Дом: <Badge colorScheme="blue">{flat.house.name}</Badge>
                                    </Text>
                                )}
                            </VStack>

                            <Text color="red.500" fontWeight="bold">
                                Это действие нельзя отменить.
                            </Text>
                        </VStack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
                            Отмена
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onConfirm}
                            ml={3}
                            isLoading={isLoading}
                        >
                            Удалить
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
