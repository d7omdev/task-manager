import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  Platform,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingLabelInputProps extends Omit<TextInputProps, 'placeholder' | 'value' | 'onChangeText'> {
  label: string;
  value: string;
  onValueChange: (text: string) => void;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onValueChange,
  style,
  ...textInputProps
}) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
          },
          style,
        ]}
        value={value}
        onChangeText={onValueChange}
        placeholder={label}
        placeholderTextColor={colors.textSecondary}
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    justifyContent: 'center',
    flex: 1,
  },
  input: {
    fontSize: 16,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 0,
    minHeight: 48,
    ...Platform.select({
      web: {
        outlineWidth: 0,
        borderWidth: 0,
      },
    }),
  },
});
