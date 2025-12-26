import { db } from './firebase';
import { Phrase } from '../types/phrase';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    getDocs,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface RecentActivityItem {
    id: string;
    code: string;
    phrase: string;
    translation: string;
    timestamp: number;
}

const MAX_ITEMS = 20;

export const addRecentActivity = async (uid: string, phrase: Phrase) => {
    const colRef = collection(db, 'users', uid, 'recentActivity');
    const docRef = doc(colRef, phrase.id);
    await setDoc(docRef, {
        id: phrase.id,
        code: phrase.code,
        phrase: phrase.yoruba,
        translation: phrase.english,
        timestamp: Date.now(),
    });
};

export const removeRecentActivity = async (uid: string, id: string) => {
    await deleteDoc(doc(db, 'users', uid, 'recentActivity', id));
};

export const listenRecentActivity = (
    uid: string,
    callback: (items: RecentActivityItem[]) => void
) => {
    const q = query(
        collection(db, 'users', uid, 'recentActivity'),
        orderBy('timestamp', 'desc'),
        limit(MAX_ITEMS)
    );
    return onSnapshot(q, (snap) => {
        const items: RecentActivityItem[] = [];
        snap.forEach((doc) => items.push(doc.data() as RecentActivityItem));
        callback(items);
    });
};

export const fetchRecentActivityOnce = async (uid: string) => {
    const q = query(
        collection(db, 'users', uid, 'recentActivity'),
        orderBy('timestamp', 'desc'),
        limit(MAX_ITEMS)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as RecentActivityItem);
};

export function useRecentActivity(uid?: string) {
    const [activities, setActivities] = useState<RecentActivityItem[] | null>(null);

    useEffect(() => {
        if (!uid) {
            setActivities(null);
            return;
        }
        const unsubscribe = listenRecentActivity(uid, setActivities);
        return () => unsubscribe();
    }, [uid]);

    const removeItem = async (id: string) => {
        if (!uid) return;
        await removeRecentActivity(uid, id);
    };

    return { activities, removeItem };
} 