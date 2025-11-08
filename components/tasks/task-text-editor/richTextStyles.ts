import { Typography, Spacing, BorderRadius } from "@/constants/theme";

export const createRichTextBaseStyle = (color: string, completedColor?: string) => ({
  color: completedColor ?? color,
  fontSize: Typography.body.fontSize,
  lineHeight: 24,
});

export const richTextTagsStyles: Record<string, any> = {
  p: {
    marginBottom: 10,
  },
  h1: {
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 8,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 6,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 4,
  },
  ul: {
    paddingLeft: Spacing.lg,
    marginBottom: 10,
  },
  ol: {
    paddingLeft: Spacing.lg,
    marginBottom: 10,
  },
  li: {
    marginBottom: 6,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: "rgba(0,0,0,0.1)",
    paddingLeft: Spacing.md,
    marginVertical: Spacing.sm,
    fontStyle: "italic",
  },
  code: {
    fontFamily: "monospace",
    backgroundColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 4,
    borderRadius: BorderRadius.sm,
  },
  pre: {
    backgroundColor: "rgba(0,0,0,0.06)",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "scroll",
  },
  img: {
    width: "75%",
    maxWidth: 260,
    height: "auto",
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.sm,
    alignSelf: "center",
  },
  a: {
    textDecorationLine: "underline",
  },
  strong: {
    fontWeight: "700",
  },
  b: {
    fontWeight: "700",
  },
  em: {
    fontStyle: "italic",
  },
  i: {
    fontStyle: "italic",
  },
  u: {
    textDecorationLine: "underline",
  },
  strike: {
    textDecorationLine: "line-through",
  },
  s: {
    textDecorationLine: "line-through",
  },
  del: {
    textDecorationLine: "line-through",
  },
};

export const richTextRenderersProps = {
  img: {
    enableExperimentalPercentWidth: true,
  },
};

