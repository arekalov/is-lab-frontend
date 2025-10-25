export type Coordinates = {
    id?: number;
    x: number;
    y: number;
};

export type House = {
    id?: number;
    name: string;
    year: number;
    numberOfFlatsOnFloor: number;
};

export const Furnish = {
    DESIGNER: 'DESIGNER',
    FINE: 'FINE',
    BAD: 'BAD',
    LITTLE: 'LITTLE'
} as const;

export type Furnish = typeof Furnish[keyof typeof Furnish];

export const View = {
    STREET: 'STREET',
    YARD: 'YARD',
    BAD: 'BAD',
    GOOD: 'GOOD',
    TERRIBLE: 'TERRIBLE'
} as const;

export type View = typeof View[keyof typeof View];

export type Flat = {
    id?: number;
    name: string;
    coordinates: Coordinates;
    creationDate?: string;
    area: number;
    price: number;
    balcony?: boolean;
    timeToMetroOnFoot: number;
    numberOfRooms: number;
    livingSpace: number;
    furnish: Furnish;
    view: View;
    house?: House;
};

export type PagedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    size: number;
};

export type ErrorResponse = {
    message: string;
};
