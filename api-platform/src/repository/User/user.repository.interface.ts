import { User } from "../../entity/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  createUser(args: ICreateUserRepositoryArgs): Promise<void>;
  deleteUser(id: number): Promise<void>;
  updateUserPassword(id: number, password: string): Promise<void>;
}

export type ICreateUserRepositoryArgs = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
