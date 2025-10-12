import { type FC, useEffect } from 'react';
import {
    VStack,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Switch,
    Button,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { Furnish, View, type Flat, type House } from '../../types/models';
import { furnishLabels, viewLabels } from '../../utils/enumLabels';

interface FlatFormData {
    name: string;
    coordinates: {
        x: number;
        y: number;
    };
    area: number;
    price: number;
    balcony: boolean;
    timeToMetroOnFoot: number;
    numberOfRooms: number;
    livingSpace: number;
    furnish: Furnish;
    view: View;
    houseId?: number;
}

interface Props {
    onSubmit: (data: FlatFormData) => Promise<void>;
    availableHouses: House[];
    initialData?: Partial<Flat>;
    isLoading?: boolean;
}

export const FlatForm: FC<Props> = ({
    onSubmit,
    availableHouses = [], // Добавляем значение по умолчанию
    initialData,
    isLoading = false,
}) => {
    const toast = useToast();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FlatFormData>({
        defaultValues: {
            name: '',
            coordinates: { x: 0, y: 0 },
            area: 0,
            price: 0,
            balcony: false,
            timeToMetroOnFoot: 0,
            numberOfRooms: 1,
            livingSpace: 0,
            furnish: Furnish.FINE,
            view: View.YARD,
            houseId: undefined,
        },
    });

    // Устанавливаем начальные данные при их наличии
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                coordinates: initialData.coordinates || { x: 0, y: 0 },
                area: initialData.area || 0,
                price: initialData.price || 0,
                balcony: initialData.balcony || false,
                timeToMetroOnFoot: initialData.timeToMetroOnFoot || 0,
                numberOfRooms: initialData.numberOfRooms || 1,
                livingSpace: initialData.livingSpace || 0,
                furnish: initialData.furnish || Furnish.FINE,
                view: initialData.view || View.YARD,
                houseId: initialData.house?.id,
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = async (data: FlatFormData) => {
        try {
            await onSubmit(data);
            toast({
                title: 'Успешно',
                description: initialData ? 'Квартира обновлена' : 'Квартира создана',
                status: 'success',
            });
            if (!initialData) {
                reset(); // Очищаем форму только при создании
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

                <SimpleGrid columns={2} spacing={4}>
                    <FormControl isInvalid={!!errors.coordinates?.x}>
                        <FormLabel>Координата X</FormLabel>
                        <Controller
                            name="coordinates.x"
                            control={control}
                            rules={{ required: 'Обязательное поле' }}
                            render={({ field }) => (
                                <NumberInput {...field}>
                                    <NumberInputField />
                                </NumberInput>
                            )}
                        />
                        <FormErrorMessage>{errors.coordinates?.x?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.coordinates?.y}>
                        <FormLabel>Координата Y</FormLabel>
                        <Controller
                            name="coordinates.y"
                            control={control}
                            rules={{ required: 'Обязательное поле' }}
                            render={({ field }) => (
                                <NumberInput {...field}>
                                    <NumberInputField />
                                </NumberInput>
                            )}
                        />
                        <FormErrorMessage>{errors.coordinates?.y?.message}</FormErrorMessage>
                    </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={2} spacing={4}>
                    <FormControl isInvalid={!!errors.area}>
                        <FormLabel>Площадь</FormLabel>
                        <Controller
                            name="area"
                            control={control}
                            rules={{ 
                                required: 'Обязательное поле',
                                min: { value: 1, message: 'Должно быть больше 0' }
                            }}
                            render={({ field }) => (
                                <NumberInput {...field} min={1}>
                                    <NumberInputField />
                                </NumberInput>
                            )}
                        />
                        <FormErrorMessage>{errors.area?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.price}>
                        <FormLabel>Цена</FormLabel>
                        <Controller
                            name="price"
                            control={control}
                            rules={{ 
                                required: 'Обязательное поле',
                                min: { value: 1, message: 'Должно быть больше 0' },
                                max: { value: 581208244, message: 'Максимальная цена: 581208244' }
                            }}
                            render={({ field }) => (
                                <NumberInput {...field} min={1} max={581208244}>
                                    <NumberInputField />
                                </NumberInput>
                            )}
                        />
                        <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                    </FormControl>
                </SimpleGrid>

                <FormControl>
                    <FormLabel>Балкон</FormLabel>
                    <Controller
                        name="balcony"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Switch isChecked={value} onChange={onChange} />
                        )}
                    />
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                    <FormControl isInvalid={!!errors.timeToMetroOnFoot}>
                        <FormLabel>Время до метро (мин)</FormLabel>
                        <Controller
                            name="timeToMetroOnFoot"
                            control={control}
                            rules={{ 
                                required: 'Обязательное поле',
                                min: { value: 1, message: 'Должно быть больше 0' }
                            }}
                            render={({ field }) => (
                                <NumberInput {...field} min={1}>
                                    <NumberInputField />
                                </NumberInput>
                            )}
                        />
                        <FormErrorMessage>{errors.timeToMetroOnFoot?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.numberOfRooms}>
                        <FormLabel>Количество комнат</FormLabel>
                        <Controller
                            name="numberOfRooms"
                            control={control}
                            rules={{ 
                                required: 'Обязательное поле',
                                min: { value: 1, message: 'Минимум 1 комната' },
                                max: { value: 13, message: 'Максимум 13 комнат' }
                            }}
                            render={({ field }) => (
                                <NumberInput {...field} min={1} max={13}>
                                    <NumberInputField />
                                </NumberInput>
                            )}
                        />
                        <FormErrorMessage>{errors.numberOfRooms?.message}</FormErrorMessage>
                    </FormControl>
                </SimpleGrid>

                <FormControl isInvalid={!!errors.livingSpace}>
                    <FormLabel>Жилая площадь</FormLabel>
                    <Controller
                        name="livingSpace"
                        control={control}
                        rules={{ 
                            required: 'Обязательное поле',
                            min: { value: 1, message: 'Должно быть больше 0' }
                        }}
                        render={({ field }) => (
                            <NumberInput {...field} min={1}>
                                <NumberInputField />
                            </NumberInput>
                        )}
                    />
                    <FormErrorMessage>{errors.livingSpace?.message}</FormErrorMessage>
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                    <FormControl isInvalid={!!errors.furnish}>
                        <FormLabel>Мебель</FormLabel>
                        <Controller
                            name="furnish"
                            control={control}
                            rules={{ required: 'Обязательное поле' }}
                            render={({ field }) => (
                                <Select {...field}>
                                    {Object.values(Furnish).map((value) => (
                                        <option key={value} value={value}>
                                            {furnishLabels[value]}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        <FormErrorMessage>{errors.furnish?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.view}>
                        <FormLabel>Вид из окна</FormLabel>
                        <Controller
                            name="view"
                            control={control}
                            rules={{ required: 'Обязательное поле' }}
                            render={({ field }) => (
                                <Select {...field}>
                                    {Object.values(View).map((value) => (
                                        <option key={value} value={value}>
                                            {viewLabels[value]}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        <FormErrorMessage>{errors.view?.message}</FormErrorMessage>
                    </FormControl>
                </SimpleGrid>

                <FormControl>
                    <FormLabel>Дом</FormLabel>
                    <Controller
                        name="houseId"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} placeholder="Выберите дом">
                                {Array.isArray(availableHouses) && availableHouses.map((house) => (
                                    <option key={house.id} value={house.id}>
                                        {house.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    mt={4}
                >
                    {initialData ? 'Сохранить' : 'Создать'}
                </Button>
            </VStack>
        </form>
    );
};