import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { actions } from "react-native-pell-rich-editor";

type IconRenderer = ({ tintColor }: { tintColor?: string }) => JSX.Element;

export const createNativeIconMap = (defaultColor: string): Record<string, IconRenderer> => ({
  [actions.setBold]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-bold"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.setItalic]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-italic"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.setUnderline]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-underline"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.setStrikethrough]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-strikethrough"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.heading1]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-header-1"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.heading2]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-header-2"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.heading3]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-header-3"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.insertBulletsList]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-list-bulleted"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.insertOrderedList]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-list-numbered"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.blockquote]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="format-quote-close"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.insertImage]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="image-plus"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
  [actions.code]: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="code-tags"
      size={22}
      color={tintColor ?? defaultColor}
    />
  ),
});

