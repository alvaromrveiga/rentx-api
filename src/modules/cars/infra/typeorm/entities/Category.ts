import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

// interface ICategory {
//   id?: string;
//   name: string;
//   description: string;
//   created_at: Date;
// }

@Entity("categories")
export class Category {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  // constructor({ name, description, created_at }: ICategory) {
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }

    // this.name = "";
    // this.description = "";
  }
}
