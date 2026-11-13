import { AuthSession } from "../../entities/auth.entity";
import { AuthRepository, RegisterParams } from "../../repositories/auth.repository";

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: RegisterParams): Promise<AuthSession> {
    return this.authRepository.register(params);
  }
}
