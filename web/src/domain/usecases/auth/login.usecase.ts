import { AuthSession } from "../../entities/auth.entity";
import { AuthRepository, LoginParams } from "../../repositories/auth.repository";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: LoginParams): Promise<AuthSession> {
    return this.authRepository.login(params);
  }
}
