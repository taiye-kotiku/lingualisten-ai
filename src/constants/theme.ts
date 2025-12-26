const LIGHT_COLORS = {
    primary: '#F97316',     // Orange
    secondary: '#4B5563',   // Dark Gray
    accent: '#78B24233',     // Green (20% opacity - will handle opacity in components)

    success: '#78B242',     // Green
    error: '#EF4444',       // Red

    textPrimary: '#1F2937',  // Almost Black
    textSecondary: '#6B7280',// Medium Gray

    background: '#FFFFFF',   // White
    lightGray: '#F3F4F6',    // Light Gray
    border: '#E5E7EB',       // Lighter Gray for borders
};

const DARK_COLORS = {
    primary: '#F97316',     // Orange (same)
    secondary: '#9CA3AF',   // Lighter Gray
    accent: '#78B24233',     // Green (20% opacity - same)

    success: '#78B242',     // Green (same)
    error: '#EF4444',       // Red (same)

    textPrimary: '#F9FAFB',  // Almost White
    textSecondary: '#D1D5DB',// Light Gray

    background: '#111827',   // Dark Background
    lightGray: '#1F2937',    // Dark Gray
    border: '#374151',       // Medium Dark Gray for borders
};

const SIZES = {
    // Base sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 20,

    // Font sizes
    h1: 30,
    h2: 22,
    h3: 18,
    h4: 16,
    body1: 16,
    body2: 14,
    body3: 13,
    body4: 12,
};

const FONTS = {
    h1: { fontFamily: 'Nunito-Bold', fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: 'Nunito-SemiBold', fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: 'Nunito-SemiBold', fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: 'Inter-Medium', fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: 'Inter-Medium', fontSize: SIZES.body1, lineHeight: 22 },
    body2: { fontFamily: 'Inter-Regular', fontSize: SIZES.body2, lineHeight: 20 },
    body3: { fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: 18 },
    body4: { fontFamily: 'Inter-Regular', fontSize: SIZES.body4, lineHeight: 16 },
};

export const getTheme = (isDark: boolean = false) => ({
    COLORS: isDark ? DARK_COLORS : LIGHT_COLORS,
    SIZES,
    FONTS,
});

// Default export for backward compatibility
export const theme = getTheme(false);
