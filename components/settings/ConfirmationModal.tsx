import React from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import {
    BorderRadius,
    Colors,
    Spacing,
    Typography,
} from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { hexWithAlpha } from "@/utils/color";

type ThemeColors = typeof Colors.light;

export interface ConfirmationModalProps {
    visible: boolean;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    iconColor: string;
    title: string;
    description: React.ReactNode;
    confirmLabel: string;
    cancelLabel?: string;
    confirmVariant?: "primary" | "danger";
    confirmLoading?: boolean;
    confirmDisabled?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    colors: ThemeColors;
    children?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    icon,
    iconColor,
    title,
    description,
    confirmLabel,
    cancelLabel = "Cancel",
    confirmVariant = "primary",
    confirmLoading = false,
    confirmDisabled = false,
    onConfirm,
    onCancel,
    colors,
    children,
}) => {
    const iconBadgeColor = hexWithAlpha(iconColor, 0.14);
    const { activeTheme } = useTheme();
    const confirmButtonStyles = [
        styles.modalButton,
        confirmVariant === "danger"
            ? styles.modalDangerButton
            : [
                styles.modalPrimaryButton,
                {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                },
            ],
        (confirmDisabled || confirmLoading) && { opacity: 0.7 },
    ];

    const descriptionContent =
        typeof description === "string" ? (
            <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                {description}
            </ThemedText>
        ) : (
            description
        );

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <BlurView
                pointerEvents="box-none"
                intensity={80}
                tint={activeTheme === "dark" ? "dark" : "light"}
                style={styles.modalOverlay}
            >
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <View style={styles.modalTopRow}>
                        <View
                            style={[
                                styles.modalIconBadge,
                                { backgroundColor: iconBadgeColor },
                            ]}
                        >
                            <Ionicons name={icon} size={28} color={iconColor} />
                        </View>
                        <Pressable
                            style={[
                                styles.modalCloseButton,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                },
                            ]}
                            onPress={onCancel}
                            hitSlop={10}
                        >
                            <Ionicons name="close" size={18} color={colors.text} />
                        </Pressable>
                    </View>

                    <ThemedText
                        style={[
                            Typography.h3,
                            styles.modalTitle,
                            { color: colors.text },
                        ]}
                    >
                        {title}
                    </ThemedText>

                    <View style={styles.modalBody}>
                        {descriptionContent}
                        {children}
                    </View>

                    <View style={styles.modalFooter}>
                        <Pressable
                            style={[
                                styles.modalButton,
                                styles.modalSecondaryButton,
                                { borderColor: colors.border },
                            ]}
                            onPress={onCancel}
                        >
                            <ThemedText
                                style={[
                                    Typography.body,
                                    { fontWeight: "600", color: colors.text },
                                ]}
                            >
                                {cancelLabel}
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            disabled={confirmDisabled || confirmLoading}
                            style={confirmButtonStyles}
                            onPress={onConfirm}
                        >
                            {confirmLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <ThemedText
                                    style={[
                                        Typography.body,
                                        { fontWeight: "600", color: "#FFFFFF" },
                                    ]}
                                >
                                    {confirmLabel}
                                </ThemedText>
                            )}
                        </Pressable>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.lg,
    },
    modalContent: {
        width: "100%",
        maxWidth: 420,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        gap: Spacing.md,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
    },
    modalTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalIconBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalTitle: {
        textAlign: "left",
    },
    modalBody: {
        paddingTop: Spacing.md,
    },
    modalFooter: {
        flexDirection: "row",
        gap: Spacing.md,
        marginTop: Spacing.lg,
    },
    modalButton: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: "center",
        justifyContent: "center",
    },
    modalPrimaryButton: {
        elevation: 3,
        shadowOpacity: 0.14,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    modalSecondaryButton: {
        borderWidth: 1.2,
        backgroundColor: "transparent",
    },
    modalDangerButton: {
        backgroundColor: "#FF3B30",
        elevation: 3,
        shadowColor: "#FF3B30",
        shadowOpacity: 0.45,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
});

