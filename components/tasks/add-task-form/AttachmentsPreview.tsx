import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { Typography } from "@/constants/theme";
import { getAttachmentIcon, getAttachmentLabel } from "@/utils/attachments";
import { TaskAttachment } from "@/types/task";

import { addTaskFormStyles } from "./styles";

interface AttachmentColors {
    background: string;
    border: string;
    card: string;
    text: string;
    textSecondary: string;
}

interface AttachmentsPreviewProps {
    attachments: TaskAttachment[];
    colors: AttachmentColors;
    onRemoveAttachment: (id: string) => void;
}

export const AttachmentsPreview: React.FC<AttachmentsPreviewProps> = ({
    attachments,
    colors,
    onRemoveAttachment,
}) => {
    if (attachments.length === 0) {
        return null;
    }

    return (
        <View
            pointerEvents="box-none"
            style={addTaskFormStyles.attachmentsFloatingWrapper}
        >
            <View
                pointerEvents="auto"
                style={[
                    addTaskFormStyles.attachmentsFloating,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ]}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={addTaskFormStyles.attachmentsContainer}
                    contentContainerStyle={addTaskFormStyles.attachmentsContent}
                >
                    {attachments.map((attachment) => (
                        <View
                            key={attachment.id}
                            style={[
                                addTaskFormStyles.attachmentBadge,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name={getAttachmentIcon(attachment.type, attachment.name)}
                                size={14}
                                color={colors.textSecondary}
                            />
                            <ThemedText
                                style={[
                                    Typography.caption,
                                    { color: colors.text, fontSize: 12 },
                                ]}
                                numberOfLines={1}
                            >
                                {getAttachmentLabel(attachment.name, 10)}
                            </ThemedText>
                            <Pressable
                                onPress={() => onRemoveAttachment(attachment.id)}
                                hitSlop={6}
                                style={addTaskFormStyles.removeBadgeButton}
                            >
                                <Ionicons name="close" size={14} color={colors.textSecondary} />
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

