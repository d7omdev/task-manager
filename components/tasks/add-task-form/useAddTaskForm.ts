import { useCallback, useMemo, useState } from "react";
import { Alert, Keyboard, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import { htmlToPlainText } from "@/utils/richText";
import { TaskAttachment } from "@/types/task";

import type { AddTaskHandler } from "./types";

interface UseAddTaskFormParams {
    onAddTask: AddTaskHandler;
}

export const useAddTaskForm = ({ onAddTask }: UseAddTaskFormParams) => {
    const [text, setText] = useState("");
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [dueTime, setDueTime] = useState<string | undefined>();
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [showDateTimeModal, setShowDateTimeModal] = useState(false);
    const [showTextEditor, setShowTextEditor] = useState(false);
    const [attachments, setAttachments] = useState<TaskAttachment[]>([]);

    const plainPreview = useMemo(() => htmlToPlainText(text), [text]);
    const hasText = plainPreview.trim().length > 0;
    const hasAttachments = attachments.length > 0;

    const triggerHaptic = useCallback(async (style: Haptics.ImpactFeedbackStyle) => {
        if (Platform.OS === "web") return;
        try {
            await Haptics.impactAsync(style);
        } catch {
            // ignore haptic failures
        }
    }, []);

    const handleAddImage = useCallback(async (): Promise<TaskAttachment | undefined> => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission Required",
                    "Please grant camera roll permissions to add images.",
                );
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
                    type: "image",
                    size: asset.fileSize,
                    contentUri,
                };
                setAttachments((prev) => [...prev, newAttachment]);
                await triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                return newAttachment;
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image. Please try again.");
        }

        return undefined;
    }, [triggerHaptic]);

    const handleAddFile = useCallback(async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const newAttachment: TaskAttachment = {
                    id: Date.now().toString(),
                    uri: asset.uri,
                    name: asset.name,
                    type: "file",
                    size: asset.size,
                };
                setAttachments((prev) => [...prev, newAttachment]);
                await triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
            }
        } catch (error) {
            console.error("Error picking file:", error);
            Alert.alert("Error", "Failed to pick file. Please try again.");
        }
    }, [triggerHaptic]);

    const handleRemoveAttachment = useCallback(
        (id: string) => {
            setAttachments((prev) => prev.filter((att) => att.id !== id));
            void triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        },
        [triggerHaptic],
    );

    const resetForm = useCallback(() => {
        setText("");
        setDueDate(undefined);
        setDueTime(undefined);
        setPriority("medium");
        setAttachments([]);
    }, []);

    const handleSubmit = useCallback(() => {
        if (!hasText) {
            return;
        }

        void triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        onAddTask(text, {
            dueDate: dueDate ? dueDate.toISOString() : null,
            dueTime: dueTime || null,
            priority,
            attachments: attachments.length > 0 ? attachments : undefined,
        });

        resetForm();
        Keyboard.dismiss();
    }, [attachments, dueDate, dueTime, hasText, onAddTask, priority, resetForm, text, triggerHaptic]);

    const handleSetDueDate = useCallback(() => {
        void triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        setShowDateTimeModal(true);
    }, [triggerHaptic]);

    const handleCloseDateTimeModal = useCallback(() => {
        setShowDateTimeModal(false);
    }, []);

    const handleDateChange = useCallback((date: Date) => {
        setDueDate(date);
    }, []);

    const handleTimeChange = useCallback((time: string) => {
        setDueTime(time);
    }, []);

    const handleClearDueDate = useCallback(() => {
        void triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        setDueDate(undefined);
        setDueTime(undefined);
    }, [triggerHaptic]);

    const handleEditorOpen = useCallback(() => {
        void triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        setShowTextEditor(true);
    }, [triggerHaptic]);

    const handleEditorClose = useCallback(() => {
        setShowTextEditor(false);
    }, []);

    const handleEditorSubmit = useCallback(() => {
        setShowTextEditor(false);
        handleSubmit();
    }, [handleSubmit]);

    return {
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
    };
};

