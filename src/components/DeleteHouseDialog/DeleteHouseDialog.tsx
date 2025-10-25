import { type FC, useRef } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    Text,
} from '@chakra-ui/react';
import type { House } from '../../types/models';

interface Props {
    house: House;
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteHouseDialog: FC<Props> = ({
    house,
    isOpen,
    isLoading,
    onClose,
    onConfirm,
}) => {
    // Создаем ref для наименее деструктивной кнопки (кнопка отмены)
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={cancelRef}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Удаление дома
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Text mb={4}>
                            Вы действительно хотите удалить дом "{house.name}"?
                        </Text>
                        <Text mb={4}>
                            Год постройки: {house.year}
                        </Text>
                        <Text mb={4}>
                            Квартир на этаже: {house.numberOfFlatsOnFloor}
                        </Text>
                        <Text color="red.500" fontWeight="bold">
                            Это действие нельзя отменить. Все связанные квартиры также будут удалены.
                        </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} mr={3} isDisabled={isLoading}>
                            Отмена
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onConfirm}
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
