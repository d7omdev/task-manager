import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Typography } from "@/constants/theme";
import { DateTimeSelector, PrioritySelector } from "@/components/ui";
import { taskTextEditorStyles } from "./styles";

const hexWithAlpha = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface TaskEditorOptionsProps {
  visible: boolean;
  colors: {
    background: string;
    border: string;
    text: string;
    textSecondary: string;
    card: string;
    cardSecondary: string;
  };
  dueDate?: Date;
  dueTime?: string;
  onDueDateChange?: (date: Date) => void;
  onDueTimeChange?: (time: string) => void;
  onClearDueDate?: () => void;
  priority: "low" | "medium" | "high";
  onPriorityChange?: (priority: "low" | "medium" | "high") => void;
}

export const TaskEditorOptions: React.FC<TaskEditorOptionsProps> = ({
  visible,
  colors,
  dueDate,
  dueTime,
  onDueDateChange,
  onDueTimeChange,
  onClearDueDate,
  priority,
  onPriorityChange,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        taskTextEditorStyles.optionsCard,
        {
          backgroundColor: colors.card,
          borderColor: hexWithAlpha(colors.border, 0.45),
        },
      ]}
    >
      <View style={taskTextEditorStyles.optionsHeaderText}>
        <View style={taskTextEditorStyles.optionTitleRow}>
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.textSecondary}
            style={taskTextEditorStyles.optionHeaderIcon}
          />
          <ThemedText
            style={[
              Typography.bodyBold,
              { color: colors.text },
            ]}
          >
            Task Options
          </ThemedText>
        </View>
        <ThemedText
          style={[
            Typography.label,
            taskTextEditorStyles.optionsSubtitle,
            { color: colors.textSecondary },
          ]}
        >
          Schedule reminders and fine-tune priority
        </ThemedText>
      </View>

      <View
        style={[
          taskTextEditorStyles.optionsBody,
          {
            borderTopColor: hexWithAlpha(colors.border, 0.35),
            backgroundColor: colors.background,
          },
        ]}
      >
        {onDueDateChange && (
          <>
            <View style={taskTextEditorStyles.optionRow}>
              <View style={taskTextEditorStyles.optionHeader}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <ThemedText
                  style={[
                    Typography.caption,
                    { color: colors.textSecondary, fontWeight: "600" },
                  ]}
                >
                  Due Date
                </ThemedText>
              </View>
              {dueDate && onClearDueDate && (
                <Pressable onPress={onClearDueDate} hitSlop={8}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
              )}
            </View>
            <DateTimeSelector
              date={dueDate}
              timeValue={dueTime}
              onDateChange={onDueDateChange}
              onTimeChange={onDueTimeChange}
              onClear={onClearDueDate}
              mode="both"
            />
          </>
        )}

        {onPriorityChange && (
          <View style={taskTextEditorStyles.prioritySection}>
            <PrioritySelector
              selectedPriority={priority}
              onPriorityChange={onPriorityChange}
            />
          </View>
        )}
      </View>
    </View>
  );
};

