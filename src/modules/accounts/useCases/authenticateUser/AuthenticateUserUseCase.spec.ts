import { verify } from "jsonwebtoken";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

interface IPayload {
  sub: string;
  iat: number;
  exp: number;
}

describe("Authenticate User", () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      new UsersTokensRepositoryInMemory(),
      new DayjsDateProvider()
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "123456",
      email: "test@test.com",
      password: "123",
      name: "Tester",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

    const decoded = verify(
      result.token,
      "39b514340ad3532aadc467e534e5fa37"
    ) as IPayload;

    expect(decoded.sub).toBe(userCreated.id);

    // expiration is 15min = 900 seconds
    expect(decoded.exp - 900).toEqual(decoded.iat);
  });

  it("Should not authenticate non existent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "DoesNotExist@test.com",
        password: "123",
      })
    ).rejects.toEqual(new AppError("Invalid email or password"));
  });

  it("Should not authenticate user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "123456",
      email: "test@test.com",
      password: "1234",
      name: "Tester",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: `${user.password}Wrong`,
      })
    ).rejects.toEqual(new AppError("Invalid email or password"));
  });
});
