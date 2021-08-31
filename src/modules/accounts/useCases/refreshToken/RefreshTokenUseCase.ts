import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const { sub, email } = verify(token, auth.secret_refresh_token) as IPayload;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(sub, token);

    if (!userToken) {
      throw new AppError("Refresh token does not exist!");
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: userToken.user_id,
      expiresIn: `${auth.expires_in_refresh_token_days}d`,
    });

    const expires_date = this.dateProvider.addDays(
      auth.expires_in_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id: userToken.user_id,
      expires_date,
      refresh_token,
    });

    const newToken = sign({}, auth.secret_token, {
      subject: userToken.user_id,
      expiresIn: auth.expires_in_token,
    });

    return { token: newToken, refresh_token };
  }
}