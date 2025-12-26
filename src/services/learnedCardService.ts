import { db } from './firebase';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    getDocs,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Phrase } from '../types/phrase';

export interface LearnedCard {
    id: string;
    code: string;
    timestamp: number;
}

export const addLearnedCard = async (uid: string, phrase: Phrase) => {
    const colRef = collection(db, 'users', uid, 'learnedCards');
    await setDoc(doc(colRef, phrase.id), {
        id: phrase.id,
        code: phrase.code,
        timestamp: Date.now(),
    });
};

export const removeLearnedCard = async (uid: string, id: string) => {
    await deleteDoc(doc(db, 'users', uid, 'learnedCards', id));
};

export const listenLearnedCards = (
    uid: string,
    callback: (items: LearnedCard[]) => void,
) => {
    const colRef = collection(db, 'users', uid, 'learnedCards');
    return onSnapshot(colRef, (snap) => {
        const items: LearnedCard[] = [];
        snap.forEach((d) => items.push(d.data() as LearnedCard));
        callback(items);
    });
};

export const fetchLearnedCardsOnce = async (uid: string) => {
    const colRef = collection(db, 'users', uid, 'learnedCards');
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as LearnedCard);
};

export function useLearnedCards(uid?: string) {
    const [learned, setLearned] = useState<LearnedCard[] | null>(null);

    useEffect(() => {
        if (!uid) {
            setLearned(null);
            return;
        }
        const unsub = listenLearnedCards(uid, setLearned);
        return () => unsub();
    }, [uid]);

    const toggleLearned = async (phrase: Phrase) => {
        if (!uid) return;
        const exists = learned?.some((l) => l.id === phrase.id);
        if (exists) {
            await removeLearnedCard(uid, phrase.id);
        } else {
            await addLearnedCard(uid, phrase);
        }
    };

    return { learned, toggleLearned };
} 