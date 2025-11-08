import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const hexWithAlpha = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface DateTimeSelectorProps {
  date?: Date;
  timeValue?: string;
  onDateChange?: (date: Date) => void;
  onTimeChange?: (time: string) => void; // HH:MM format
  onClear?: () => void;
  mode?: 'date' | 'time' | 'both';
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  date,
  timeValue,
  onDateChange,
  onTimeChange,
  onClear,
  mode = 'both',
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width: screenWidth } = useWindowDimensions();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(date || new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(date || new Date());

  const isSmallScreen = screenWidth < 375;
  const isCompact = screenWidth < 360;

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  useEffect(() => {
    if (timeValue && date) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      if (!Number.isNaN(hours)) {
        const next = new Date(date);
        next.setHours(hours, Number.isNaN(minutes) ? 0 : minutes!, 0, 0);
        setSelectedTime(next);
      }
    } else if (date) {
      setSelectedTime(date);
    }
  }, [timeValue, date]);

  const hasDate = Boolean(date);
  const hasTime = Boolean(timeValue);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate && event.type !== 'dismissed') {
      setSelectedDate(selectedDate);
      onDateChange?.(selectedDate);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate && event.type !== 'dismissed') {
      setSelectedTime(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const formatted = `${hours}:${minutes}`;
      setSelectedTime(selectedDate);
      onTimeChange?.(formatted);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClear?.();
  };

  const handleDatePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDatePicker(true);
  };

  const handleTimePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTimePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const closeTimePicker = () => {
    setShowTimePicker(false);
  };

  const showDate = mode === 'date' || mode === 'both';
  const showTime = mode === 'time' || mode === 'both';

  const timeDisplay = useMemo(() => {
    if (timeValue && date) {
      return formatTime(selectedTime);
    }
    if (hasDate && !timeValue) {
      return 'Set Time';
    }
    return 'Set Time';
  }, [timeValue, date, selectedTime, hasDate]);

  return (
    <View style={styles.container}>
      <View style={[styles.buttonsRow, (isSmallScreen || isCompact) && styles.buttonsRowCompact]}>
        {showDate && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: hasDate ? colors.primary : colors.card,
                borderColor: hasDate
                  ? hexWithAlpha(colors.primary, 0.5)
                  : hexWithAlpha(colors.border, colorScheme === 'dark' ? 0.5 : 0.35),
                shadowColor: hasDate ? colors.primary : 'rgba(15, 18, 28, 0.12)',
              },
              Shadows.small,
              pressed && styles.pressed,
            ]}
            onPress={handleDatePress}
          >
            <View style={[styles.buttonInner, isCompact && styles.buttonInnerCompact]}>
              <View
                style={[
                  styles.buttonIcon,
                  {
                    backgroundColor: hasDate ? hexWithAlpha('#FFFFFF', 0.25) : colors.cardSecondary,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={hasDate ? '#FFFFFF' : colors.primary}
                />
              </View>
              <ThemedText
                style={[
                  Typography.body,
                  styles.buttonLabel,
                  {
                    color: hasDate ? '#FFFFFF' : colors.text,
                    fontSize: isSmallScreen ? 14 : 15,
                  },
                ]}
              >
                {hasDate ? formatDate(selectedDate) : 'Set Date'}
            </ThemedText>
            </View>
          </Pressable>
        )}

        {showTime && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: hasTime ? colors.secondary : colors.card,
                borderColor: hasTime
                  ? hexWithAlpha(colors.secondary ?? colors.primary, 0.4)
                  : hexWithAlpha(colors.border, colorScheme === 'dark' ? 0.5 : 0.35),
                shadowColor: hasTime ? colors.secondary ?? colors.primary : 'rgba(15, 18, 28, 0.12)',
              },
              Shadows.small,
              pressed && styles.pressed,
            ]}
            onPress={handleTimePress}
          >
            <View style={[styles.buttonInner, isCompact && styles.buttonInnerCompact]}>
              <View
                style={[
                  styles.buttonIcon,
                  {
                    backgroundColor: hasTime ? hexWithAlpha('#FFFFFF', 0.25) : colors.cardSecondary,
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={hasTime ? '#FFFFFF' : colors.primary}
                />
              </View>
              <ThemedText
                style={[
                  Typography.body,
                  styles.buttonLabel,
                  {
                    color: hasTime ? '#FFFFFF' : colors.text,
                    fontSize: isSmallScreen ? 14 : 15,
                  },
                ]}
              >
                {hasTime ? timeDisplay : 'Set Time'}
            </ThemedText>
            </View>
          </Pressable>
        )}

        {date && onClear && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              {
                borderColor: hexWithAlpha(colors.border, colorScheme === 'dark' ? 0.6 : 0.4),
                backgroundColor: colors.card,
              },
              pressed && styles.pressed,
            ]}
            onPress={handleClear}
          >
            <Ionicons name="close" size={16} color={colors.textSecondary} />
            <ThemedText
              style={[
                Typography.caption,
                { color: colors.textSecondary, fontWeight: '600' },
              ]}
            >
              Clear
            </ThemedText>
          </Pressable>
        )}
      </View>

      {/* Date Picker Modal */}
      {showDate && Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={closeDatePicker}
        >
          <Pressable style={styles.modalOverlay} onPress={closeDatePicker}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={[Typography.h3, { color: colors.text }]}>
                  Select Date
                </ThemedText>
                <Pressable onPress={closeDatePicker}>
                  <ThemedText style={[Typography.body, { color: colors.primary }]}>
                    Done
                  </ThemedText>
                </Pressable>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                textColor={colors.text}
              />
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Time Picker Modal */}
      {showTime && Platform.OS === 'ios' && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={closeTimePicker}
        >
          <Pressable style={styles.modalOverlay} onPress={closeTimePicker}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={[Typography.h3, { color: colors.text }]}>
                  Select Time
                </ThemedText>
                <Pressable onPress={closeTimePicker}>
                  <ThemedText style={[Typography.body, { color: colors.primary }]}>
                    Done
                  </ThemedText>
                </Pressable>
              </View>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                textColor={colors.text}
              />
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Android pickers (inline) */}
      {showDate && showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTime && showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  buttonsRowCompact: {
    flexWrap: 'wrap',
    rowGap: Spacing.xs,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    flex: 1,
    borderWidth: 1,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
    justifyContent: 'flex-start',
  },
  buttonInnerCompact: {
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
});
