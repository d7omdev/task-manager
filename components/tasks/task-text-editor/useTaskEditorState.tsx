import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, LayoutAnimation, Platform, TextInput, UIManager } from "react-native";
import {
    RichEditor,
    RichToolbar,
    actions,
} from "react-native-pell-rich-editor";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

import {
    ensureHtmlContent,
    htmlToMarkdown,
    markdownToHtml,
} from "@/utils/richText";
import { TaskAttachment } from "@/types/task";
import { taskTextEditorStyles } from "./styles";
import { createNativeIconMap } from "./createNativeIconMap";

interface TaskEditorColors {
    background: string;
    border: string;
    card: string;
    cardSecondary?: string;
    primary: string;
    text: string;
    textSecondary: string;
}

interface UseTaskEditorStateParams {
    attachments?: TaskAttachment[];
    colors: TaskEditorColors;
    dueDate?: Date;
    dueTime?: string;
    isDarkMode: boolean;
    onAddImage?: () => Promise<TaskAttachment | undefined>;
    onRemoveAttachment?: (id: string) => void;
    onTextChange: (html: string) => void;
    priority?: "low" | "medium" | "high";
    screenHeight: number;
    text: string;
    visible: boolean;
}

interface UseTaskEditorStateResult {
    effectiveAttachments: TaskAttachment[];
    editorContentCSS: string;
    editorHtml: string;
    fallbackValue: string;
    handleEditorBlur: () => void;
    handleEditorFocus: () => void;
    handleEditorInitialized: () => void;
    handleNativeContentChange: (html: string) => void;
    handleRemoveAttachmentInternal: (id: string) => void;
    handleToggleOptions: () => void;
    isCompactHeight: boolean;
    isRichEditorAvailable: boolean;
    richEditorRef: React.MutableRefObject<RichEditor | null>;
    richToolbarElement: React.ReactNode | undefined;
    showOptions: boolean;
    textInputRef: React.MutableRefObject<TextInput | null>;
    triggerHaptic: () => void;
    updateFallbackMarkdown: (markdown: string) => void;
}

