import { AuthSession } from "../../domain/entities/auth.entity";
import { User } from "../../domain/entities/user.entity";
import { AuthResponseDto, UserResponseDto } from "../dto/auth.dto";

export class UserMapper {
  static toDomain(dto: UserResponseDto): User {
    return {
      id: dto.id,
      email: dto.email,
      username: dto.username,
      displayName: dto.displayName,
      avatarUrl: dto.avatarUrl,
      isEmailVerified: dto.isEmailVerified,
      emailVerifiedAt: dto.emailVerifiedAt,
      createdAt: dto.createdAt,
    };
  }

  static toAuthSession(dto: AuthResponseDto): AuthSession {
    return {
      user: this.toDomain(dto.user),
      tokens: {
        accessToken: dto.tokens.accessToken,
        refreshToken: dto.tokens.refreshToken,
        expiresIn: dto.tokens.expiresIn,
      },
    };
  }
}

