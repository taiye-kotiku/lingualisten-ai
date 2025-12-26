import { CategoryId } from '../constants/categories';

/**
 * Represents the raw data structure of a row parsed directly from the
 * Google Sheet CSV. Keys match the sheet's header row.
 */
export interface SheetRow {
    id: string;
    code: string;
    phrase_yoruba: string;
    phrase_english: string;
    audio_yoruba_url: string;
    audio_english_url: string;
    category: string; // Initially a string, will be validated into CategoryId
    status: 'published' | 'draft' | string;
}

/**
 * Represents a clean, validated Phrase object used throughout the app.
 * This is the result of transforming a raw SheetRow.
 */
export interface Phrase {
    id: string;
    code: string;
    yoruba: string;
    english: string;
    audio: {
        yoruba: string;
        english: string;
    };
    category: CategoryId;
} 