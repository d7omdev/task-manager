import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ProgressCircle } from './ProgressCircle';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  gradientColors?: [string, string];
  size?: 'small' | 'medium' | 'large';
  showProgressCircle?: boolean;
  progress?: number; // 0-100, required if showProgressCircle is true
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradientColors,
  size = 'medium',
  showProgressCircle = false,
  progress = 0,
}) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  const defaultGradient: [string, string] = [colors.primary, colors.secondary];

  const gradient = gradientColors || defaultGradient;

  // Size-based flex values
  const sizeStyle = {
    small: { flex: 0.48 },
    medium: { flex: 1 },
    large: { flex: 1 },
  }[size];

  return (
    <View style={[styles.container, sizeStyle]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, Shadows.medium]}
      >
        <View style={styles.content}>
          {showProgressCircle && progress !== undefined ? (
            <View style={styles.progressContainer}>
              <ProgressCircle
                progress={progress}
                size={48}
                strokeWidth={6}
                backgroundColor="rgba(255, 255, 255, 0.2)"
                progressColor="#fff"
              />
            </View>
          ) : icon ? (
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={32} color="#fff" />
            </View>
          ) : null}
          <View style={styles.textContainer}>
            <ThemedText style={[Typography.caption, styles.title]}>
              {title}
            </ThemedText>
            <ThemedText style={[Typography.h1, styles.value]}>
              {value}
            </ThemedText>
            {subtitle && (
              <ThemedText style={[Typography.caption, styles.subtitle]}>
                {subtitle}
              </ThemedText>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 150,
  },
  gradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 120,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  textContainer: {
    gap: Spacing.xs,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  value: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
