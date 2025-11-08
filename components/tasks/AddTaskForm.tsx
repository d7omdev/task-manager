import React from "react";
import {
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { DateTimeSelector, PrioritySelector } from "@/components/ui";
import { TaskTextEditor } from "./TaskTextEditor";
import { formatDateTime } from "@/utils/dateTime";
import { Colors, Shadows, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { truncatePlainText } from "@/utils/richText";

import { addTaskFormStyles as styles } from "./add-task-form/styles";
import { AttachmentsPreview } from "./add-task-form/AttachmentsPreview";
import { useAddTaskForm } from "./add-task-form/useAddTaskForm";
import type { AddTaskHandler } from "./add-task-form/types";

interface AddTaskFormProps {
  onAddTask: AddTaskHandler;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const {
    attachments,
    dueDate,
    dueTime,
    handleAddFile,
    handleAddImage,
    handleClearDueDate,
    handleCloseDateTimeModal,
    handleDateChange,
    handleEditorClose,
    handleEditorOpen,
    handleEditorSubmit,
    handleRemoveAttachment,
    handleSetDueDate,
    handleSubmit,
    handleTimeChange,
    hasAttachments,
    hasText,
    plainPreview,
    priority,
    setPriority,
    setText,
    showDateTimeModal,
    showTextEditor,
    text,
  } = useAddTaskForm({ onAddTask });

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 375;

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background },
    hasAttachments && styles.containerWithAttachments,
  ];

  return (
    <View style={containerStyle}>
      <AttachmentsPreview
        attachments={attachments}
        colors={{
          background: colors.background,
          border: colors.border,
          card: colors.card,
          text: colors.text,
          textSecondary: colors.textSecondary,
        }}
        onRemoveAttachment={handleRemoveAttachment}
      />

      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.card },
          {
            ...Shadows.small,
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          },
          hasAttachments && styles.inputWrapperWithAttachments,
        ]}
      >
        <Pressable onPress={handleEditorOpen} style={styles.expandButton}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </Pressable>

        <Pressable onPress={handleEditorOpen} style={styles.inputPressable}>
          <View
            style={[
              styles.inputContainer,
              {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            {text ? (
              <ThemedText
                style={[Typography.body, { color: colors.text }]}
                numberOfLines={2}
              >
                {truncatePlainText(plainPreview, 160)}
              </ThemedText>
            ) : (
              <ThemedText
                style={[
                  Typography.body,
                  { color: colors.textSecondary, fontSize: 14 },
                ]}
                numberOfLines={1}
              >
                Add a new task...
              </ThemedText>
            )}
          </View>
        </Pressable>

        {dueDate && (
          <View style={styles.dueDateDisplay}>
            <Ionicons
              name="calendar"
              size={isSmallScreen ? 12 : 14}
              color={colors.textSecondary}
            />
            <ThemedText
              style={[
                Typography.caption,
                {
                  color: colors.textSecondary,
                  fontSize: isSmallScreen ? 11 : 12,
                },
              ]}
            >
              {formatDateTime(dueDate, dueTime)}
            </ThemedText>
            <Pressable onPress={handleClearDueDate} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={isSmallScreen ? 14 : 16}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
        )}

        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.attachmentButton,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              void handleAddImage();
            }}
          >
            <Ionicons
              name="image-outline"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.attachmentButton,
              pressed && styles.pressed,
            ]}
            onPress={handleAddFile}
          >
            <Ionicons
              name="attach-outline"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
          {!dueDate && (
            <Pressable
              style={({ pressed }) => [
                styles.attachmentButton,
                pressed && styles.pressed,
              ]}
              onPress={handleSetDueDate}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>

        {hasText && (
          <Pressable
            style={[
              styles.addButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={handleSubmit}
          >
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        )}
      </View>

      <Modal
        visible={showDateTimeModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDateTimeModal}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={handleCloseDateTimeModal}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={[Typography.h3, { color: colors.text }]}>
                Set Due Date
              </ThemedText>
              <Pressable onPress={handleCloseDateTimeModal}>
                <ThemedText
                  style={[Typography.body, { color: colors.primary }]}
                >
                  Done
                </ThemedText>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <DateTimeSelector
                date={dueDate}
                timeValue={dueTime}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
                mode="both"
              />
              <PrioritySelector
                selectedPriority={priority}
                onPriorityChange={setPriority}
              />
            </View>
          </View>
        </Pressable>
      </Modal>

      <TaskTextEditor
        visible={showTextEditor}
        text={text}
        onTextChange={setText}
        onClose={handleEditorClose}
        onSubmit={handleEditorSubmit}
        title="Add Task"
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
        onAddImage={handleAddImage}
        onAddFile={handleAddFile}
        dueDate={dueDate}
        dueTime={dueTime}
        onDueDateChange={handleDateChange}
        onDueTimeChange={handleTimeChange}
        onClearDueDate={handleClearDueDate}
        priority={priority}
        onPriorityChange={setPriority}
      />
    </View>
  );
};
