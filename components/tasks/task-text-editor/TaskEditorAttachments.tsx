import React from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Typography } from "@/constants/theme";
import { TaskAttachment } from "@/types/task";
import { taskTextEditorStyles } from "./styles";
import { getAttachmentLabel, getAttachmentIcon } from "@/utils/attachments";

interface TaskEditorAttachmentsProps {
  attachments: TaskAttachment[];
  colors: {
    background: string;
    border: string;
    text: string;
    textSecondary: string;
    card: string;
    cardSecondary: string;
  };
  onRemoveAttachment?: (id: string) => void;
}

export const TaskEditorAttachments: React.FC<TaskEditorAttachmentsProps> = ({
  attachments,
  colors,
  onRemoveAttachment,
}) => {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        taskTextEditorStyles.attachmentsSection,
        {
          borderBottomColor: colors.border,
          backgroundColor: colors.card,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={taskTextEditorStyles.attachmentsScroll}
        contentContainerStyle={taskTextEditorStyles.attachmentsScrollContent}
      >
        {attachments.map((attachment) => (
          <View
            key={attachment.id}
            style={[
              taskTextEditorStyles.attachmentBadge,
              {
                backgroundColor: colors.cardSecondary ?? colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name={getAttachmentIcon(attachment.type, attachment.name)}
              size={14}
              color={colors.textSecondary}
            />
            <ThemedText
              style={[
                Typography.caption,
                { color: colors.text, fontSize: 12 },
              ]}
              numberOfLines={1}
            >
              {getAttachmentLabel(attachment.name, 10)}
            </ThemedText>
            {onRemoveAttachment && (
              <Pressable
                onPress={() => onRemoveAttachment(attachment.id)}
                hitSlop={6}
                style={taskTextEditorStyles.removeBadgeButton}
              >
                <Ionicons name="close" size={14} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

