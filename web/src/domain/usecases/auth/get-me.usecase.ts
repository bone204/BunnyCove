import { User } from "../../entities/user.entity";
import { AuthRepository } from "../../repositories/auth.repository";

export class GetMeUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<User> {
    return this.authRepository.getMe();
  }
}
