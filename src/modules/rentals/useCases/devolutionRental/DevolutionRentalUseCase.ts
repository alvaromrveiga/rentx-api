import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
export class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,

    @inject("CarsRepository")
    private carsRepository: ICarsRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);
    const MINIMUM_DAYS = 1;

    if (!rental) {
      throw new AppError("Rental does not exist!");
    }

    let rentalDaysAmount = this.dateProvider.compareInDays(
      rental.start_date,
      this.dateProvider.dateNow()
    );

    if (rentalDaysAmount < MINIMUM_DAYS) {
      rentalDaysAmount = MINIMUM_DAYS;
    }

    const delay = this.dateProvider.compareInDays(
      this.dateProvider.dateNow(),
      rental.expected_return_date
    );

    let totalPrice = 0;

    if (
      delay > 0 &&
      this.dateProvider.dateNow() > rental.expected_return_date
    ) {
      const calculate_fine = delay * car.fine_amount;
      totalPrice = calculate_fine;
    }

    totalPrice += car.daily_rate * rentalDaysAmount;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = totalPrice;

    await this.carsRepository.updateAvailable(car.id, true);
    return this.rentalsRepository.create(rental);
  }
}
