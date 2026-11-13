export interface User {
  id: string;
  email: string | null;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt?: string | null;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  gameType: string;
  eloRating: number;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestStreak: number;
  winRate: number;
}
