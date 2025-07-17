import { User } from "../../entity/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(args: CreateUserRepositoryArgs): Promise<void>;
  delete(id: string): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
}

export type CreateUserRepositoryArgs = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