export const useTaskEditorState = ({
    attachments = [],
    colors,
    dueDate,
    dueTime,
    isDarkMode,
    onAddImage,
    onRemoveAttachment,
    onTextChange,
    priority = "medium",
    screenHeight,
    text,
    visible,
}: UseTaskEditorStateParams): UseTaskEditorStateResult => {
    const textInputRef = useRef<TextInput>(null);
    const richEditorRef = useRef<RichEditor | null>(null);
    const isEditorFocusedRef = useRef(false);

    const [fallbackValue, setFallbackValue] = useState(() =>
        htmlToMarkdown(text),
    );
    const [editorHtml, setEditorHtml] = useState(() => ensureHtmlContent(text));
    const [localAttachments, setLocalAttachments] = useState<TaskAttachment[]>([]);

    const [showOptions, setShowOptions] = useState(() =>
        Boolean(dueDate || dueTime || priority !== "medium"),
    );

    const isRichEditorAvailable = useMemo(() => Platform.OS !== "web", []);
    const isCompactHeight = screenHeight < 760;

    useEffect(() => {
        if (
            Platform.OS === "android" &&
            UIManager.setLayoutAnimationEnabledExperimental
        ) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    useEffect(() => {
        if (isRichEditorAvailable) {
            const normalized = ensureHtmlContent(text);
            setEditorHtml(normalized);

            if (visible && richEditorRef.current && !isEditorFocusedRef.current) {
                try {
                    richEditorRef.current.setContentHTML(normalized);
                } catch {
                    // no-op
                }
            }
        } else {
            const nextMarkdown = htmlToMarkdown(text);
            setFallbackValue((prev) => (prev === nextMarkdown ? prev : nextMarkdown));
        }
    }, [text, isRichEditorAvailable, visible]);

    useEffect(() => {
        if (dueDate || dueTime || priority !== "medium") {
            setShowOptions(true);
        }
    }, [dueDate, dueTime, priority]);

    useEffect(() => {
        if (!visible) {
            if (isRichEditorAvailable) {
                richEditorRef.current?.dismissKeyboard?.();
            } else {
                textInputRef.current?.blur?.();
            }
        }
    }, [isRichEditorAvailable, visible]);

    useEffect(() => {
        if (!isRichEditorAvailable && visible) {
            const timeout = setTimeout(() => textInputRef.current?.focus(), 60);
            return () => clearTimeout(timeout);
        }
        return undefined;
    }, [isRichEditorAvailable, visible]);

    const triggerHaptic = useCallback(() => {
        if (Platform.OS === "web") return;
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const updateFallbackMarkdown = useCallback(
        (newMarkdown: string) => {
            setFallbackValue(newMarkdown);
            const htmlOutput = markdownToHtml(newMarkdown);
            onTextChange(htmlOutput);
        },
        [onTextChange],
    );

    const nativeToolbarActions = useMemo(
        () => [
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.insertImage,
            actions.heading1,
            actions.heading2,
            actions.heading3,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.blockquote,
            actions.code,
        ],
        [],
    );

    const nativeIconMap = useMemo(
        () => createNativeIconMap(colors.text),
        [colors.text],
    );

    const handleNativeContentChange = useCallback(
        (html: string) => {
            setEditorHtml(html);
            onTextChange(html);
        },
        [onTextChange],
    );

    const pickImageLocally = useCallback(async (): Promise<TaskAttachment | undefined> => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission Required",
                    "Please grant photo library access to insert images in the editor.",
                );
                return undefined;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset?.uri) {
                    const generatedId = Date.now().toString();
                    const contentUri =
                        asset.base64 && asset.mimeType
                            ? `data:${asset.mimeType};base64,${asset.base64}`
                            : asset.base64
                                ? `data:image/jpeg;base64,${asset.base64}`
                                : undefined;
                    return {
                        id: generatedId,
                        uri: asset.uri,
                        name: asset.fileName ?? `image_${generatedId}.jpg`,
                        type: "image",
                        size: asset.fileSize,
                        contentUri,
                    };
                }
            }
        } catch (error) {
            console.error("Error inserting image into editor:", error);
            Alert.alert("Error", "Unable to insert image. Please try again.");
        }

        return undefined;
    }, []);

    const handleSelectImage = useCallback(async () => {
        triggerHaptic();

        let attachment: TaskAttachment | undefined;
        try {
            if (onAddImage) {
                attachment = await onAddImage();
            } else {
                attachment = await pickImageLocally();
            }
        } catch (error) {
            console.error("Error selecting image:", error);
            Alert.alert("Error", "Unable to insert image. Please try again.");
            return;
        }

        if (!attachment) {
            return;
        }

        const embedUri = attachment.contentUri ?? attachment.uri;
        if (!onAddImage) {
            setLocalAttachments((prev) => [...prev, attachment]);
        }

        const imageStyle =
            "width:180px;max-width:90%;height:auto;display:block;margin:16px auto;border-radius:12px;";

        if (isRichEditorAvailable) {
            richEditorRef.current?.focusContentEditor?.();
            requestAnimationFrame(() => {
                richEditorRef.current?.insertImage?.(embedUri, imageStyle);
            });
        } else {
            const markdownImage = `<img src="${embedUri}" alt="${attachment.name.replace(/"/g, "&quot;")}" style="${imageStyle}" />`;
            const nextValue = fallbackValue
                ? `${fallbackValue.trimEnd()}\n\n${markdownImage}`
                : markdownImage;
            updateFallbackMarkdown(nextValue);
        }
    }, [
        fallbackValue,
        isRichEditorAvailable,
        onAddImage,
        pickImageLocally,
        triggerHaptic,
        updateFallbackMarkdown,
    ]);

    const handleEditorInitialized = useCallback(() => {
        try {
            richEditorRef.current?.setContentHTML(editorHtml);
        } catch {
            // ignore
        }
    }, [editorHtml]);

    const handleToggleOptions = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        triggerHaptic();
        setShowOptions((prev) => !prev);
    }, [triggerHaptic]);

    const handleEditorFocus = useCallback(() => {
        isEditorFocusedRef.current = true;
    }, []);

    const handleEditorBlur = useCallback(() => {
        isEditorFocusedRef.current = false;
        onTextChange(editorHtml);
    }, [editorHtml, onTextChange]);

    const effectiveAttachments =
        attachments.length > 0 ? attachments : localAttachments;

    const handleRemoveAttachmentInternal = useCallback(
        (id: string) => {
            if (attachments.length > 0) {
                onRemoveAttachment?.(id);
            } else {
                setLocalAttachments((prev) => prev.filter((att) => att.id !== id));
            }
        },
        [attachments, onRemoveAttachment],
    );

    const editorContentCSS = useMemo(() => {
        const primary = colors.primary;
        const textColor = colors.text;
        const textSecondary = colors.textSecondary;
        const card = colors.card;
        const cardSecondary = colors.cardSecondary ?? colors.border;
        const border = colors.border;
        const codeBg = isDarkMode ? "#2E2E33" : cardSecondary;
        const inlineCodeBg = isDarkMode ? "#2E2E33" : "rgba(28,28,30,0.08)";
        return `
      :root {
        color-scheme: ${isDarkMode ? "dark" : "light"};
      }
      html, body {
        padding: 0;
        margin: 0;
        background-color: ${card};
        color: ${textColor};
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        font-size: 16px;
        padding-bottom: 280px;
      }
      p {
        margin: 0 0 12px;
      }
      h1, h2, h3 {
        margin: 16px 0 8px;
        font-weight: 700;
      }
      h1 { font-size: 26px; }
      h2 { font-size: 22px; }
      h3 { font-size: 20px; }
      ul, ol {
        padding-left: 24px;
        margin: 0 0 12px;
      }
      li {
        margin-bottom: 6px;
      }
      blockquote {
        border-left: 4px solid ${primary}55;
        margin: 16px 0;
        padding-left: 16px;
        color: ${textSecondary};
        font-style: italic;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 12px;
        display: block;
        margin: 16px auto;
      }
      pre {
        background-color: ${codeBg};
        color: ${textColor};
        padding: 14px;
        border-radius: 12px;
        overflow-x: auto;
        margin: 16px 0;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        border: 1px solid ${border};
      }
      code {
        background-color: ${inlineCodeBg};
        padding: 2px 6px;
        border-radius: 6px;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }
      strong, b {
        font-weight: 700;
      }
      em, i {
        font-style: italic;
      }
      u {
        text-decoration: underline;
      }
      span[style*="line-through"],
      s, del {
        text-decoration: line-through;
      }
      a {
        color: ${primary};
        text-decoration: underline;
      }
      hr {
        border: none;
        border-bottom: 1px solid ${border};
        margin: 24px 0;
      }
    `;
    }, [colors, isDarkMode]);

  const richToolbarElement = useMemo(() => {
    if (!isRichEditorAvailable) {
      return undefined;
    }

    return (
      <RichToolbar
        style={taskTextEditorStyles.nativeToolbar}
        editor={richEditorRef}
        getEditor={() => richEditorRef.current}
        actions={nativeToolbarActions}
        iconMap={nativeIconMap}
        selectedIconTint={colors.primary}
        iconTint={colors.textSecondary}
        disabledIconTint={`${colors.textSecondary}66`}
        onPressAddImage={handleSelectImage}
      />
    );
  }, [
    colors.primary,
    colors.textSecondary,
    handleSelectImage,
    isRichEditorAvailable,
    nativeIconMap,
    nativeToolbarActions,
  ]);

  return {
    effectiveAttachments,
    editorContentCSS,
    editorHtml,
    fallbackValue,
    handleEditorBlur,
    handleEditorFocus,
    handleEditorInitialized,
    handleNativeContentChange,
    handleRemoveAttachmentInternal,
    handleToggleOptions,
    isCompactHeight,
    isRichEditorAvailable,
    richEditorRef,
    richToolbarElement,
    showOptions,
    textInputRef,
    triggerHaptic,
    updateFallbackMarkdown,
  };
};

