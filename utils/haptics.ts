import * as Haptics from "expo-haptics";

// Global flag to track haptics preference
// This will be set by the PreferencesContext
let hapticsEnabled = true;

/**
 * Sets the global haptics enabled state
 * Should be called by PreferencesContext when the preference changes
 */
export const setHapticsGlobalState = (enabled: boolean) => {
  hapticsEnabled = enabled;
};

/**
 * Gets the current haptics enabled state
 */
export const getHapticsEnabled = (): boolean => {
  return hapticsEnabled;
};

/**
 * Triggers a haptic feedback if haptics are enabled in preferences
 * @param type - The type of haptic feedback to trigger
 */
export const triggerHaptic = async (
  type:
    | "light"
    | "medium"
    | "heavy"
    | "success"
    | "warning"
    | "error" = "light",
): Promise<void> => {
  if (!hapticsEnabled) {
    return;
  }

  try {
    switch (type) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        break;
      case "warning":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        );
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch (error) {
    // Silently fail if haptics are not available on the device
    console.debug("Haptic feedback not available:", error);
  }
};

/**
 * Triggers a selection change haptic (for pickers, switches, etc.)
 */
export const triggerSelectionHaptic = async (): Promise<void> => {
  if (!hapticsEnabled) {
    return;
  }

  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.debug("Haptic feedback not available:", error);
  }
};
