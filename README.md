# Task Manager

<div align="center">
  <img src="./assets/images/icon.png" width="120" alt="Task Manager icon" />
  <p><strong>Chapter One</strong> productivity app powered by Expo + React Native (bare workflow).</p>
</div>

---

## Overview

Task Manager is a cross-platform application showcasing a production-ready Expo stack with TypeScript, rich text capabilities, attachments, analytics, and a polished settings experience. The codebase has been refactored into composable feature modules (task editor, statistics, settings) while keeping Expo Router’s developer experience.

---

## Feature Highlights

- **Rich editor**: Markdown/HTML conversion, embedded images/files, priorities, due dates, haptics.
- **Statistics dashboard**: Aggregated KPIs with charts and animated counters.
- **Theme-aware UI**: Centralized design tokens + dark/light mode.
- **Power user controls**: Task filters, quick add form, advanced settings (import/export, reset, preferences).
- **Offline-friendly**: Local state via Zustand/custom hooks, ready for persistence.
- **Expo Router tabs**: `Home`, `Statistics`, `Settings` with custom headers.

---

## Tech Stack

| Layer          | Tools                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Framework      | Expo SDK 54 · React Native 0.81 · React 19                            |
| Language       | TypeScript                                                            |
| Navigation     | Expo Router (file-based tabs)                                         |
| State/Data     | Zustand + custom hooks + contexts                                     |
| UI/UX          | Expo design tokens, Expo Haptics, custom components                   |
| Charts         | `react-native-gifted-charts`                                          |
| Rich Text      | `react-native-pell-rich-editor`, markdown utils                       |
| Build          | Bare workflow (`android/`, `ios/` committed)                          |
| Package mgr    | Bun (`bun.lock`)                                                      |

---

## Directory Layout

```
task-manager/
├─ app/                       # Expo Router entry points
│  └─ (tabs)/                 # Tab screens (index, statistics, settings)
├─ components/
│  ├─ tasks/                  # Task UI (TaskList, TaskItem, TaskTextEditor, etc.)
│  ├─ statistics/             # Stats dashboard widgets
│  ├─ settings/               # Settings screen components (ThemeSelector, etc.)
│  └─ ui/                     # Reusable primitives (DateTimeSelector, Skeleton)
├─ contexts/                  # Global contexts (Theme, Preferences, Statistics)
├─ hooks/                     # Custom hooks (useAddTaskForm, useSettingsScreen, ...)
├─ constants/                 # Theme tokens, spacing, typography
├─ utils/                     # Helpers (date/time, rich text conversion, icons)
├─ android/                   # Bare Android project (Gradle)
├─ ios/                       # Bare iOS project (Xcode)
└─ assets/images/             # Icons, splash, branding
```

---

## Environment Setup

### Prerequisites

- **Node.js ≥ 18** (Bun ships with Node for tooling).
- **Bun ≥ 1.2** – `curl -fsSL https://bun.sh/install | bash`.
- **Expo CLI** – invoked via `bunx expo ...` (no global install needed).
- **Java 17** – Gradle 8 / React Native 0.81 require JDK 17.
- **Android SDK** – for native builds/emulators.
- **Xcode 15+** (macOS) for iOS builds.

### Install Dependencies

```bash
bun install
```

> Remove any `package-lock.json`/`yarn.lock` files so Expo Doctor only detects `bun.lock`.

### Start the Dev Server

```bash
bunx expo start
```

Use the Expo CLI shortcuts:

| Key | Action                     |
| --- | -------------------------- |
| `a` | Launch Android emulator    |
| `i` | Launch iOS simulator       |
| `w` | Open in browser (web)      |
| `r` | Reload bundler             |

### Lint

```bash
bun run lint
```

ESLint is configured via `eslint-config-expo` with TypeScript support.

---

## Bare Workflow Requirements

Because the repository includes `android/` and `ios/`, Expo Doctor warns that fields in `app.json` (icon, scheme, orientation, etc.) are not auto-synced. Keep the native projects in sync manually whenever you change those values.

### Java

