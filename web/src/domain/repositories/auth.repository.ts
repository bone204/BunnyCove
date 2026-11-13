import { AuthSession } from "../entities/auth.entity";
import { User } from "../entities/user.entity";

export interface LoginParams {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface ResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthRepository {
  login(params: LoginParams): Promise<AuthSession>;
  register(params: RegisterParams): Promise<AuthSession>;
  getMe(): Promise<User>;
  logout(): Promise<void>;
  verifyEmail(code: string): Promise<boolean>;
  resendVerification(email: string): Promise<boolean>;
  forgotPassword(email: string): Promise<boolean>;
  resetPassword(params: ResetPasswordParams): Promise<boolean>;
}

