import { AuthSession } from "../../domain/entities/auth.entity";
import { User } from "../../domain/entities/user.entity";
import {
  AuthRepository,
  LoginParams,
  RegisterParams,
  ResetPasswordParams,
} from "../../domain/repositories/auth.repository";
import { AuthResponseDto, UserResponseDto } from "../../application/dto/auth.dto";
import { UserMapper } from "../../application/mappers/user.mapper";
import { AppUrls } from "../constants/app-urls";
import { HttpClient } from "../http/http-client";
import { store } from "../rtk/store";
import { logout as logoutAction, setCredentials } from "../rtk/slices/authSlice";

export class RtkAuthRepository implements AuthRepository {
  async login(params: LoginParams): Promise<AuthSession> {
    const data = await HttpClient.post<AuthResponseDto>(AppUrls.auth.login, params);
    const session = UserMapper.toAuthSession(data);

    store.dispatch(
      setCredentials({
        user: session.user,
        accessToken: session.tokens.accessToken,
        refreshToken: session.tokens.refreshToken,
      })
    );

    return session;
  }

  async register(params: RegisterParams): Promise<AuthSession> {
    const data = await HttpClient.post<AuthResponseDto>(AppUrls.auth.register, params);
    const session = UserMapper.toAuthSession(data);

    store.dispatch(
      setCredentials({
        user: session.user,
        accessToken: session.tokens.accessToken,
        refreshToken: session.tokens.refreshToken,
      })
    );

    return session;
  }

  async getMe(): Promise<User> {
    const data = await HttpClient.get<UserResponseDto>(AppUrls.auth.me);
    return UserMapper.toDomain(data);
  }

  async logout(): Promise<void> {
    try {
      await HttpClient.post(AppUrls.auth.logout);
    } catch {
      // Ignore network failures on logout to ensure local session is cleared
    } finally {
      store.dispatch(logoutAction());
    }
  }

  async verifyEmail(code: string): Promise<boolean> {
    await HttpClient.post(AppUrls.auth.verifyEmail, { code });
    return true;
  }

  async resendVerification(email: string): Promise<boolean> {
    await HttpClient.post(AppUrls.auth.resendVerification, { email });
    return true;
  }

  async forgotPassword(email: string): Promise<boolean> {
    await HttpClient.post(AppUrls.auth.forgotPassword, { email });
    return true;
  }

  async resetPassword(params: ResetPasswordParams): Promise<boolean> {
    await HttpClient.post(AppUrls.auth.resetPassword, params);
    return true;
  }
}

export const authRepository = new RtkAuthRepository();
