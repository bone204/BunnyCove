import { AppDefaults } from './defaults.js';

export interface BunnySticker {
  id: string;
  name: string;
  category: 'emotion' | 'reaction' | 'action';
  imageUrl: string;
}

export interface QuickReaction {
  id: string;
  textEn: string;
  textVi: string;
}

const STICKER_BASE = AppDefaults.CLOUDINARY.STICKERS_BASE_URL;

export const BUNNY_STICKERS: BunnySticker[] = [
  {
    id: 'bunny_happy',
    name: 'Happy Bunny',
    category: 'emotion',
    imageUrl: `${STICKER_BASE}/bunny_happy.webp`,
  },
  {
    id: 'bunny_angry',
    name: 'Angry Bunny',
    category: 'emotion',
    imageUrl: `${STICKER_BASE}/bunny_angry.webp`,
  },
  {
    id: 'bunny_love',
    name: 'Heart Bunny',
    category: 'emotion',
    imageUrl: `${STICKER_BASE}/bunny_love.webp`,
  },
  {
    id: 'bunny_playful',
    name: 'Playful Bunny',
    category: 'emotion',
    imageUrl: `${STICKER_BASE}/bunny_playful.webp`,
  },
  {
    id: 'bunny_crying',
    name: 'Crying Bunny',
    category: 'emotion',
    imageUrl: `${STICKER_BASE}/bunny_crying.webp`,
  },
  {
    id: 'bunny_cheer',
    name: 'Cheering Bunny',
    category: 'action',
    imageUrl: `${STICKER_BASE}/bunny_cheer.webp`,
  },
  {
    id: 'bunny_sleepy',
    name: 'Sleepy Bunny',
    category: 'emotion',
    imageUrl: `${STICKER_BASE}/bunny_sleepy.webp`,
  },
  {
    id: 'bunny_shocked',
    name: 'Shocked Bunny',
    category: 'emotion',
    imageUrl: `${STICKER_BASE}/bunny_shocked.webp`,
  },
];

export const QUICK_REACTIONS: QuickReaction[] = [
  {
    id: 'reaction_your_turn',
    textEn: "It's your turn!",
    textVi: 'Đến lượt bạn nè!',
  },
  {
    id: 'reaction_good_move',
    textEn: 'Nice move!',
    textVi: 'Nước cờ hay đó!',
  },
  {
    id: 'reaction_wait_a_sec',
    textEn: 'Hold on a second 🐰',
    textVi: 'Chờ mình xíu nhé 🐰',
  },
  {
    id: 'reaction_prepare_to_lose',
    textEn: 'Prepare to lose!',
    textVi: 'Chuẩn bị thua đi nha!',
  },
  {
    id: 'reaction_good_game',
    textEn: 'Good game!',
    textVi: 'Trận đấu tuyệt vời!',
  },
];

export const isValidStickerId = (stickerId: string): boolean => {
  return BUNNY_STICKERS.some((s) => s.id === stickerId);
};

export const getStickerById = (stickerId: string): BunnySticker | undefined => {
  return BUNNY_STICKERS.find((s) => s.id === stickerId);
};
