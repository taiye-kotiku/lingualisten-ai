export type CategoryId =
    | 'greetings'
    | 'questions'
    | 'directions'
    | 'food'
    | 'numbers'
    | 'shopping'
    | 'emergencies'
    | 'social'
    | 'family'
    | 'misc';

export interface Category {
    /** Stable slug-style identifier used in the Sheet's `category` column */
    id: CategoryId;
    /** Human-friendly label displayed in the UI */
    label: string;
}

export const CATEGORIES: Category[] = [
    { id: 'greetings', label: 'Greetings & Introductions' },
    { id: 'questions', label: 'Common Questions & Responses' },
    { id: 'directions', label: 'Directions & Transportation' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'numbers', label: 'Numbers, Time & Dates' },
    { id: 'shopping', label: 'Shopping & Money' },
    { id: 'emergencies', label: 'Emergencies & Health' },
    { id: 'social', label: 'Social / Small Talk' },
    { id: 'family', label: 'Family & People' },
    { id: 'misc', label: 'Miscellaneous' },
];

/** Convenience map for quick lookups by id (e.g., `CATEGORY_MAP[catId].label`) */
export const CATEGORY_MAP = CATEGORIES.reduce<Record<CategoryId, Category>>((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
}, {} as Record<CategoryId, Category>); 