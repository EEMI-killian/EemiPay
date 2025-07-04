import { User } from "../../entity/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  createUser(userData: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  updateUserPassword(id: number, password: string): Promise<void>;
}
