import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Task, TaskAttachment } from '@/types/task';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { getRelativeDateText } from '@/utils/dateTime';
import { getPriorityColor, getUrgencyColor } from '@/utils/taskUtils';
import { formatDateTime } from '@/utils/dateTime';
import { getAttachmentLabel, getAttachmentIcon } from '@/utils/attachments';
import { ensureHtmlContent, normalizeRichTextHtmlForRender } from '@/utils/richText';
import RenderHtml from 'react-native-render-html';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  createRichTextBaseStyle,
  richTextRenderersProps,
  richTextTagsStyles,
} from './task-text-editor/richTextStyles';

interface TaskDetailModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  visible,
  onClose,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const htmlSource = React.useMemo(
    () => ({
      html: normalizeRichTextHtmlForRender(ensureHtmlContent(task?.text ?? '')),
    }),
    [task?.text]
  );

  const themedTagsStyles = React.useMemo(() => {
    const codeBackground = colors.border;
    const preBackground = colors.cardSecondary ?? colors.background;
    return {
      ...richTextTagsStyles,
      a: {
        ...(richTextTagsStyles.a ?? {}),
        color: colors.primary,
      },
      code: {
        ...(richTextTagsStyles.code ?? {}),
        backgroundColor: codeBackground,
      },
      pre: {
        ...(richTextTagsStyles.pre ?? {}),
        backgroundColor: preBackground,
      },
      blockquote: {
        ...(richTextTagsStyles.blockquote ?? {}),
        borderLeftColor: colors.primary + '55',
      },
    };
  }, [colors]);

  if (!task) return null;

  const priorityColor = getPriorityColor(task.priority, colors);
  const dueDateInfo = task.dueDate && !task.completed
    ? getRelativeDateText(task.dueDate, task.dueTime)
    : null;

  const handleShareFile = async (attachment: TaskAttachment) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(attachment.uri);
      }
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[styles.modalContent, { backgroundColor: colors.card }]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <ThemedText style={[Typography.h3, { color: colors.text }]}>
              Task Details
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Task Text */}
            <View style={styles.section}>
              <RenderHtml
                contentWidth={screenWidth - Spacing.lg * 2}
                source={htmlSource}
                baseStyle={createRichTextBaseStyle(
                  colors.text,
                  task.completed ? colors.completed : undefined,
                )}
                tagsStyles={themedTagsStyles}
                renderersProps={richTextRenderersProps}
              />
            </View>

            {/* Priority */}
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabel}>
                <Ionicons name="flag-outline" size={20} color={colors.textSecondary} />
                <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                  Priority
                </ThemedText>
              </View>
              <View
                style={[
                  styles.priorityChip,
                  { backgroundColor: priorityColor + '20' },
                ]}
              >
                <ThemedText
                  style={[Typography.caption, { color: priorityColor, fontWeight: '600' }]}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </ThemedText>
              </View>
            </View>

            {/* Due Date */}
            {task.dueDate && (
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <View style={styles.infoLabel}>
                  <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                  <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                    Due Date
                  </ThemedText>
                </View>
                <ThemedText
                  style={[
                    Typography.body,
                    {
                      color: dueDateInfo
                        ? getUrgencyColor(dueDateInfo.urgency, colors)
                        : colors.text,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {formatDateTime(new Date(task.dueDate), task.dueTime)}
                </ThemedText>
              </View>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <View style={styles.section}>
                <ThemedText
                  style={[
                    Typography.caption,
                    { color: colors.textSecondary, marginBottom: Spacing.sm },
                  ]}
                >
                  Attachments ({task.attachments.length})
                </ThemedText>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.attachmentsScroll}
                  contentContainerStyle={styles.attachmentsScrollContent}
                >
                  {task.attachments.map((attachment) => (
                    <Pressable
                      key={attachment.id}
                      style={[
                        styles.attachmentBadge,
                        { 
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => handleShareFile(attachment)}
                    >
                      <Ionicons 
                        name={getAttachmentIcon(attachment.type, attachment.name)} 
                        size={14} 
                        color={colors.textSecondary} 
                      />
                      <ThemedText 
                        style={[Typography.caption, { color: colors.text, fontSize: 12 }]} 
                        numberOfLines={1}
                      >
                        {getAttachmentLabel(attachment.name, 10)}
                      </ThemedText>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              {onEdit && (
                <Pressable
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                  onPress={() => {
                    onEdit(task);
                    onClose();
                  }}
                >
                  <Ionicons name="create-outline" size={24} color={colors.primary} />
                  <ThemedText
                    style={[Typography.body, { color: colors.primary, fontWeight: '600' }]}
                  >
                    Edit
                  </ThemedText>
                </Pressable>
              )}
              
              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.success + '20' },
                ]}
                onPress={() => {
                  onToggle(task.id);
                  onClose();
                }}
              >
                <Ionicons
                  name={task.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={24}
                  color={colors.success}
                />
                <ThemedText
                  style={[Typography.body, { color: colors.success, fontWeight: '600' }]}
                >
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </ThemedText>
              </Pressable>

              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.danger + '20' },
                ]}
                onPress={() => {
                  onDelete(task.id);
                  onClose();
                }}
              >
                <Ionicons name="trash-outline" size={24} color={colors.danger} />
                <ThemedText
                  style={[Typography.body, { color: colors.danger, fontWeight: '600' }]}
                >
                  Delete
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  taskText: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  priorityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  attachmentsScroll: {
    maxHeight: 52,
  },
  attachmentsScrollContent: {
    gap: Spacing.xs,
    alignItems: 'center',
    paddingVertical: Spacing.xs / 2,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    maxWidth: 200,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
});

