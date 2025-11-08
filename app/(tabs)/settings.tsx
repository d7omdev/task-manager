import React from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { BorderRadius, Shadows, Spacing, Typography } from "@/constants/theme";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";
import ThemeSelector from "@/components/settings/ThemeSelector";
import SortingSelector from "@/components/settings/SortingSelector";
import { ConfirmationModal } from "@/components/settings/ConfirmationModal";
import { hexWithAlpha } from "@/utils/color";
import { useSettingsScreen } from "../../hooks/useSettingsScreen";

export default function SettingsScreen() {
  const {
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
  } = useSettingsScreen();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <ThemedText style={[Typography.h2, styles.title]}>
            Settings
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            Customize your experience
          </ThemedText>
        </View>

        {/* Appearance Section */}
        <SettingSection title="Appearance">
          <ThemeSelector />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <View
            style={[
              styles.accordionCard,
              {
                backgroundColor: colors.cardSecondary,
                borderColor: hexWithAlpha(
                  colors.border,
                  activeTheme === "dark" ? 0.55 : 0.35,
                ),
              },
            ]}
          >
            <Pressable
              onPress={toggleSortingOptions}
              style={styles.accordionHeader}
            >
              <View style={styles.accordionText}>
                <ThemedText
                  style={[Typography.bodyBold, { color: colors.text }]}
                >
                  Sort Tasks
                </ThemedText>
                <ThemedText
                  style={[
                    Typography.caption,
                    styles.accordionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Choose the default order for your task list
                </ThemedText>
              </View>
              <Animated.View
                style={[
                  styles.accordionChevron,
                  {
                    borderColor: hexWithAlpha(colors.border, 0.5),
                    backgroundColor: colors.card,
                    transform: [{ rotate: sortingChevronRotation }],
                  },
                ]}
              >
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={colors.textSecondary}
                />
              </Animated.View>
            </Pressable>
            {showSortingOptions && (
              <View
                style={[
                  styles.accordionContent,
                  { borderTopColor: hexWithAlpha(colors.border, 0.35) },
                ]}
              >
                <SortingSelector />
              </View>
            )}
          </View>

          <SettingRow
            icon="notifications-outline"
            label="Haptic Feedback"
            rightElement={
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
            }
          />
          {/* <SettingRow */}
          {/*   icon="volume-medium-outline" */}
          {/*   label="Sound Effects" */}
          {/*   rightElement={ */}
          {/*     <Switch */}
          {/*       value={soundsEnabled} */}
          {/*       onValueChange={setSoundsEnabled} */}
          {/*       trackColor={{ false: colors.border, true: colors.primary }} */}
          {/*       thumbColor={colors.card} */}
          {/*     /> */}
          {/*   } */}
          {/* /> */}
        </SettingSection>

        {/* Data Management Section */}
        <SettingSection title="Data Management">
          <SettingRow
            icon="trash-outline"
            label="Clear Completed Tasks"
            onPress={openClearCompletedModal}
            showChevron
          />
          {Platform.OS === "android" && !hasStoragePermission && (
            <SettingRow
              icon="lock-open-outline"
              label="Grant Storage Access"
              onPress={requestStoragePermission}
              showChevron
            />
          )}
          <SettingRow
            icon="cloud-upload-outline"
            label="Import Tasks"
            onPress={openImportPicker}
            showChevron
          />
          <SettingRow
            icon="download-outline"
            label="Export Tasks"
            onPress={openExportModal}
            showChevron
          />
          <SettingRow
            icon="warning-outline"
            label="Reset All Data"
            onPress={openResetModal}
            showChevron
            danger
          />
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <SettingRow
            icon="information-circle-outline"
            label="Version"
            value="1.0.0"
          />
        </SettingSection>

        <View style={styles.footer}>
          <ThemedText
            style={[
              Typography.caption,
              { color: colors.textSecondary, textAlign: "center" },
            ]}
          >
            Made with React Native & Expo
          </ThemedText>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showClearModal}
        icon="trash-outline"
        iconColor="#FF9F0A"
        title="Clear Completed Tasks"
        description={`Remove ${completedTasksCount} completed ${completedTasksCount === 1 ? "task" : "tasks"} from your list? This action cannot be undone.`}
        confirmLabel="Clear"
        confirmVariant="danger"
        onCancel={closeClearModal}
        onConfirm={confirmClearCompleted}
        colors={colors}
      />

      <ConfirmationModal
        visible={showImportModal}
        icon="cloud-upload-outline"
        iconColor={colors.primary}
        title="Import Tasks"
        description={
          <ThemedText
            style={[Typography.body, { color: colors.textSecondary }]}
          >
            {`Import ${importStats.valid} of ${importStats.total} ${importStats.total === 1 ? "task" : "tasks"} from the selected file?`}
          </ThemedText>
        }
        confirmLabel="Import"
        confirmVariant="primary"
        confirmLoading={isImporting}
        confirmDisabled={pendingImportTasks.length === 0}
        onCancel={closeImportModal}
        onConfirm={handleImportConfirm}
        colors={colors}
      >
        <ThemedText
          style={[Typography.caption, { color: colors.textSecondary }]}
        >
          Tasks without text are skipped automatically. Attachments are not
          imported.
        </ThemedText>
        {importStats.total !== importStats.valid && (
          <ThemedText
            style={[
              Typography.caption,
              { color: "#FF9F0A", marginTop: Spacing.xs },
            ]}
          >
            {`${importStats.total - importStats.valid} task entries were skipped due to missing text.`}
          </ThemedText>
        )}
      </ConfirmationModal>

      <ConfirmationModal
        visible={showExportModal}
        icon="download-outline"
        iconColor={colors.primary}
        title="Export Tasks"
        description={
          <ThemedText
            style={[Typography.body, { color: colors.textSecondary }]}
          >
            {`Export ${exportStats.total} ${exportStats.total === 1 ? "task" : "tasks"} (${exportStats.active} active • ${exportStats.completed} completed) as a JSON file?`}
          </ThemedText>
        }
        confirmLabel="Export"
        confirmVariant="primary"
        confirmLoading={isExporting}
        onCancel={closeExportModal}
        onConfirm={handleExportConfirm}
        colors={colors}
      >
        <ThemedText
          style={[
            Typography.caption,
            { color: colors.textSecondary, marginTop: Spacing.md },
          ]}
        >
          The exported file will be saved temporarily and shared through your
          system share sheet.
        </ThemedText>
      </ConfirmationModal>

      <ConfirmationModal
        visible={showResetModal}
        icon="warning"
        iconColor="#FF3B30"
        title="Confirm Reset"
        description={
          <>
            <ThemedText
              style={[
                Typography.body,
                { color: colors.textSecondary, marginBottom: Spacing.md },
              ]}
            >
              This action is irreversible. All your tasks and preferences will
              be permanently deleted.
            </ThemedText>
            <ThemedText style={[Typography.body, { marginBottom: Spacing.sm }]}>
              Type{" "}
              <ThemedText style={{ fontWeight: "700", color: colors.text }}>
                RESET
              </ThemedText>{" "}
              to confirm:
            </ThemedText>
          </>
        }
        confirmLabel="Reset All Data"
        confirmVariant="danger"
        confirmDisabled={resetConfirmText.toUpperCase() !== "RESET"}
        onCancel={closeResetModal}
        onConfirm={handleConfirmReset}
        colors={colors}
      >
        <TextInput
          style={[
            styles.confirmInput,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={resetConfirmText}
          onChangeText={setResetConfirmText}
          placeholder="Type RESET"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </ConfirmationModal>
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
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  footer: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  accordionCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: Spacing.xs,
    ...Shadows.small,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  accordionText: {
    flex: 1,
  },
  accordionSubtitle: {
    marginTop: Spacing.xs,
  },
  accordionChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  accordionContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
  },
  confirmInput: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    fontWeight: "600",
  },
});
