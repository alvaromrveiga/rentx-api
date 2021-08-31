import dayjs from "dayjs";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
const tomorrow = dayjs().add(1, "day").toDate();
let car: Car;

describe("Create Rental", () => {
  beforeEach(async () => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      new RentalsRepositoryInMemory(),
      new DayjsDateProvider(),
      carsRepositoryInMemory
    );

    car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Test desc",
      daily_rate: 10,
      license_plate: "abc-9999",
      fine_amount: 20,
      brand: "Test brand",
      category_id: "123",
    });
  });

  it("Should create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "123",
      car_id: car.id,
      expected_return_date: tomorrow,
    });

    expect(rental).toHaveProperty("id");
  });

  it("Should not create a new rental if the user is already renting another car", async () => {
    await createRentalUseCase.execute({
      user_id: "123",
      car_id: car.id,
      expected_return_date: tomorrow,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: "4321",
        expected_return_date: tomorrow,
      })
    ).rejects.toEqual(
      new AppError("There is a rental already open for this user!")
    );
  });

  it("Should not create a new rental if the car is already rented", async () => {
    await createRentalUseCase.execute({
      user_id: "123",
      car_id: car.id,
      expected_return_date: tomorrow,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123456",
        car_id: car.id,
        expected_return_date: tomorrow,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("Should not create a new rental with invalid return time", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "123456",
        car_id: "321",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
});
