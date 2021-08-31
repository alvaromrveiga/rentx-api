import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

import {
  ICreateSpecificationDTO,
  ISpecificationsRepository,
} from "../ISpecificationsRepository";

export class SpecificationsRepositoryInMemory
  implements ISpecificationsRepository
{
  constructor(public specifications: Specification[] = []) {}

  async findByName(name: string): Promise<Specification> {
    return this.specifications.find((specification) => {
      return specification.name === name;
    });
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    return this.specifications.filter((specification) => {
      return ids.includes(specification.id);
    });
  }

  async list(): Promise<Specification[]> {
    return this.specifications;
  }

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();

    Object.assign(specification, { name, description });

    this.specifications.push(specification);

    return specification;
  }
}
