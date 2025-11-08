import React from "react";
import {
    Alert,
    Animated,
    LayoutAnimation,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Updates from "expo-updates";

import { Colors } from "@/constants/theme";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTasks } from "@/hooks/useTasks";
import { exportTasksAsJSON, getExportStats } from "@/utils/exportService";
import type { Task } from "@/types/task";

interface ImportStats {
    total: number;
    valid: number;
}

export const useSettingsScreen = () => {
    const { activeTheme } = useTheme();
    const colors = Colors[activeTheme];
    const { tasks, clearCompleted, addTask } = useTasks();
    const {
        hapticsEnabled,
        setHapticsEnabled,
        soundsEnabled,
        setSoundsEnabled,
    } = usePreferences();

    const [showSortingOptions, setShowSortingOptions] = React.useState(false);
    const [showResetModal, setShowResetModal] = React.useState(false);
    const [resetConfirmText, setResetConfirmText] = React.useState("");
    const [hasStoragePermission, setHasStoragePermission] = React.useState(
        Platform.OS !== "android",
    );
    const [showExportModal, setShowExportModal] = React.useState(false);
    const [showClearModal, setShowClearModal] = React.useState(false);
    const [showImportModal, setShowImportModal] = React.useState(false);
    const [pendingImportTasks, setPendingImportTasks] = React.useState<
        Array<Partial<Task> & { text: string }>
    >([]);
    const [importStats, setImportStats] = React.useState<ImportStats>({
        total: 0,
        valid: 0,
    });
    const [isImporting, setIsImporting] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);

    const sortingChevronProgress = React.useRef(
        new Animated.Value(showSortingOptions ? 1 : 0),
    ).current;

    React.useEffect(() => {
        if (Platform.OS !== "android") {
            return;
        }

        void (async () => {
            try {
                const { status } = await MediaLibrary.getPermissionsAsync();
                setHasStoragePermission(status === "granted");
            } catch (error) {
                console.warn("Failed to check storage permission", error);
            }
        })();
    }, []);

    React.useEffect(() => {
        Animated.timing(sortingChevronProgress, {
            toValue: showSortingOptions ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [showSortingOptions, sortingChevronProgress]);

    const sortingChevronRotation = sortingChevronProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    const requestStoragePermission = React.useCallback(async () => {
        if (Platform.OS !== "android") {
            return true;
        }

        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            const granted = status === "granted";
            setHasStoragePermission(granted);

            if (!granted) {
                Alert.alert(
                    "Permission Required",
                    "Storage access is required to export tasks. Please enable it in system settings.",
                );
            }

            return granted;
        } catch (error) {
            console.warn("Failed to request storage permission", error);
            Alert.alert(
                "Permission Error",
                "Unable to request storage permission. Please try again later.",
            );
            return false;
        }
    }, []);

    const completedTasksCount = React.useMemo(
        () => tasks.filter((task) => task.completed).length,
        [tasks],
    );
    const exportStats = React.useMemo(() => getExportStats(tasks), [tasks]);

    const openClearCompletedModal = React.useCallback(() => {
        if (completedTasksCount === 0) {
            Alert.alert(
                "No Completed Tasks",
                "There are no completed tasks to clear.",
            );
            return;
        }
        setShowClearModal(true);
    }, [completedTasksCount]);

    const closeClearModal = React.useCallback(() => {
        setShowClearModal(false);
    }, []);

    const confirmClearCompleted = React.useCallback(() => {
        clearCompleted();
        closeClearModal();
    }, [clearCompleted, closeClearModal]);

    const toggleSortingOptions = React.useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowSortingOptions((prev) => !prev);
    }, []);

    const openExportModal = React.useCallback(async () => {
        if (tasks.length === 0) {
            Alert.alert("No Tasks", "There are no tasks to export.");
            return;
        }

        if (Platform.OS === "android" && !hasStoragePermission) {
            const granted = await requestStoragePermission();
            if (!granted) {
                return;
            }
        }

        setShowExportModal(true);
    }, [tasks.length, hasStoragePermission, requestStoragePermission]);

    const closeExportModal = React.useCallback(() => {
        setShowExportModal(false);
    }, []);

    const handleExportConfirm = React.useCallback(async () => {
        try {
            setIsExporting(true);
            await exportTasksAsJSON(tasks);
            closeExportModal();
            Alert.alert(
                "Export Complete",
                "Tasks have been exported successfully.",
            );
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to export tasks. Please try again.";
            Alert.alert("Export Failed", errorMessage);
        } finally {
            setIsExporting(false);
        }
    }, [closeExportModal, tasks]);

    const openImportPicker = React.useCallback(async () => {
        if (Platform.OS === "android" && !hasStoragePermission) {
            const granted = await requestStoragePermission();
            if (!granted) {
                return;
            }
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/json", "text/json"],
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return;
            }

            const asset = result.assets[0];
            const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
                encoding: "utf8",
            });

            const parsed = JSON.parse(fileContent);

            if (!Array.isArray(parsed)) {
                throw new Error("Invalid export format. Expected a list of tasks.");
            }

            const sanitized = parsed
                .filter(
                    (item) =>
                        item &&
                        typeof item.text === "string" &&
                        item.text.trim().length > 0,
                )
                .map((item) => ({
                    text: item.text as string,
                    priority:
                        item.priority === "low" ||
                            item.priority === "medium" ||
                            item.priority === "high"
                            ? (item.priority as "low" | "medium" | "high")
                            : "medium",
                    dueDate: typeof item.dueDate === "string" ? item.dueDate : null,
                    dueTime: typeof item.dueTime === "string" ? item.dueTime : null,
                }));

            if (sanitized.length === 0) {
                Alert.alert(
                    "Import Tasks",
                    "No valid tasks were found in the selected file.",
                );
                return;
            }

            setPendingImportTasks(sanitized);
            setImportStats({ total: parsed.length, valid: sanitized.length });
            setShowImportModal(true);
        } catch (error) {
            console.error("Import error:", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to read the selected file. Please ensure it is a valid export.";
            Alert.alert("Import Failed", message);
        }
    }, [hasStoragePermission, requestStoragePermission]);

    const closeImportModal = React.useCallback(() => {
        setShowImportModal(false);
        setPendingImportTasks([]);
        setImportStats({ total: 0, valid: 0 });
    }, []);

    const handleImportConfirm = React.useCallback(async () => {
        setIsImporting(true);
        try {
            const tasksToImport = [...pendingImportTasks];
            for (const task of tasksToImport) {
                const options: Parameters<typeof addTask>[1] = {
                    priority: task.priority ?? "medium",
                };

                if (task.dueDate) {
                    const parsed = new Date(task.dueDate);
                    if (!Number.isNaN(parsed.getTime())) {
                        options.dueDate = parsed.toISOString();
                    }
                }

                if (task.dueTime && typeof task.dueTime === "string") {
                    options.dueTime = task.dueTime;
                }

                await addTask(task.text, options);
            }

            const importedCount = tasksToImport.length;
            closeImportModal();
            Alert.alert(
                "Import Complete",
                `Successfully imported ${importedCount} ${importedCount === 1 ? "task" : "tasks"
                }.`,
            );
        } catch (error) {
            console.error("Error completing import:", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to import tasks. Please try again.";
            Alert.alert("Import Failed", message);
        } finally {
            setIsImporting(false);
        }
    }, [addTask, closeImportModal, pendingImportTasks]);

    const openResetModal = React.useCallback(() => {
        setShowResetModal(true);
    }, []);

    const closeResetModal = React.useCallback(() => {
        setShowResetModal(false);
        setResetConfirmText("");
    }, []);

    const handleConfirmReset = React.useCallback(async () => {
        try {
            await AsyncStorage.clear();

            closeResetModal();

            Alert.alert(
                "Data Reset Complete",
                "All data has been cleared. The app will now reload.",
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            if (Updates.isEnabled) {
                                try {
                                    await Updates.reloadAsync();
                                } catch (error) {
                                    console.error("Error reloading app:", error);
                                    Alert.alert(
                                        "Restart Required",
                                        "Please close and reopen the app to complete the reset.",
                                    );
                                }
                            } else {
                                Alert.alert(
                                    "Restart Required",
                                    "Please close and reopen the app to complete the reset.",
                                );
                            }
                        },
                    },
                ],
            );
        } catch (error) {
            console.error("Error resetting data:", error);
            Alert.alert("Error", "Failed to reset data. Please try again.");
        }
    }, [closeResetModal]);

    return {
        activeTheme,
        colors,
        sortingChevronRotation,
        showSortingOptions,
        toggleSortingOptions,
        hapticsEnabled,
        setHapticsEnabled,
        soundsEnabled,
        setSoundsEnabled,
        completedTasksCount,
        exportStats,
        hasStoragePermission,
        requestStoragePermission,
        openClearCompletedModal,
        closeClearModal,
        showClearModal,
        confirmClearCompleted,
        openExportModal,
        closeExportModal,
        showExportModal,
        handleExportConfirm,
        isExporting,
        openImportPicker,
        closeImportModal,
        showImportModal,
        handleImportConfirm,
        importStats,
        pendingImportTasks,
        isImporting,
        resetConfirmText,
        setResetConfirmText,
        openResetModal,
        closeResetModal,
        showResetModal,
        handleConfirmReset,
    };
};

