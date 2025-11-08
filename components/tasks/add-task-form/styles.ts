import { StyleSheet } from "react-native";

import { BorderRadius, Shadows, Spacing } from "@/constants/theme";

export const addTaskFormStyles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        position: "relative",
    },
    containerWithAttachments: {
        paddingTop: Spacing.xl,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
        minHeight: 60,
    },
    inputWrapperExpanded: {
        paddingVertical: Spacing.md,
        minHeight: 140,
    },
    inputWrapperWithAttachments: {
        marginTop: Spacing.lg,
    },
    expandButton: {
        padding: Spacing.xs,
        marginTop: 2,
    },
    inputPressable: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 48,
        paddingVertical: Spacing.xs,
    },
    inputContainer: {
        flex: 1,
        gap: Spacing.xs,
    },
    input: {
        fontSize: 16,
        paddingVertical: Spacing.xs,
    },
    dueDateDisplay: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    dueDateButton: {
        padding: Spacing.xs,
    },
    pressed: {
        opacity: 0.7,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: BorderRadius.lg,
        borderTopRightRadius: BorderRadius.lg,
        paddingBottom: Spacing.xl,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
    },
    modalBody: {
        padding: Spacing.lg,
    },
    actionButtons: {
        flexDirection: "row",
        gap: Spacing.xs,
    },
    attachmentButton: {
        padding: Spacing.xs,
    },
    attachmentsFloatingWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        top: Spacing.xs,
        paddingHorizontal: Spacing.md,
        zIndex: 20,
    },
    attachmentsFloating: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs / 2,
        ...Shadows.small,
    },
    attachmentsContainer: {
        height: 30,
    },
    attachmentsContent: {
        gap: Spacing.xs,
        paddingRight: Spacing.md,
        alignItems: "center",
    },
    attachmentBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs / 2,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        maxWidth: 200,
    },
    removeBadgeButton: {
        padding: 2,
        marginLeft: 2,
    },
});

