import { StyleSheet } from "react-native";
import {
  BorderRadius,
  Shadows,
  Spacing,
} from "@/constants/theme";

export const taskTextEditorStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  editorContent: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Shadows.large,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
  },
  toolbarLeft: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
    flex: 1,
  },
  nativeToolbar: {
    flex: 1,
    backgroundColor: "transparent",
  },
  nativeToolbarWrapper: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  toolbarRight: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  toolbarButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    ...Shadows.small,
  },
  attachmentsSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    maxHeight: 120,
  },
  attachmentsScroll: {
    flexGrow: 0,
  },
  attachmentsScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
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
  optionsCard: {
    borderWidth: 1,
    overflow: "hidden",
    ...Shadows.small,
  },
  optionsHeaderText: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    // paddingVertical: Spacing.md,
    // gap: Spacing.xs,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  optionHeaderIcon: {
    marginRight: Spacing.xs / 2,
  },
  optionsSubtitle: {
    marginTop: Spacing.xs,
  },
  optionsBody: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: 1,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  dueDateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  setButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  prioritySection: {
    marginTop: Spacing.xs,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    minHeight: 360,
    paddingBottom: Spacing.xl * 2,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    textAlignVertical: "top",
    minHeight: 320,
    paddingBottom: Spacing.xl * 2,
  },
  richTextInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    minHeight: 320,
    paddingBottom: Spacing.xl * 2,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    alignItems: "center",
  },
});

