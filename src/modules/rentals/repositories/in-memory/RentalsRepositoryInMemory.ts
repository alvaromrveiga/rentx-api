import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

export class RentalsRepositoryInMemory implements IRentalsRepository {
  constructor(public rentals: Rental[] = []) {}

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, data, { start_date: new Date() });

    this.rentals.push(rental);

    return rental;
  }

  async findOpenRentalByCarId(id: string): Promise<Rental> {
    return this.rentals.find((rental) => {
      return rental.car_id === id && !rental.end_date;
    });
  }

  async findOpenRentalByUserId(id: string): Promise<Rental> {
    return this.rentals.find((rental) => {
      return rental.user_id === id && !rental.end_date;
    });
  }

  async findById(id: string): Promise<Rental> {
    return this.rentals.find((rental) => {
      return rental.id === id;
    });
  }

  async findByUser(id: string): Promise<Rental[]> {
    return this.rentals.filter((rental) => {
      return rental.user_id === id;
    });
  }
}
