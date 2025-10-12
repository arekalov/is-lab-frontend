import { type FC } from 'react';
import {
    HStack,
    Input,
    Select,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { Furnish, View } from '../../types/models';

interface Props {
    nameFilter: string;
    onNameFilterChange: (value: string) => void;
    furnishFilter: string;
    onFurnishFilterChange: (value: string) => void;
    viewFilter: string;
    onViewFilterChange: (value: string) => void;
}

export const TableFilters: FC<Props> = ({
    nameFilter,
    onNameFilterChange,
    furnishFilter,
    onFurnishFilterChange,
    viewFilter,
    onViewFilterChange,
}) => {
    return (
        <HStack spacing={4} mb={4} wrap="wrap">
            <FormControl maxW="300px">
                <FormLabel>Поиск по названию</FormLabel>
                <Input
                    placeholder="Введите название..."
                    value={nameFilter}
                    onChange={(e) => onNameFilterChange(e.target.value)}
                />
            </FormControl>

            <FormControl maxW="200px">
                <FormLabel>Мебель</FormLabel>
                <Select
                    value={furnishFilter}
                    onChange={(e) => onFurnishFilterChange(e.target.value)}
                >
                    <option value="">Все</option>
                    {Object.values(Furnish).map((furnish) => (
                        <option key={furnish} value={furnish}>
                            {furnishLabels[furnish]}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl maxW="200px">
                <FormLabel>Вид из окна</FormLabel>
                <Select
                    value={viewFilter}
                    onChange={(e) => onViewFilterChange(e.target.value)}
                >
                    <option value="">Все</option>
                    {Object.values(View).map((view) => (
                        <option key={view} value={view}>
                            {viewLabels[view]}
                        </option>
                    ))}
                </Select>
            </FormControl>
        </HStack>
    );
};

// Метки для значений перечислений
const furnishLabels: Record<Furnish, string> = {
    [Furnish.DESIGNER]: 'Дизайнерская',
    [Furnish.FINE]: 'Хорошая',
    [Furnish.BAD]: 'Плохая',
    [Furnish.LITTLE]: 'Минимальная',
};

const viewLabels: Record<View, string> = {
    [View.STREET]: 'На улицу',
    [View.YARD]: 'Во двор',
    [View.BAD]: 'Плохой',
    [View.GOOD]: 'Хороший',
    [View.TERRIBLE]: 'Ужасный',
};
