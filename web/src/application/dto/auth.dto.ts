export interface LoginRequestDto {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface VerifyEmailRequestDto {
  code: string;
}

export interface ResendVerificationRequestDto {
  email: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  code: string;
  newPassword: string;
}

export interface UserResponseDto {
  id: string;
  email: string | null;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt?: string | null;
  createdAt: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  tokens: AuthTokensDto;
}
