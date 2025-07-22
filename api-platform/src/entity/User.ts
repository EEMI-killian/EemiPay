import { en } from "@faker-js/faker/.";
import "reflect-metadata";
import {
  Entity,
  Column,
  PrimaryColumn,
} from "typeorm";

export enum UserRole {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
}

@Entity()
export class User {
  @PrimaryColumn({ type: "character varying" })
  id!: string;

  @Column({ name: "first_name" })
  firstName!: string;

  @Column({ name: "last_name" })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ name: "is_active", default: false })
  isActive!: boolean;

  @Column({
    name: "roles",
    type: "enum",
    enum: UserRole,
    default: UserRole.ROLE_USER,
  })
  roles!: UserRole;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;
}
