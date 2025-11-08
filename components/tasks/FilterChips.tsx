import React from 'react';
import { StyleSheet, ScrollView, Pressable, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { triggerHaptic } from '@/utils/haptics';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskFilter } from '@/hooks/useTaskFilters';

interface FilterChip {
  id: TaskFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface FilterChipsProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
    overdue: number;
    today: number;
  };
}

const FILTERS: FilterChip[] = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'active', label: 'Active', icon: 'time-outline' },
  { id: 'completed', label: 'Completed', icon: 'checkmark-circle' },
  { id: 'overdue', label: 'Overdue', icon: 'alert-circle' },
  { id: 'today', label: 'Due Today', icon: 'today-outline' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const { width: screenWidth } = useWindowDimensions();

  const isSmallScreen = screenWidth < 375;

  const handleFilterPress = (filterId: TaskFilter) => {
    triggerHaptic('light');
    onFilterChange(filterId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          const count = counts[filter.id];

          const iconColor = isActive ? '#fff' : colors.text;
          const textColor = isActive ? '#fff' : colors.text;
          const badgeTextColor = isActive ? '#fff' : colors.primary;
          const backgroundColor = isActive ? colors.primary : colors.card;
          const borderColor = isActive ? colors.primary : colors.border;
          const badgeBackgroundColor = isActive ? 'rgba(255, 255, 255, 0.3)' : colors.primary + '20';

          return (
            <Pressable
              key={filter.id}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor,
                  borderColor,
                },
                pressed && styles.pressed,
              ]}
              onPress={() => handleFilterPress(filter.id)}
            >
              <Ionicons
                name={filter.icon}
                size={isSmallScreen ? 16 : 18}
                color={iconColor}
              />
              <ThemedText
                style={[
                  Typography.caption,
                  styles.chipLabel,
                  {
                    color: textColor,
                    fontSize: isSmallScreen ? 12 : 13,
                  },
                ]}
              >
                {filter.label}
              </ThemedText>
              <View style={[styles.badge, { backgroundColor: badgeBackgroundColor }]}>
                <ThemedText
                  style={[
                    styles.badgeText,
                    {
                      color: badgeTextColor,
                      fontSize: isSmallScreen ? 10 : 11,
                    },
                  ]}
                >
                  {count}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing.xs,
  },
  pressed: {
    opacity: 0.8,
  },
  chipLabel: {
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '700',
  },
});
