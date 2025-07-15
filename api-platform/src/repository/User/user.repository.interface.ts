import { User } from "../../entity/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(args: CreateUserRepositoryArgs): Promise<void>;
  delete(id: number): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
}

export type CreateUserRepositoryArgs = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
