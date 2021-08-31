import { ICreateCarDTO } from "../dtos/ICreateCarDTO";
import { Car } from "../infra/typeorm/entities/Car";

export interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;

  findById(id: string): Promise<Car>;

  findByLicensePlate(license_plate: string): Promise<Car>;

  findAllAvailable(
    category_id?: string,
    brand?: string,
    name?: string
  ): Promise<Car[]>;

  updateAvailable(id: string, available: boolean): Promise<void>;
}
