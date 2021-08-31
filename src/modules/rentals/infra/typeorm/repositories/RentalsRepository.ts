import { getRepository, Repository } from "typeorm";

import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { Rental } from "../entities/Rental";

export class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }
  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create(data);

    await this.repository.save(rental);

    return rental;
  }

  async findOpenRentalByCarId(id: string): Promise<Rental> {
    return this.repository.findOne({
      where: { car_id: id, end_date: null },
    });
  }

  async findOpenRentalByUserId(id: string): Promise<Rental> {
    return this.repository.findOne({
      where: { user_id: id, end_date: null },
    });
  }

  async findById(id: string): Promise<Rental> {
    return this.repository.findOne(id);
  }

  async findByUser(id: string): Promise<Rental[]> {
    return this.repository.find({
      where: { user_id: id },
      relations: ["car"],
    });
  }
}
