import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAudioPlayer, AudioModule } from 'expo-audio';
import { getCachedAudioUri } from '../../utils/audioCache';
import { RootStackParamList } from '../../types/navigation';
import { getByCode } from '../../services/contentService';
import { Phrase } from '../../types/phrase';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import EmptyState from '../../components/common/EmptyState';
import { addRecentActivity } from '../../services/recentActivityService';
import { useAuth } from '../../context/AuthContext';
import { useLearnedCards } from '../../services/learnedCardService';

type ContentDisplayScreenRouteProp = RouteProp<RootStackParamList, 'ContentDisplay'>;

const ContentDisplayScreen = () => {
    const route = useRoute<ContentDisplayScreenRouteProp>();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const [phraseData, setPhraseData] = useState<Phrase | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const { user } = useAuth();
    const { learned, toggleLearned } = useLearnedCards(user?.uid);

    const player = useAudioPlayer(audioUri ? { uri: audioUri } : null);

    useEffect(() => {
        (async () => {
            const { code } = route.params;
            try {
                const data = await getByCode(code.trim());
                setPhraseData(data);

                if (data) {
                    // Cache Yoruba audio (could also decide via user language)
                    try {
                        const localUri = await getCachedAudioUri(data.audio.yoruba);
                        setAudioUri(localUri);
                    } catch (err) {
                        console.warn('Audio caching failed', err);
                        setAudioUri(data.audio.yoruba); // fallback
                    }

                    if (user?.uid) {
                        addRecentActivity(user.uid, data).catch(() => { });
                    }
                }
            } catch (err) {
                console.warn(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [route.params, user]);

    useEffect(() => {
        const setupAudioMode = async () => {
            await AudioModule.setAudioModeAsync({
                allowsRecording: false,
                playsInSilentMode: true,
                shouldPlayInBackground: true,
                interruptionModeAndroid: 'duckOthers',
                shouldRouteThroughEarpiece: false,
            });
        };

        setupAudioMode();
    }, []);

    useEffect(() => {
        const onPlaybackStatusUpdate = player.addListener('playbackStatusUpdate', (status) => {
            setIsLoaded(status.isLoaded);
            setIsPlaying(status.playing);
            setIsBuffering(status.isBuffering);

            if (status.isLoaded && status.didJustFinish) {
                player.seekTo(0);
                player.pause();
            }
        });

        return () => {
            onPlaybackStatusUpdate.remove();
        };
    }, [player]);

    useEffect(() => {
        if (player.playing) {
            player.pause();
            player.seekTo(0);
        }
    }, [phraseData, player]);


    const handlePlayPause = async () => {
        if (!isLoaded || isBuffering) return;

        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
    };

    if (isLoading || (phraseData && !audioUri)) {
        return (
            <View style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
                <ActivityIndicator size="large" color={theme.COLORS.primary} />
            </View>
        )
    }

    if (!phraseData) {
        return (
            <View style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
                <EmptyState icon="alert-circle" message={`Code "${route.params.code}" not found.`} />
            </View>
        );
    }

    const isLearned = learned?.some(l => l.id === phraseData.id);

    return (
        <View style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <View style={[styles.phraseCard, { backgroundColor: theme.COLORS.lightGray }]}>
                <TouchableOpacity style={styles.learnedIcon} onPress={() => toggleLearned(phraseData)}>
                    <Feather name={isLearned ? 'check-circle' : 'circle'} size={24} color={isLearned ? theme.COLORS.success : theme.COLORS.textSecondary} />
                </TouchableOpacity>
                <Text style={[styles.phraseText, { color: theme.COLORS.textPrimary }]}>{phraseData.yoruba}</Text>
                <Text style={[styles.translationText, { color: theme.COLORS.textSecondary }]}>{phraseData.english}</Text>
            </View>
            <View style={styles.playerCard}>
                <TouchableOpacity onPress={handlePlayPause} disabled={!isLoaded || isBuffering} style={[styles.playButton, { backgroundColor: theme.COLORS.primary }]}>
                    {(isBuffering || !isLoaded) && !isPlaying ? (
                        <ActivityIndicator size="large" color="white" />
                    ) : (
                        <Feather name={isPlaying ? "pause" : "play"} size={48} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    phraseCard: {
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 40,
    },
    phraseText: {
        fontSize: 24,
        fontFamily: 'Nunito-Bold',
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 32,
    },
    translationText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        marginTop: 10,
        lineHeight: 24,
    },
    playerCard: {
        alignItems: 'center',
    },
    playButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    learnedIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
});

export default ContentDisplayScreen;
