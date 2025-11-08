import React from "react";
import {
  View,
  TextInput,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/theme";
import { TaskAttachment } from "@/types/task";
import { taskTextEditorStyles } from "./task-text-editor/styles";
import { TaskEditorHeader } from "./task-text-editor/TaskEditorHeader";
import { TaskEditorToolbar } from "./task-text-editor/TaskEditorToolbar";
import { TaskEditorAttachments } from "./task-text-editor/TaskEditorAttachments";
import { TaskEditorOptions } from "./task-text-editor/TaskEditorOptions";
import { TaskEditorFooter } from "./task-text-editor/TaskEditorFooter";
import { useTaskEditorState } from "./task-text-editor/useTaskEditorState";

interface TaskTextEditorProps {
  visible: boolean;
  text: string;
  onTextChange: (text: string) => void;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  attachments?: TaskAttachment[];
  onRemoveAttachment?: (id: string) => void;
  onAddImage?: () => Promise<TaskAttachment | undefined>;
  onAddFile?: () => void;
  dueDate?: Date | undefined;
  dueTime?: string | undefined;
  onDueDateChange?: (date: Date) => void;
  onDueTimeChange?: (time: string) => void;
  onClearDueDate?: () => void;
  priority?: "low" | "medium" | "high";
  onPriorityChange?: (priority: "low" | "medium" | "high") => void;
}

export const TaskTextEditor: React.FC<TaskTextEditorProps> = ({
  visible,
  text,
  onTextChange,
  onClose,
  onSubmit,
  title = "Add Task",
  attachments = [],
  onRemoveAttachment,
  onAddImage,
  onAddFile,
  dueDate,
  dueTime,
  onDueDateChange,
  onDueTimeChange,
  onClearDueDate,
  priority = "medium",
  onPriorityChange,
}) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const { height: screenHeight } = useWindowDimensions();
  const {
    effectiveAttachments,
    editorContentCSS,
    editorHtml,
    fallbackValue,
    handleEditorBlur,
    handleEditorFocus,
    handleEditorInitialized,
    handleNativeContentChange,
    handleRemoveAttachmentInternal,
    handleToggleOptions,
    isCompactHeight,
    isRichEditorAvailable,
    richEditorRef,
    richToolbarElement,
    showOptions,
    textInputRef,
    triggerHaptic,
    updateFallbackMarkdown,
  } = useTaskEditorState({
    attachments,
    colors,
    dueDate,
    dueTime,
    isDarkMode: activeTheme === "dark",
    onAddImage,
    onRemoveAttachment,
    onTextChange,
    priority,
    screenHeight,
    text,
    visible,
  });

  const showOptionsButton = Boolean(onDueDateChange || onPriorityChange);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={taskTextEditorStyles.container}
      >
        <View style={taskTextEditorStyles.overlay}>
          <Pressable style={taskTextEditorStyles.backdrop} onPress={onClose} />
          <View
            style={[
              taskTextEditorStyles.editorContent,
              {
                backgroundColor: colors.card,
                maxHeight: screenHeight * (isCompactHeight ? 0.94 : 0.85),
                minHeight: screenHeight * (isCompactHeight ? 0.7 : 0.55),
              },
            ]}
          >
            <TaskEditorHeader
              title={title}
              onClose={onClose}
              onSubmit={onSubmit}
              colors={{
                text: colors.text,
                border: colors.border,
                primary: colors.primary,
              }}
            />

            <TaskEditorToolbar
              isRichEditorAvailable={isRichEditorAvailable}
              colors={{
                border: colors.border,
                background: colors.background,
                card: colors.card,
                text: colors.text,
                textSecondary: colors.textSecondary,
                primary: colors.primary,
              }}
              richToolbar={richToolbarElement}
              showOptionsButton={showOptionsButton}
              optionsExpanded={showOptions}
              onToggleOptions={showOptionsButton ? handleToggleOptions : undefined}
              onPressAddFile={
                onAddFile
                  ? () => {
                    triggerHaptic();
                    void onAddFile();
                  }
                  : undefined
              }
            />

            <TaskEditorAttachments
              attachments={effectiveAttachments}
              onRemoveAttachment={
                effectiveAttachments.length > 0 ? handleRemoveAttachmentInternal : undefined
              }
              colors={{
                background: colors.background,
                border: colors.border,
                text: colors.text,
                textSecondary: colors.textSecondary,
                card: colors.card,
                cardSecondary: colors.cardSecondary ?? colors.card,
              }}
            />

            <TaskEditorOptions
              visible={showOptions}
              colors={{
                background: colors.background,
                border: colors.border,
                text: colors.text,
                textSecondary: colors.textSecondary,
                card: colors.card,
                cardSecondary: colors.cardSecondary ?? colors.card,
              }}
              dueDate={dueDate}
              dueTime={dueTime}
              onDueDateChange={onDueDateChange}
              onDueTimeChange={onDueTimeChange}
              onClearDueDate={onClearDueDate}
              priority={priority}
              onPriorityChange={onPriorityChange}
            />

            <View
              style={[
                taskTextEditorStyles.inputContainer,
                {
                  backgroundColor: colors.background,
                  minHeight: screenHeight * (isCompactHeight ? 0.68 : 0.55),
                },
              ]}
            >
              {isRichEditorAvailable ? (
                <RichEditor
                  ref={richEditorRef}
                  initialContentHTML={editorHtml}
                  editorInitializedCallback={handleEditorInitialized}
                  useContainer
                  placeholder="Enter task details..."
                  style={[
                    taskTextEditorStyles.richTextInput,
                    { backgroundColor: colors.card },
                  ]}
                  editorStyle={{
                    backgroundColor: colors.card,
                    color: colors.text,
                    placeholderColor: colors.textSecondary,
                    caretColor: colors.primary,
                    contentCSSText: editorContentCSS,
                  }}
                  onChange={handleNativeContentChange}
                  onFocus={handleEditorFocus}
                  onBlur={handleEditorBlur}
                />
              ) : (
                <TextInput
                  ref={textInputRef}
                  style={[
                    taskTextEditorStyles.textInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.card,
                    },
                  ]}
                  value={fallbackValue}
                  onChangeText={updateFallbackMarkdown}
                  onSelectionChange={() => {
                    /* reserved for future */
                  }}
                  multiline
                  placeholder="Enter task description..."
                  placeholderTextColor={colors.textSecondary}
                  autoFocus
                  textAlignVertical="top"
                  returnKeyType="default"
                  blurOnSubmit={false}
                  enablesReturnKeyAutomatically={false}
                />
              )}
            </View>

            <TaskEditorFooter
              colors={{
                border: colors.border,
                textSecondary: colors.textSecondary,
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
