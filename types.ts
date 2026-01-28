export interface Milestone {
    id?: number;
    date?: string;
    chapter?: string;
    title: string;
    description: string;
    imgs: string[]; // Support multiple images
    category?: 'physical' | 'skill' | 'first' | 'other';
    reverse?: boolean;
    delay?: string;
    mt?: string; // margin-top for horizontal view
}

export interface GrowthRecord {
    id?: number;
    date: string;
    height?: number; // cm
    weight?: number; // kg
    sleepHours?: number; // hours
    toothCount?: number;
    note?: string;
}
