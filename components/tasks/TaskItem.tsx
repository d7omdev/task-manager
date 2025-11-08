import React, { useMemo, useState } from 'react';
import { StyleSheet, Pressable, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { ThemedText } from '@/components/themed-text';
import { triggerHaptic } from '@/utils/haptics';
import { getPriorityColor, getUrgencyColor } from '@/utils/taskUtils';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { Task } from '@/types/task';
import { getRelativeDateText } from '@/utils/dateTime';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskDetailModal } from './TaskDetailModal';
import { ensureHtmlContent, normalizeRichTextHtmlForRender } from '@/utils/richText';
import {
  createRichTextBaseStyle,
  richTextRenderersProps,
  richTextTagsStyles,
} from './task-text-editor/richTextStyles';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, index }) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const { width: screenWidth } = useWindowDimensions();
  const [showModal, setShowModal] = useState(false);

  const isSmallScreen = screenWidth < 375;
  
  const priorityColor = getPriorityColor(task.priority, colors);
  
  const hasAttachments = task.attachments && task.attachments.length > 0;

  // Swipe gesture animation values (only for swipe-to-delete)
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const SWIPE_THRESHOLD = -100;

  const handleCardPress = () => {
    triggerHaptic('light');
    setShowModal(true);
  };

  const handleToggle = () => {
    triggerHaptic('light');
    onToggle(task.id);
  };

  const handleDelete = () => {
    triggerHaptic('success');
    onDelete(task.id);
  };

  // Pan gesture for swipe-to-delete
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow swiping left
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < SWIPE_THRESHOLD) {
        // Swipe passed threshold - trigger delete
        runOnJS(handleDelete)();
      } else {
        // Swipe didn't pass threshold - spring back
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  // Animated style for swipe
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  // Get due date info if exists
  const dueDateInfo = task.dueDate && !task.completed
    ? getRelativeDateText(task.dueDate, task.dueTime)
    : null;

  // Background delete indicator style
  const deleteBackgroundStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? 1 : 0,
  }));

  const htmlSource = useMemo(
    () => ({
      html: normalizeRichTextHtmlForRender(ensureHtmlContent(task.text || '')),
    }),
    [task.text]
  );

  const themedPreviewTags = useMemo(() => ({
    ...richTextTagsStyles,
    p: { ...(richTextTagsStyles.p ?? {}), marginBottom: 6 },
    h1: { ...(richTextTagsStyles.h1 ?? {}), fontSize: 22, marginBottom: 6 },
    h2: { ...(richTextTagsStyles.h2 ?? {}), fontSize: 20, marginBottom: 4 },
    h3: { ...(richTextTagsStyles.h3 ?? {}), fontSize: 18, marginBottom: 4 },
    a: {
      ...(richTextTagsStyles.a ?? {}),
      color: colors.primary,
    },
  }), [colors.primary]);

  return (
    <View style={styles.wrapper}>
      {/* Delete background indicator */}
      <Animated.View
        style={[
          styles.deleteBackground,
          { backgroundColor: colors.danger },
          deleteBackgroundStyle,
        ]}
      >
        <Ionicons name="trash" size={24} color="#fff" />
      </Animated.View>

      {/* Swipeable card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          entering={FadeInDown.delay(index * 30).duration(200)}
          exiting={FadeOut.duration(150)}
          style={[styles.animatedContainer, animatedStyle]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.container,
              { 
                backgroundColor: colors.card,
                borderLeftColor: task.completed ? colors.success : priorityColor,
                borderLeftWidth: 4,
              },
              pressed && styles.pressedCard,
            ]}
            onPress={handleCardPress}
          >
            <View style={styles.content}>
              <View style={styles.textContainer}>
                <View
                  style={[
                    styles.richPreview,
                    task.completed && { opacity: 0.6 },
                  ]}
                >
                  <RenderHtml
                    contentWidth={Math.max(screenWidth - Spacing.lg * 4, 200)}
                    source={htmlSource}
                    baseStyle={createRichTextBaseStyle(colors.text)}
                    tagsStyles={themedPreviewTags}
                    renderersProps={richTextRenderersProps}
                  />
                </View>

                {/* Metadata row */}
                <View style={styles.metadataRow}>
                  {/* Due date display */}
                  {dueDateInfo && (
                    <View style={styles.dueDateContainer}>
                      <Ionicons
                        name={dueDateInfo.urgency === 'overdue' ? 'alert-circle' : 'calendar-outline'}
                        size={isSmallScreen ? 12 : 14}
                        color={getUrgencyColor(dueDateInfo.urgency, colors)}
                      />
                      <ThemedText
                        style={[
                          Typography.caption,
                          styles.dueDateText,
                          {
                            color: getUrgencyColor(dueDateInfo.urgency, colors),
                            fontSize: isSmallScreen ? 11 : 12,
                          },
                        ]}
                      >
                        {dueDateInfo.text}
                      </ThemedText>
                    </View>
                  )}
                  
                  {/* Attachments indicator */}
                  {hasAttachments && (
                    <View style={styles.attachmentIndicator}>
                      <Ionicons name="attach" size={24} color={colors.textSecondary} />
                      <ThemedText
                        style={[Typography.caption, { color: colors.textSecondary, fontSize: 14 }]}
                      >
                        {task.attachments!.length}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deletePressed,
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                hitSlop={12}
              >
                <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </Pressable>
          
          <TaskDetailModal
            task={task}
            visible={showModal}
            onClose={() => setShowModal(false)}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  animatedContainer: {
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 80,
    borderLeftWidth: 4,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  pressedCard: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    minHeight: 60,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
    gap: Spacing.xs,
  },
  richPreview: {
    maxHeight: 64,
    overflow: 'hidden',
  },
  taskText: {
    lineHeight: 22,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs / 2,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  dueDateText: {
    fontWeight: '600',
    fontSize: 11,
  },
  deleteButton: {
    padding: Spacing.xs,
    marginTop: 2,
    borderRadius: BorderRadius.sm,
  },
  deletePressed: {
    opacity: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});
