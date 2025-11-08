import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { taskTextEditorStyles } from "./styles";

interface ToolbarColors {
  border: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
}

interface TaskEditorToolbarProps {
  isRichEditorAvailable: boolean;
  colors: ToolbarColors;
  richToolbar?: React.ReactNode;
  onPressAddFile?: () => void;
  showOptionsButton: boolean;
  optionsExpanded: boolean;
  onToggleOptions?: () => void;
}

export const TaskEditorToolbar: React.FC<TaskEditorToolbarProps> = ({
  isRichEditorAvailable,
  colors,
  richToolbar,
  onPressAddFile,
  showOptionsButton,
  optionsExpanded,
  onToggleOptions,
}) => {
  const showRightActions = Boolean(onPressAddFile || showOptionsButton);

  return (
    <View
      style={[
        taskTextEditorStyles.toolbar,
        {
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={{ width: "70%" }}>
        {isRichEditorAvailable ? (
          <View
            style={[
              taskTextEditorStyles.nativeToolbarWrapper,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {richToolbar}
          </View>
        ) : (
          <View />
        )}
      </View>

      {showRightActions && (
        <View style={taskTextEditorStyles.toolbarRight}>
          {onPressAddFile && (
            <Pressable
              style={({ pressed }) => [
                taskTextEditorStyles.toolbarButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}
              onPress={onPressAddFile}
            >
              <Ionicons name="attach-outline" size={22} color={colors.text} />
            </Pressable>
          )}
          {showOptionsButton && onToggleOptions && (
            <Pressable
              style={({ pressed }) => [
                taskTextEditorStyles.toolbarButton,
                {
                  backgroundColor: optionsExpanded
                    ? colors.primary
                    : colors.card,
                  borderColor: optionsExpanded ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}
              onPress={onToggleOptions}
            >
              <Ionicons
                name={optionsExpanded ? "settings" : "settings-outline"}
                size={22}
                color={optionsExpanded ? "#FFFFFF" : colors.text}
              />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

