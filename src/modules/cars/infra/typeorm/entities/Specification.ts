import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

// interface ISpecification {
//   id?: string;
//   name: string;
//   description: string;
//   created_at: Date;
// }

@Entity("specifications")
export class Specification {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  // constructor({ name, description, created_at }: ISpecification) {
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }

    // this.name = name;
    // this.description = description;
    // this.created_at = created_at;
  }
}
