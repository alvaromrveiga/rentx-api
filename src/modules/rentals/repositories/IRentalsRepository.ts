import { ICreateRentalDTO } from "../dtos/ICreateRentalDTO";
import { Rental } from "../infra/typeorm/entities/Rental";

export interface IRentalsRepository {
  create(data: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByCarId(id: string): Promise<Rental>;
  findOpenRentalByUserId(id: string): Promise<Rental>;
  findById(id: string): Promise<Rental>;
  findByUser(id: string): Promise<Rental[]>;
}
