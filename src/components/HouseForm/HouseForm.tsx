import { type FC } from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Button,
    FormErrorMessage,
    useToast,
    ButtonGroup,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import type { House } from '../../types/models';

interface HouseFormData {
    name: string;
    year?: number | string;
    numberOfFlatsOnFloor: number;
}

interface Props {
    onSubmit: (data: HouseFormData) => Promise<void>;
    initialData?: House;
    isLoading?: boolean;
    onCancel?: () => void;
}

export const HouseForm: FC<Props> = ({
    onSubmit,
    initialData,
    isLoading = false,
    onCancel,
}) => {
    const toast = useToast();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<HouseFormData>({
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            year: initialData?.year ? String(initialData.year) : '',
            numberOfFlatsOnFloor: initialData?.numberOfFlatsOnFloor || 1,
        },
    });

    const handleFormSubmit = async (data: HouseFormData) => {
        try {
            await onSubmit(data);
            if (!initialData) {
                // Показываем уведомление только при создании
                toast({
                    title: 'Успешно',
                    description: 'Дом создан',
                    status: 'success',
                });
                reset();
            }
        } catch (error) {
            toast({
                title: 'Ошибка',
                description: error instanceof Error ? error.message : 'Произошла ошибка',
                status: 'error',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Название</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Обязательное поле' }}
                        render={({ field }) => (
                            <Input {...field} placeholder="Введите название" />
                        )}
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.year}>
                    <FormLabel>Год постройки</FormLabel>
                    <Controller
                        name="year"
                        control={control}
                        rules={{ 
                            required: 'Обязательное поле',
                            validate: {
                                isNumber: (v) => !isNaN(Number(v)) || 'Должно быть числом',
                                min: (v) => {
                                    const num = Number(v);
                                    return num >= 1000 || 'Минимальный год: 1000';
                                },
                                max: (v) => {
                                    const num = Number(v);
                                    return num <= new Date().getFullYear() || `Год не может быть больше ${new Date().getFullYear()}`;
                                }
                            }
                        }}
                        render={({ field }) => (
                            <Input 
                                {...field}
                                type="number"
                                placeholder="Введите год постройки"
                            />
                        )}
                    />
                    <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.numberOfFlatsOnFloor}>
                    <FormLabel>Количество квартир на этаже</FormLabel>
                    <Controller
                        name="numberOfFlatsOnFloor"
                        control={control}
                        rules={{ 
                            required: 'Обязательное поле',
                            min: { value: 1, message: 'Минимум 1 квартира' },
                            max: { value: 20, message: 'Максимум 20 квартир' }
                        }}
                        render={({ field }) => (
                            <NumberInput {...field} min={1} max={20}>
                                <NumberInputField />
                            </NumberInput>
                        )}
                    />
                    <FormErrorMessage>{errors.numberOfFlatsOnFloor?.message}</FormErrorMessage>
                </FormControl>

                <ButtonGroup spacing={3} mt={4}>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={isLoading}
                    >
                        {initialData ? 'Сохранить' : 'Создать'}
                    </Button>
                    {onCancel && (
                        <Button onClick={onCancel} isDisabled={isLoading}>
                            Отмена
                        </Button>
                    )}
                </ButtonGroup>
            </VStack>
        </form>
    );
};