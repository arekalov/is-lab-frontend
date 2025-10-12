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
    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={undefined}
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
                        <Button onClick={onClose} mr={3} isDisabled={isLoading}>
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
