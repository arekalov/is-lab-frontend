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
    floor: number;
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

// Типы сущностей для импорта
export const EntityType = {
    FLAT: 'FLAT',
    HOUSE: 'HOUSE',
    COORDINATES: 'COORDINATES'
} as const;

export type EntityType = typeof EntityType[keyof typeof EntityType];

// Операция импорта
export type ImportOperation = {
    type: EntityType;
    operation?: 'CREATE' | 'UPDATE' | 'DELETE';
    data: Flat | House | Coordinates | { id: number };
};

// История импорта
export type ImportHistory = {
    id: number;
    operationTime: string;
    objectsCount: number;
    changesDescription: string; // JSON string
};
