type IoniconName =
  | "image-outline"
  | "document-text-outline"
  | "grid-outline"
  | "easel-outline"
  | "archive-outline"
  | "musical-notes-outline"
  | "videocam-outline"
  | "document-outline";

const EXTENSION_ICON_MAP: Record<string, IoniconName> = {
  jpg: "image-outline",
  jpeg: "image-outline",
  png: "image-outline",
  gif: "image-outline",
  webp: "image-outline",
  heic: "image-outline",
  heif: "image-outline",
  bmp: "image-outline",
  svg: "image-outline",
  pdf: "document-text-outline",
  doc: "document-text-outline",
  docx: "document-text-outline",
  txt: "document-text-outline",
  md: "document-text-outline",
  csv: "grid-outline",
  xls: "grid-outline",
  xlsx: "grid-outline",
  ppt: "easel-outline",
  pptx: "easel-outline",
  zip: "archive-outline",
  rar: "archive-outline",
  "7z": "archive-outline",
  mp3: "musical-notes-outline",
  wav: "musical-notes-outline",
  aac: "musical-notes-outline",
  mp4: "videocam-outline",
  mov: "videocam-outline",
  avi: "videocam-outline",
  mkv: "videocam-outline",
};

export function getAttachmentLabel(name?: string, maxBaseLength = 10): string {
  if (!name) {
    return "";
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return "";
  }

  const lastDot = trimmed.lastIndexOf(".");
  let base = trimmed;
  let extension = "";

  if (lastDot > 0 && lastDot < trimmed.length - 1) {
    base = trimmed.slice(0, lastDot);
    extension = trimmed.slice(lastDot + 1);
  }

  const limit = Math.max(1, maxBaseLength);
  const truncatedBase =
    base.length > limit
      ? `${base.slice(0, limit)}...`
      : base;

  return extension ? `${truncatedBase}.${extension}` : truncatedBase;
}

export function getAttachmentIcon(
  type: "image" | "file",
  name?: string,
  fallback: IoniconName = "document-outline",
): IoniconName {
  if (type === "image") {
    return "image-outline";
  }

  if (!name) {
    return fallback;
  }

  const normalized = name.trim().toLowerCase();
  const lastDot = normalized.lastIndexOf(".");

  if (lastDot > 0 && lastDot < normalized.length - 1) {
    const ext = normalized.slice(lastDot + 1);
    if (EXTENSION_ICON_MAP[ext]) {
      return EXTENSION_ICON_MAP[ext];
    }
  }

  return fallback;
}

