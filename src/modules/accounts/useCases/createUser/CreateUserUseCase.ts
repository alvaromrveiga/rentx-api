import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(data: ICreateUserDTO): Promise<void> {
    const emailAlreadyInUse = await this.usersRepository.findByEmail(
      data.email
    );

    if (emailAlreadyInUse) {
      throw new AppError("Email already in use!");
    }

    const passwordHash = await hash(data.password, 10);

    await this.usersRepository.create({ ...data, password: passwordHash });
  }
}
