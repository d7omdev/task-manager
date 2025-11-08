import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { usePreferences, type SortOption } from '@/contexts/PreferencesContext';
import { triggerHaptic } from '@/utils/haptics';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface SortOptionConfig {
  value: SortOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'newest', label: 'Newest First', icon: 'arrow-down' },
  { value: 'oldest', label: 'Oldest First', icon: 'arrow-up' },
  { value: 'alphabetical', label: 'Alphabetical', icon: 'text-outline' },
  { value: 'dueDate', label: 'Due Date', icon: 'calendar-outline' },
  { value: 'priority', label: 'Priority', icon: 'flag-outline' },
];

export default function SortingSelector() {
  const { sorting, setSorting } = usePreferences();
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  const handleSortPress = (value: SortOption) => {
    triggerHaptic('light');
    setSorting(value);
  };

  return (
    <View style={styles.container}>
      {SORT_OPTIONS.map((option) => {
        const isActive = sorting === option.value;

        return (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: isActive ? colors.primary + '15' : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
              },
              pressed && styles.optionPressed,
            ]}
            onPress={() => handleSortPress(option.value)}
          >
            <View style={styles.optionContent}>
              <Ionicons
                name={option.icon}
                size={20}
                color={isActive ? colors.primary : colors.text}
              />
              <ThemedText
                style={[
                  Typography.body,
                  styles.optionLabel,
                  { color: isActive ? colors.primary : colors.text },
                ]}
              >
                {option.label}
              </ThemedText>
            </View>
            {isActive && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  optionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionLabel: {
    fontWeight: '600',
  },
});
