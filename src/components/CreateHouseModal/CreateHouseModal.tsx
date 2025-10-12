import { type FC } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { HouseForm } from '../HouseForm/HouseForm';
import { housesService } from '../../services/housesService';
import type { House } from '../../types/models';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (house: House) => void;
}

export const CreateHouseModal: FC<Props> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const handleSubmit = async (data: any) => {
        try {
            const newHouse = await housesService.createHouse(data);
            onSuccess(newHouse);
            onClose();
        } catch (error) {
            // Ошибка будет обработана в форме
            throw error;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Создание нового дома</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <HouseForm
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
