// Global flag to track sounds preference
// This will be set by the PreferencesContext
let soundsEnabled = true;

/**
 * Sets the global sounds enabled state
 * Should be called by PreferencesContext when the preference changes
 */
export const setSoundsGlobalState = (enabled: boolean) => {
  soundsEnabled = enabled;
};

/**
 * Gets the current sounds enabled state
 */
export const getSoundsEnabled = (): boolean => {
  return soundsEnabled;
};

/**
 * Sound types that can be played in the app
 */
export type SoundType = 'complete' | 'delete' | 'add' | 'success' | 'error';

/**
 * Plays a sound effect if sounds are enabled in preferences
 * @param soundType - The type of sound to play
 *
 * TODO: Implement sound playback using expo-av
 * This will require:
 * 1. Installing expo-av: npx expo install expo-av
 * 2. Adding sound files to assets/sounds/ directory
 * 3. Loading sounds with Audio.Sound.createAsync()
 * 4. Playing sounds with sound.playAsync()
 */
export const playSound = async (soundType: SoundType): Promise<void> => {
  if (!soundsEnabled) {
    return;
  }

  // TODO: Implement sound playback
  // Example implementation:
  // const { sound } = await Audio.Sound.createAsync(
  //   require(`@/assets/sounds/${soundType}.mp3`)
  // );
  // await sound.playAsync();
  // sound.unloadAsync(); // Clean up after playing

  console.debug(`[Sound] Would play sound: ${soundType} (not implemented yet)`);
};

/**
 * Preloads sound files for faster playback
 * Should be called during app initialization
 *
 * TODO: Implement sound preloading
 */
export const preloadSounds = async (): Promise<void> => {
  if (!soundsEnabled) {
    return;
  }

  // TODO: Implement sound preloading
  // Example implementation:
  // const soundFiles = ['complete', 'delete', 'add', 'success', 'error'];
  // await Promise.all(
  //   soundFiles.map(async (file) => {
  //     const { sound } = await Audio.Sound.createAsync(
  //       require(`@/assets/sounds/${file}.mp3`)
  //     );
  //     soundCache.set(file, sound);
  //   })
  // );

  console.debug('[Sound] Sound preloading not implemented yet');
};

/**
 * Cleans up and unloads all preloaded sounds
 * Should be called when the app is closing or sounds are disabled
 *
 * TODO: Implement sound cleanup
 */
export const unloadSounds = async (): Promise<void> => {
  // TODO: Implement sound cleanup
  // Example implementation:
  // for (const sound of soundCache.values()) {
  //   await sound.unloadAsync();
  // }
  // soundCache.clear();

  console.debug('[Sound] Sound cleanup not implemented yet');
};
