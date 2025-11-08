import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export type Priority = 'low' | 'medium' | 'high';

interface PriorityOption {
  value: Priority;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'low', label: 'Low', icon: 'flag-outline', color: '#34C759' },
  { value: 'medium', label: 'Medium', icon: 'flag', color: '#FF9500' },
  { value: 'high', label: 'High', icon: 'flag', color: '#FF3B30' },
];

interface PrioritySelectorProps {
  selectedPriority?: Priority;
  onPriorityChange: (priority: Priority) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selectedPriority = 'medium',
  onPriorityChange,
}) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  return (
    <View style={styles.container}>
      <ThemedText style={[Typography.caption, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>
        Priority
      </ThemedText>
      <View style={styles.optionsContainer}>
        {PRIORITY_OPTIONS.map((option) => {
          const isSelected = selectedPriority === option.value;
          const backgroundColor = isSelected ? option.color + '20' : colors.card;
          const borderColor = isSelected ? option.color : colors.border;
          const iconColor = isSelected ? option.color : colors.textSecondary;
          const textColor = isSelected ? colors.text : colors.textSecondary;

          return (
            <Pressable
              key={option.value}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor,
                  borderColor,
                },
                pressed && styles.pressed,
              ]}
              onPress={() => onPriorityChange(option.value)}
            >
              <Ionicons name={option.icon} size={20} color={iconColor} />
              <ThemedText style={[Typography.body, { color: textColor, fontSize: 14 }]}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.7,
  },
});

