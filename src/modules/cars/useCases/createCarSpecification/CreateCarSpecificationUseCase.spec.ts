import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("Should add a specification to a car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car name",
      description: "Car description",
      daily_rate: 100,
      license_plate: "1234",
      fine_amount: 60,
      brand: "Car brand",
      category_id: "12",
    });

    const specification = await specificationsRepositoryInMemory.create({
      description: "Specification description",
      name: "Specification 1",
    });

    const carSpecification = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id: [specification.id],
    });

    expect(carSpecification.specifications.length).toBe(1);
    expect(carSpecification.specifications[0]).toMatchObject({
      id: specification.id,
      name: "Specification 1",
      description: "Specification description",
    });
  });

  it("Should not add a specification to a non-existent car", async () => {
    await expect(
      createCarSpecificationUseCase.execute({
        car_id: "123",
        specifications_id: ["54321"],
      })
    ).rejects.toEqual(new AppError("Car not found!", 404));
  });
});
