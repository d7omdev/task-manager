import React from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Typography } from "@/constants/theme";
import { taskTextEditorStyles } from "./styles";

interface TaskEditorFooterProps {
  colors: {
    border: string;
    textSecondary: string;
  };
}

export const TaskEditorFooter: React.FC<TaskEditorFooterProps> = ({
  colors,
}) => {
  return (
    <View
      style={[
        taskTextEditorStyles.footer,
        { borderTopColor: colors.border },
      ]}
    >
      <ThemedText
        style={[Typography.caption, { color: colors.textSecondary }]}
      >
        Mobile editor supports rich formatting • Web fallback still offers quick
        bullets
      </ThemedText>
    </View>
  );
};

