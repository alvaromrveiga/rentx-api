import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,

    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute(data: ICreateRentalDTO): Promise<Rental> {
    const MINIMUM_RENT_HOURS = 24;

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(
      data.car_id
    );

    if (carUnavailable) {
      throw new AppError("Car is unavailable");
    }

    const rentalOpenToUser =
      await this.rentalsRepository.findOpenRentalByUserId(data.user_id);

    if (rentalOpenToUser) {
      throw new AppError("There is a rental already open for this user!");
    }

    const compare = this.dateProvider.compareInHours(
      this.dateProvider.dateNow(),
      data.expected_return_date
    );

    if (compare < MINIMUM_RENT_HOURS) {
      throw new AppError("Invalid return time!");
    }

    await this.carsRepository.updateAvailable(data.car_id, false);

    return this.rentalsRepository.create(data);
  }
}
