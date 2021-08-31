import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICarsRepository } from "../ICarsRepository";

export class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    Object.assign(car, data);

    this.cars.push(car);

    return car;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => {
      return car.id === id;
    });
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => {
      return car.license_plate === license_plate;
    });
  }

  async findAllAvailable(
    category_id?: string,
    brand?: string,
    name?: string
  ): Promise<Car[]> {
    const availableCars = this.cars.filter((car) => {
      return car.available;
    });

    if (!name && !brand && !category_id) {
      return availableCars;
    }

    for (let i = 0; i < availableCars.length; i++) {
      if (name && availableCars[i].name !== name) {
        availableCars.splice(i, 1);
      }
    }

    for (let i = 0; i < availableCars.length; i++) {
      if (brand && availableCars[i].brand !== brand) {
        availableCars.splice(i, 1);
      }
    }

    for (let i = 0; i < availableCars.length; i++) {
      if (category_id && availableCars[i].category_id !== category_id) {
        availableCars.splice(i, 1);
      }
    }

    return availableCars;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const car = await this.findById(id);

    car.available = available;
  }
}
