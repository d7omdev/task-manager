import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

const hexWithAlpha = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface SettingRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  danger?: boolean;
}

export default function SettingRow({
  icon,
  label,
  value,
  onPress,
  rightElement,
  showChevron = false,
  danger = false,
}: SettingRowProps) {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  const dangerColor = '#FF3B30';
  const iconColor = danger ? dangerColor : colors.primary;
  const labelColor = danger ? dangerColor : colors.text;
  const backgroundColor = danger ? colors.background : colors.card;
  const borderColor = danger ? hexWithAlpha(dangerColor, 0.4) : hexWithAlpha(colors.border, 0.6);

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <View style={styles.leftContent}>
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <ThemedText style={[Typography.body, styles.label, { color: labelColor }]}>
          {label}
        </ThemedText>
      </View>

      <View style={styles.rightContent}>
        {value && (
          <ThemedText
            style={[Typography.body, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {value}
          </ThemedText>
        )}
        {rightElement}
        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
            style={styles.chevron}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressableContainer,
          pressed && { opacity: 0.6 },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  pressableContainer: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    ...Shadows.none,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  label: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginLeft: Spacing.sm,
    flexShrink: 1,
  },
  chevron: {
    marginLeft: Spacing.xs,
  },
});
