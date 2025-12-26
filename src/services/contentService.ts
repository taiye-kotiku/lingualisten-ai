import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { Phrase, SheetRow } from '../types/phrase';
import { CategoryId, CATEGORY_MAP } from '../constants/categories';
import NetInfo from '@react-native-community/netinfo';

/**
 * Key used for storing cached content in AsyncStorage
 */
const CACHE_KEY = '@contentCache';

/**
 * Public URL to the published Google Sheet CSV. Must be provided via .env
 */
const CSV_URL = process.env.EXPO_PUBLIC_GOOGLE_SHEETS_URL as string;

let inMemoryCache: Phrase[] | null = null;

/**
 * Convert a raw SheetRow object into a validated Phrase object.
 * Returns null if the row is invalid or not published.
 */
function transformRow(row: SheetRow): Phrase | null {
    // Skip rows that are explicitly marked as 'draft' or 'disabled'
    if (!row || (row.status && row.status.trim().toLowerCase() === 'draft')) return null;

    // Ensure category is a known slug; fallback to 'misc'
    const category = (row.category?.trim().toLowerCase() || 'misc') as CategoryId;
    const validCategory: CategoryId = CATEGORY_MAP[category] ? category : 'misc';

    return {
        id: row.id.trim(),
        code: row.code.trim(),
        yoruba: row.phrase_yoruba.trim(),
        english: row.phrase_english.trim(),
        audio: {
            yoruba: row.audio_yoruba_url.trim(),
            english: row.audio_english_url.trim(),
        },
        category: validCategory,
    };
}

/** Fetch the CSV file, parse it, and cache the result */
export async function refresh(): Promise<Phrase[]> {
    // If device is offline, fall back to cached data immediately
    const netState = await NetInfo.fetch();
    if (!(netState.isConnected && netState.isInternetReachable)) {
        if (inMemoryCache) return inMemoryCache;
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
            return JSON.parse(cached) as Phrase[];
        }
        throw new Error('No internet connection and no cached content available');
    }
    if (!CSV_URL) {
        throw new Error('Missing EXPO_PUBLIC_GOOGLE_SHEETS_URL env variable');
    }

    const res = await fetch(CSV_URL);
    if (!res.ok) {
        throw new Error(`Failed to fetch content: ${res.status} ${res.statusText}`);
    }

    const csvText = await res.text();

    const { data } = Papa.parse<SheetRow>(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    const phrases: Phrase[] = (data as SheetRow[])
        .map(transformRow)
        .filter(Boolean) as Phrase[];

    // Cache in memory and AsyncStorage
    inMemoryCache = phrases;
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(phrases));

    return phrases;
}

/** Load phrases from cache, falling back to network */
export async function getAll(): Promise<Phrase[]> {
    if (inMemoryCache) return inMemoryCache;

    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
        try {
            inMemoryCache = JSON.parse(cached) as Phrase[];
            // Fire-and-forget refresh in background
            refresh().catch(() => {/* ignore errors silently */ });
            return inMemoryCache;
        } catch (_) {
            // corrupted cache; clear and refetch
            await AsyncStorage.removeItem(CACHE_KEY);
        }
    }

    // No cache; fetch fresh
    return refresh();
}

/** Find a phrase by its flashcard code */
export async function getByCode(code: string): Promise<Phrase | null> {
    const phrases = await getAll();
    return (
        phrases.find((p) => p.code.toLowerCase() === code.toLowerCase()) || null
    );
}

/** Simple React hook for components */
export function useContent() {
    const [phrases, setPhrases] = useState<Phrase[] | null>(inMemoryCache);
    const [loading, setLoading] = useState<boolean>(!inMemoryCache);
    const [error, setError] = useState<Error | null>(null);

    const forceRefresh = async () => {
        try {
            const data = await refresh();
            setPhrases(data);
            return data;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const data = await getAll();
                if (isMounted) setPhrases(data);
            } catch (err) {
                if (isMounted) setError(err as Error);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    return { phrases, loading, error, refresh: forceRefresh };
} 