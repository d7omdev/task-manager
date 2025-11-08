import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Platform, Alert } from "react-native";
import { Task } from "@/types/task";

/**
 * Exports tasks as a JSON file and opens the native share sheet
 * @param tasks - Array of tasks to export
 * @returns Promise that resolves when export is complete or rejects on error
 */
export const exportTasksAsJSON = async (tasks: Task[]): Promise<void> => {
  try {
    // Generate filename with current date
    const date = new Date();
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `tasks-export-${dateString}.json`;

    // Convert tasks to formatted JSON
    const jsonContent = JSON.stringify(tasks, null, 2);

    // Handle web platform differently - use blob download
    if (Platform.OS === 'web') {
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    // Use cache directory which is accessible for sharing
    // On native platforms, prefer cacheDirectory
    const fsModule = FileSystem as Record<string, unknown>;
    const baseDir =
      (typeof fsModule.cacheDirectory === "string"
        ? (fsModule.cacheDirectory as string)
        : null) ??
      (typeof fsModule.documentDirectory === "string"
        ? (fsModule.documentDirectory as string)
        : null) ??
      undefined;

    if (!baseDir) {
      Alert.alert(
        "Export Unavailable",
        "This device does not provide a writable storage location for exports.",
      );
      return;
    }

    // Create file path - ensure it doesn't have double slashes
    const dir = baseDir.endsWith("/") ? baseDir : `${baseDir}/`;
    const fileUri = `${dir}${filename}`;

    const needsStoragePermission = Platform.OS === "android";

    if (needsStoragePermission) {
      const { status: existingStatus } =
        await MediaLibrary.getPermissionsAsync();
      let granted = existingStatus === "granted";

      if (!granted) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        granted = status === "granted";
      }

      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Storage permission is needed to export tasks.",
        );
        return;
      }
    }

    // Write JSON to file
    await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
      encoding: "utf8",
    });

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    // Open native share sheet
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Tasks',
      UTI: 'public.json',
    });

  } catch (error) {
    console.error('Error exporting tasks:', error);
    throw error;
  }
};

/**
 * Gets export statistics for display
 * @param tasks - Array of tasks
 * @returns Object with export statistics
 */
export const getExportStats = (tasks: Task[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return {
    total: totalTasks,
    completed: completedTasks,
    active: activeTasks,
  };
};
