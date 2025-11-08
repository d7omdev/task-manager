import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export const TaskSkeletonItem: React.FC = () => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  const skeletonColors = {
    light: ['#e0e0e0', '#f5f5f5', '#e0e0e0'],
    dark: ['#2a2a2a', '#3a3a3a', '#2a2a2a'],
  };
  const colorMode = activeTheme ?? 'light';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card },
        Shadows.medium,
      ]}
    >
      {/* Priority indicator bar skeleton */}
      <Skeleton
        colorMode={colorMode}
        colors={skeletonColors[colorMode]}
        width={3}
        height="100%"
        radius={0}
      />

      <View style={styles.content}>
        {/* Checkbox skeleton */}
        <Skeleton
          colorMode={colorMode}
          colors={skeletonColors[colorMode]}
          width={24}
          height={24}
          radius={12}
        />

        <View style={styles.textContainer}>
          {/* Main text skeleton - two lines */}
          <Skeleton
            colorMode={colorMode}
            colors={skeletonColors[colorMode]}
            width="90%"
            height={16}
            radius={4}
          />
          <View style={styles.spacer} />
          <Skeleton
            colorMode={colorMode}
            colors={skeletonColors[colorMode]}
            width="65%"
            height={16}
            radius={4}
          />
        </View>

        {/* Delete button skeleton */}
        <Skeleton
          colorMode={colorMode}
          colors={skeletonColors[colorMode]}
          width={22}
          height={22}
          radius={11}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 70,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    paddingLeft: Spacing.md + 6, // Account for priority bar
    flex: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
    paddingLeft: Spacing.md,
    justifyContent: 'center',
  },
  spacer: {
    height: Spacing.sm,
  },
});
