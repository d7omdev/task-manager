import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeSelectorProps {
  label?: string;
  description?: string;
}

export default function ThemeSelector({ label = 'Theme', description = 'Choose how the app looks' }: ThemeSelectorProps) {
  const { themeMode, setThemeMode, activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  const options: Array<{ value: ThemeMode; label: string }> = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Auto' },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.card }]}>
      <View style={styles.headerRow}>
        <ThemedText style={[Typography.bodyBold, styles.headerTitle, { color: colors.text }]}>
          {label}
        </ThemedText>
        <ThemedText style={[Typography.caption, styles.headerDescription, { color: colors.textSecondary }]}>
          {description}
        </ThemedText>
      </View>
      <View
        style={[
          styles.container,
          {
            borderColor: colors.border,
            backgroundColor: colors.cardSecondary,
          },
        ]}
      >
      {options.map((option, index) => {
        const isSelected = themeMode === option.value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <Pressable
            key={option.value}
            onPress={() => setThemeMode(option.value)}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: isSelected ? colors.primary : 'transparent',
                borderTopLeftRadius: isFirst ? BorderRadius.md : 0,
                borderBottomLeftRadius: isFirst ? BorderRadius.md : 0,
                borderTopRightRadius: isLast ? BorderRadius.md : 0,
                borderBottomRightRadius: isLast ? BorderRadius.md : 0,
                  opacity: pressed ? 0.85 : 1,
              },
                Shadows.none,
            ]}
          >
            <ThemedText
              style={[
                styles.optionText,
                {
                  color: isSelected ? '#FFFFFF' : colors.text,
                    fontWeight: isSelected ? '600' : '500',
                },
              ]}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  headerRow: {
    gap: Spacing.xs,
  },
  headerTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 13,
  },
  headerDescription: {
    fontSize: 12,
  },
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 3,
    borderWidth: 1,
    flexShrink: 1,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
  },
});
