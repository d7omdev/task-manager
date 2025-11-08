import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

const hexWithAlpha = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface SettingSectionProps {
  title: string;
  children?: React.ReactNode;
}

export default function SettingSection({ title, children }: SettingSectionProps) {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const hasContent = React.Children.count(children) > 0;

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title.toUpperCase()}
      </ThemedText>
      {hasContent && (
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: hexWithAlpha(colors.border, activeTheme === 'dark' ? 0.6 : 0.35),
              shadowColor: activeTheme === 'dark' ? '#000000' : '#0F121C',
            },
          ]}
        >
      {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  sectionCard: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.xs,
    ...Shadows.small,
  },
});
