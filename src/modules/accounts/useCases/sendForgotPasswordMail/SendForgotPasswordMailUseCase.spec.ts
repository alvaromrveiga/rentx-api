import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe("Send Forgot Password Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      new DayjsDateProvider(),
      mailProvider
    );
  });

  it("Should send forgot password mail", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      name: "Tester",
      email: "tester@test.com",
      password: "123",
      driver_license: "123321",
    });

    await sendForgotPasswordMailUseCase.execute("tester@test.com");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should not send email if email does not exist", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("invalid@mail.com")
    ).rejects.toEqual(new AppError("User does not exist!"));
  });

  it("Should create an users token", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await usersRepositoryInMemory.create({
      name: "Tester",
      email: "tester@test.com",
      password: "123",
      driver_license: "123321",
    });

    await sendForgotPasswordMailUseCase.execute("tester@test.com");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
