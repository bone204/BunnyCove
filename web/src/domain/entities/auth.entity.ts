import { User } from "./user.entity";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}
