export interface RecentActivity {
    id: string;
    phrase: string;
    translation: string;
    timestamp: string;
}

export const DUMMY_RECENT_ACTIVITY: RecentActivity[] = [
    {
        id: '1',
        phrase: 'Báwo ni?',
        translation: 'How are you?',
        timestamp: '5m ago',
    },
    {
        id: '2',
        phrase: 'Emi kò yé mi.',
        translation: 'I do not understand.',
        timestamp: '1h ago',
    },
    {
        id: '3',
        phrase: 'Níbo ni balúwé wà?',
        translation: 'Where is the bathroom?',
        timestamp: 'Yesterday',
    },
    {
        id: '4',
        phrase: 'Elo ni?',
        translation: 'How much does it cost?',
        timestamp: '2 days ago',
    },
    {
        id: '5',
        phrase: 'Ṣé o móọ̀ sọ Gẹ̀ẹ́sì?',
        translation: 'Do you speak English?',
        timestamp: '2 days ago',
    },
    {
        id: '6',
        phrase: 'Fún mi ní àkọsílẹ̀ owó.',
        translation: 'Give me the bill, please.',
        timestamp: '3 days ago',
    },
    {
        id: '7',
        phrase: 'Mo fẹ́...',
        translation: 'I would like...',
        timestamp: '4 days ago',
    },
    {
        id: '8',
        phrase: 'Ó dábọ̀',
        translation: 'Goodbye',
        timestamp: '5 days ago',
    },
];

export interface PhraseData {
    code: string;
    phrase: string;
    translation: string;
    audioUrl: string;
}

export const DUMMY_PHRASES: { [key: string]: PhraseData } = {
    'A1B2-C3D4': {
        code: 'A1B2-C3D4',
        phrase: 'Ẹ kú àárọ̀, báwo ni?',
        translation: 'Good morning, how are you?',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3', // Placeholder audio
    },
    'D5E6-F7G8': {
        code: 'D5E6-F7G8',
        phrase: 'Ẹ ṣé púpọ̀',
        translation: 'Thank you very much',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3', // Placeholder audio
    },
    'H9I0-J1K2': {
        code: 'H9I0-J1K2',
        phrase: 'Má bínú',
        translation: 'Excuse me',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3', // Placeholder audio
    },
    'L3M4-N5O6': {
        code: 'L3M4-N5O6',
        phrase: 'Níbo ni ibùdó ọkọ̀ ojú irin wà?',
        translation: 'Where is the train station?',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3', // Placeholder audio
    },
    'P7Q8-R9S0': {
        code: 'P7Q8-R9S0',
        phrase: 'Emi kò móọ̀ sọ Yorùbá dáadáa',
        translation: 'I do not speak Yoruba well',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3', // Placeholder audio
    },
    'T1U2-V3W4': {
        code: 'T1U2-V3W4',
        phrase: 'Elo ni èyí?',
        translation: 'How much does this cost?',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3', // Placeholder audio
    },
    'X5Y6-Z7A8': {
        code: 'X5Y6-Z7A8',
        phrase: 'Fún mi ní àkọsílẹ̀ owó, jọ̀wọ́',
        translation: 'Give me the bill, please',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3', // Placeholder audio
    },
    'B9C0-D1E2': {
        code: 'B9C0-D1E2',
        phrase: 'Ṣé o lè ràn mí lọ́wọ́?',
        translation: 'Can you help me?',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/8.mp3', // Placeholder audio
    },
    'F3G4-H5I6': {
        code: 'F3G4-H5I6',
        phrase: 'Mo fẹ́ kí...',
        translation: 'I would like to...',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/9.mp3', // Placeholder audio
    },
    'J7K8-L9M0': {
        code: 'J7K8-L9M0',
        phrase: 'Ó dábọ̀, má a rí e l\'àìpẹ́',
        translation: 'Goodbye, see you soon',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/10.mp3', // Placeholder audio
    },
}; 