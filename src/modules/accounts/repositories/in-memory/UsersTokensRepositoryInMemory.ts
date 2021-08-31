import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

export class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  private usersTokens: UserTokens[] = [];

  async create(data: ICreateUserTokenDTO): Promise<UserTokens> {
    const userTokens = new UserTokens();

    Object.assign(userTokens, data);

    this.usersTokens.push(userTokens);

    return userTokens;
  }

  async findByUserIdAndRefreshToken(
    id: string,
    refreshToken: string
  ): Promise<UserTokens> {
    return this.usersTokens.find((userToken) => {
      return userToken.id === id && userToken.refresh_token === refreshToken;
    });
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex((userToken) => {
      return userToken.id === id;
    });

    this.usersTokens.splice(userTokenIndex, 1);
  }

  async findByRefreshToken(token: string): Promise<UserTokens> {
    return this.usersTokens.find((userToken) => {
      return userToken.refresh_token === token;
    });
  }
}