```bash
sudo pacman -S jdk17-openjdk            # Example for Arch
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH="$JAVA_HOME/bin:$PATH"
```

### Android SDK (command-line)

```bash
mkdir -p "$HOME/Android/Sdk"
cd "$HOME/Android/Sdk"
curl -O https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-*.zip -d cmdline-tools
mv cmdline-tools/cmdline-tools cmdline-tools/latest

export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

sdkmanager --install \
  "cmdline-tools;latest" \
  "platform-tools" \
  "platforms;android-36" \
  "build-tools;36.0.0" \
  "ndk;27.1.12297006" \
  "extras;android;m2repository" \
  "extras;google;m2repository"

yes | sdkmanager --licenses
```

Update `android/local.properties` with `sdk.dir=/home/<user>/Android/Sdk` if needed.

### iOS (optional)

```bash
cd ios
pod install
```

Set bundle identifiers and icons in Xcode (`Runner` target) so they match `app.json` (`com.d7om.tasks`).

---

## Production Checklist

- [x] `bun install` with Expo versions aligned (`expo-doctor` clean except bare warning).
- [x] `bun run lint` passes.
- [ ] Android build succeeds: `npx eas build --local --profile preview` (requires JAVA_HOME + ANDROID_HOME configured).
- [ ] iOS build (macOS): `npx eas build --platform ios`.
- [ ] Native icons/splash updated alongside `app.json` references.
- [ ] Bundle/package identifiers match between `app.json`, Android `AndroidManifest.xml`, and iOS `Info.plist`.

---

## Common Workflows

| Task                    | Command / Location                                             |
| ----------------------- | -------------------------------------------------------------- |
| Start dev server        | `bunx expo start`                                              |
| Run Android build       | `bunx expo run:android`                                        |
| Run iOS build           | `bunx expo run:ios` (macOS)                                    |
| Run web                 | `bunx expo start --web`                                        |
| Lint                    | `bun run lint`                                                 |
| Dependency health       | `bunx expo-doctor`                                             |
| Upgrade deps            | `bunx expo install --check`                                    |
| Local EAS build         | `npx eas-cli-local-build-plugin ...` (requires native toolchain)|

---

## Architecture Notes

- **Custom hooks everywhere**: `useTaskEditorState`, `useAddTaskForm`, `useSettingsScreen`, `useStatistics` keep side effects out of components.
- **Context + derived data**: `StatisticsContext` memoizes counts for charts and KPI cards.
- **Modular task editor**: Header, toolbar, attachments, options, footer split into dedicated subcomponents under `components/tasks/task-text-editor/`.
- **Design system**: `constants/theme.ts` exposes color palettes, spacing, typography, reused throughout with dark/light mode support.
- **Icons & branding**: All assets live in `assets/images/` (icon, adaptive icon, splash). Update both `app.json` and native asset catalogs when branding changes.

---

## Extending the App

| Goal                               | Where to start                                                         |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Persist tasks remotely             | Replace local Zustand store in `hooks/useTasks.ts` with API integration|
| Push notifications / reminders     | Hook into due dates from `useAddTaskForm` + Expo Notifications module   |
| Custom analytics                   | Extend `contexts/StatisticsContext.tsx` and `components/statistics/*`  |
| Additional settings                | Add sections in `components/settings/` and surface via `useSettingsScreen`|
| Theming / rebranding               | Update `constants/theme.ts` + replace assets in `assets/images/`       |

---

## Known Warnings

- **Expo Doctor – "app config fields may not be synced"**: expected because we commit native folders; keep configs in sync manually.
- **Gradle "Unsupported class file major version 69"**: indicates JDK < 17; set `JAVA_HOME` to JDK 17.
- **Kotlin `targetSdk` deprecation**: emitted by Expo modules, harmless until Expo updates.

---

## Contributing

1. Fork / branch from `main`.
2. Run `bun install` and `bun run lint`.
3. Document native configuration changes in PR descriptions.
4. Submit a pull request with testing notes (Expo platform used, lint results, build status).

---

## License

[MIT](LICENSE) © d7om · Use freely, adapt, and share improvements. Contributions are welcome!
