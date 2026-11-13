export type MessageType = "TEXT" | "STICKER" | "IMAGE" | "SYSTEM";

export interface ChatMessage {
  id: string;
  roomCode?: string | null;
  matchId?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  content: string;
  type: MessageType;
  isEdited: boolean;
  editedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
}

export type StickerCategory = "emotion" | "reaction" | "action";

export interface BunnySticker {
  id: string;
  name: string;
  category: StickerCategory;
  imageUrl: string;
}

export interface QuickReaction {
  id: string;
  textEn: string;
  textVi: string;
}

