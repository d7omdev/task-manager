import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskList, AddTaskForm, FilterChips } from '@/components/tasks';
import { TaskSkeletonItem } from '@/components/tasks/TaskSkeletonItem';
import { TaskTextEditor } from '@/components/tasks/TaskTextEditor';
import { ThemedText } from '@/components/themed-text';
import { useTasks } from '@/hooks/useTasks';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Task, TaskAttachment } from '@/types/task';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function TaskManagerScreen() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask, isLoading } = useTasks();
  const { filtering, setFiltering, sorting } = usePreferences();
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>();
  const [editDueTime, setEditDueTime] = useState<string | undefined>();
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editAttachments, setEditAttachments] = useState<Task['attachments']>([]);

  const { filteredTasks, filterCounts } = useTaskFilters(tasks, filtering, sorting);

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditText(task.text);
    setEditDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    setEditDueTime(task.dueTime || undefined);
    setEditPriority(task.priority);
    setEditAttachments(task.attachments || []);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editingTask && editText.trim()) {
      await updateTask(editingTask.id, {
        text: editText,
        dueDate: editDueDate ? editDueDate.toISOString() : null,
        dueTime: editDueTime || null,
        priority: editPriority,
        attachments: editAttachments,
      });
      setEditingTask(null);
      setShowEditModal(false);
      setEditText('');
      setEditDueDate(undefined);
      setEditDueTime(undefined);
      setEditPriority('medium');
      setEditAttachments([]);
    }
  };

  const handleAddImage = useCallback(async (): Promise<TaskAttachment | undefined> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to add images.');
        return undefined;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const timestamp = Date.now();
        const contentUri =
          asset.base64 && asset.mimeType
            ? `data:${asset.mimeType};base64,${asset.base64}`
            : asset.base64
              ? `data:image/jpeg;base64,${asset.base64}`
              : undefined;
        const newAttachment: TaskAttachment = {
          id: timestamp.toString(),
          uri: asset.uri,
          name: asset.fileName || `image_${timestamp}.jpg`,
          type: 'image',
          size: asset.fileSize,
          contentUri,
        };
        setEditAttachments((prev) => [...prev, newAttachment]);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return newAttachment;
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }

    return undefined;
  }, []);

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment = {
          id: Date.now().toString(),
          uri: asset.uri,
          name: asset.name,
          type: 'file' as const,
          size: asset.size,
        };
        setEditAttachments((prev) => [...prev, newAttachment]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setEditAttachments((prev) => prev.filter((att) => att.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { paddingBottom: Spacing.sm }]}
      >
        <View style={styles.header}>
          <ThemedText style={[Typography.h2, styles.title]}>
            My Tasks
          </ThemedText>
          {tasks.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={[styles.statBadge, { backgroundColor: colors.primary + '20' }]}>
                <ThemedText style={[styles.statBadgeText, { color: colors.primary }]}>
                  {activeTasks.length} active
                </ThemedText>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.success + '20' }]}>
                <ThemedText style={[styles.statBadgeText, { color: colors.success }]}>
                  {completedTasks.length} done
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {tasks.length > 0 && !isLoading && (
          <FilterChips
            activeFilter={filtering}
            onFilterChange={setFiltering}
            counts={filterCounts}
          />
        )}

        <View style={styles.content}>
          {isLoading ? (
            <ScrollView
              style={styles.skeletonContainer}
              contentContainerStyle={styles.skeletonContent}
              showsVerticalScrollIndicator={false}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <TaskSkeletonItem key={index} />
              ))}
            </ScrollView>
          ) : (
            <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={handleEditTask} onRefresh={handleRefresh} />
          )}
        </View>

        <AddTaskForm onAddTask={addTask} />

        {/* Edit Task Modal */}
        {editingTask && (
          <TaskTextEditor
            visible={showEditModal}
            text={editText}
            onTextChange={setEditText}
            onClose={() => {
              setShowEditModal(false);
              setEditingTask(null);
            }}
            onSubmit={handleSaveEdit}
            title="Edit Task"
            attachments={editAttachments}
            onRemoveAttachment={handleRemoveAttachment}
            onAddImage={handleAddImage}
            onAddFile={handleAddFile}
            dueDate={editDueDate}
            dueTime={editDueTime}
            onDueDateChange={setEditDueDate}
            onDueTimeChange={setEditDueTime}
            onClearDueDate={() => {
              setEditDueDate(undefined);
              setEditDueTime(undefined);
            }}
            priority={editPriority}
            onPriorityChange={setEditPriority}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  statBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  skeletonContainer: {
    flex: 1,
  },
  skeletonContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
});
