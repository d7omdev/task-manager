import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No tasks yet. Add one to get started!'
}) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + '10' },
          ]}
        >
          <Ionicons
            name="checkmark-done-circle"
            size={72}
            color={colors.primary}
          />
        </View>

        <ThemedText style={[Typography.h3, styles.title, { color: colors.text }]}>
          All Clear!
        </ThemedText>

        <ThemedText style={[Typography.body, styles.message, { color: colors.textSecondary }]}>
          {message}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
