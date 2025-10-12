import { Furnish, View } from '../types/models';

export const furnishLabels: Record<Furnish, string> = {
    [Furnish.DESIGNER]: 'Дизайнерская',
    [Furnish.FINE]: 'Хорошая',
    [Furnish.BAD]: 'Плохая',
    [Furnish.LITTLE]: 'Минимальная',
};

export const viewLabels: Record<View, string> = {
    [View.STREET]: 'На улицу',
    [View.YARD]: 'Во двор',
    [View.BAD]: 'Плохой',
    [View.GOOD]: 'Хороший',
    [View.TERRIBLE]: 'Ужасный',
};
