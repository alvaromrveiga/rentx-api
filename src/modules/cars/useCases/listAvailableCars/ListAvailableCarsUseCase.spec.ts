import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepository: CarsRepositoryInMemory;
let listCarsUseCase: ListAvailableCarsUseCase;

describe("List cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  });

  it("Should list all available cars", async () => {
    const car = await carsRepository.create({
      name: "Car1",
      description: "Car1 Description",
      daily_rate: 60,
      license_plate: "YYY-0000",
      fine_amount: 40,
      brand: "Car1 Brand",
      category_id: "category_id",
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("Should list all available cars by name and brand", async () => {
    const car = await carsRepository.create({
      name: "Car1",
      description: "Car1 Description",
      daily_rate: 60,
      license_plate: "YYY-0000",
      fine_amount: 40,
      brand: "Car1 Brand",
      category_id: "category_id",
    });

    await carsRepository.create({
      name: "Car2",
      description: "Car1 Description",
      daily_rate: 60,
      license_plate: "AAA-9999",
      fine_amount: 40,
      brand: "Car1 Brand",
      category_id: "category_id",
    });

    const cars = await listCarsUseCase.execute({
      brand: "Car1 Brand",
      name: "Car1",
    });

    expect(cars).toEqual([car]);
  });

  it("Should list all available cars by brand", async () => {
    const car = await carsRepository.create({
      name: "Car1",
      description: "Car1 Description",
      daily_rate: 60,
      license_plate: "YYY-0000",
      fine_amount: 40,
      brand: "Car1 Brand",
      category_id: "category_id",
    });

    await carsRepository.create({
      name: "Car2",
      description: "Car1 Description",
      daily_rate: 60,
      license_plate: "AAA-9999",
      fine_amount: 40,
      brand: "Car2 Brand",
      category_id: "category_id",
    });

    const cars = await listCarsUseCase.execute({
      brand: "Car1 Brand",
    });

    expect(cars).toEqual([car]);
  });

  it("Should list all available cars by category", async () => {
    const car = await carsRepository.create({
      name: "Car1",
      description: "Car1 Description",
      daily_rate: 60,
      license_plate: "YYY-0000",
      fine_amount: 40,
      brand: "Car1 Brand",
      category_id: "Car 1 category_id",
    });

    await carsRepository.create({
      name: "Car2",
      description: "Car1 Description",
      daily_rate: 60,
      license_plate: "AAA-9999",
      fine_amount: 40,
      brand: "Car2 Brand",
      category_id: "category_id2",
    });

    const cars = await listCarsUseCase.execute({
      category_id: "Car 1 category_id",
    });

    expect(cars).toEqual([car]);
  });
});
