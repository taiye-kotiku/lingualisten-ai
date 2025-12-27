import { supabase } from './supabase.service';
import { useEffect, useState } from 'react';
import { Phrase } from '../types/phrase';

export interface LearnedCard {
  id: string;
  code: string;
  timestamp: number;
}

export const addLearnedCard = async (uid: string, phrase: Phrase) => {
  try {
    const { error } = await supabase
      .from('learned_cards')
      .insert({
        user_id: uid,
        phrase_id: phrase.id,
        phrase_code: phrase.code,
        timestamp: Date.now(),
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Add learned card error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Add learned card error:', error);
    throw error;
  }
};

export const removeLearnedCard = async (uid: string, id: string) => {
  try {
    const { error } = await supabase
      .from('learned_cards')
      .delete()
      .eq('user_id', uid)
      .eq('phrase_id', id);

    if (error) {
      console.error('Remove learned card error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Remove learned card error:', error);
    throw error;
  }
};

export const listenLearnedCards = (
  uid: string,
  callback: (items: LearnedCard[]) => void,
) => {
  try {
    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`learned_cards_${uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'learned_cards',
          filter: `user_id=eq.${uid}`,
        },
        (payload) => {
          // Fetch updated list whenever there's a change
          fetchLearnedCardsOnce(uid)
            .then((cards) => callback(cards))
            .catch((error) => console.error('Listen error:', error));
        }
      )
      .subscribe();

    // Initial fetch
    fetchLearnedCardsOnce(uid)
      .then((cards) => callback(cards))
      .catch((error) => console.error('Initial fetch error:', error));

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error('Listen learned cards error:', error);
    return () => {};
  }
};

export const fetchLearnedCardsOnce = async (uid: string) => {
  try {
    const { data, error } = await supabase
      .from('learned_cards')
      .select('phrase_id, phrase_code, timestamp')
      .eq('user_id', uid)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Fetch learned cards error:', error);
      return [];
    }

    return (data || []).map((card: any) => ({
      id: card.phrase_id,
      code: card.phrase_code,
      timestamp: card.timestamp,
    } as LearnedCard));
  } catch (error) {
    console.error('Fetch learned cards error:', error);
    return [];
  }
};

export function useLearnedCards(uid?: string) {
  const [learned, setLearned] = useState<LearnedCard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setLearned(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsub = listenLearnedCards(uid, (cards) => {
      setLearned(cards);
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [uid]);

  const toggleLearned = async (phrase: Phrase) => {
    if (!uid) return;

    try {
      setError(null);
      const exists = learned?.some((l) => l.id === phrase.id);

      if (exists) {
        await removeLearnedCard(uid, phrase.id);
      } else {
        await addLearnedCard(uid, phrase);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to toggle learned card';
      setError(errorMsg);
      console.error('Toggle learned error:', err);
    }
  };

  return { learned, toggleLearned, loading, error };
}