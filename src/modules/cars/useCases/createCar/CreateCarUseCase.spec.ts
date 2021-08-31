import { validate } from "uuid";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  it("Should create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Car name",
      description: "Car description",
      daily_rate: 100,
      license_plate: "1234",
      fine_amount: 60,
      brand: "Car brand",
      category_id: "12",
    });

    expect(validate(car.id)).toBe(true);
  });

  it("Should not create a car with as already registered license plate", async () => {
    await createCarUseCase.execute({
      name: "Car 2",
      description: "Car 2 description",
      daily_rate: 120,
      license_plate: "ABC-1234",
      fine_amount: 70,
      brand: "Car 2 brand",
      category_id: "1234",
    });

    await expect(
      createCarUseCase.execute({
        name: "Car 3",
        description: "Car 3 description",
        daily_rate: 150,
        license_plate: "ABC-1234",
        fine_amount: 90,
        brand: "Car 3 brand",
        category_id: "12345678",
      })
    ).rejects.toEqual(new AppError("Car already registered"));
  });

  it("Should create a car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Car 2",
      description: "Car 2 description",
      daily_rate: 100,
      license_plate: "1234",
      fine_amount: 60,
      brand: "Car 2 brand",
      category_id: "1234",
    });

    expect(car.available).toEqual(true);
  });
});
