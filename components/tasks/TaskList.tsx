import { Colors, Spacing } from "@/constants/theme";
import { Task } from "@/types/task";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { EmptyState } from "./EmptyState";
import { TaskItem } from "./TaskItem";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onRefresh?: () => Promise<void> | void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onRefresh,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) {
      return;
    }

    setIsRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TaskItem
            task={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            index={index}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          tasks.length === 1 && styles.singleItemContent,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  singleItemContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  separator: {
    height: Spacing.xs,
  },
});
