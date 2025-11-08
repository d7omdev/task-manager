import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Typography, Spacing } from "@/constants/theme";
import { taskTextEditorStyles } from "./styles";

interface TaskEditorHeaderProps {
  title: string;
  colors: {
    text: string;
    border: string;
    primary: string;
  };
  onClose: () => void;
  onSubmit?: () => void;
}

export const TaskEditorHeader: React.FC<TaskEditorHeaderProps> = ({
  title,
  colors,
  onClose,
  onSubmit,
}) => {
  return (
    <View
      style={[
        taskTextEditorStyles.header,
        { borderBottomColor: colors.border, width: "100%" },
      ]}
    >
      <ThemedText
        style={[Typography.h3, { color: colors.text, width: "70%" }]}
        numberOfLines={1}
      >
        {title}
      </ThemedText>

      <View style={taskTextEditorStyles.headerActions}>
        {onSubmit && (
          <Pressable onPress={onSubmit} hitSlop={8}>
            <ThemedText
              style={[
                Typography.body,
                { color: colors.primary, fontWeight: "600" },
              ]}
            >
              Done
            </ThemedText>
          </Pressable>
        )}
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={{ marginLeft: Spacing.md }}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
};

