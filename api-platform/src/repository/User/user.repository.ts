import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { ICreateUserRepositoryArgs, IUserRepository } from "./user.repository.interface";



export class UserRepository implements IUserRepository {
  constructor(private userRepo: Repository<User>) {
    this.userRepo = userRepo;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async createUser(args: ICreateUserRepositoryArgs): Promise<void> {
    const user = this.userRepo.create(args);
    await this.userRepo.save(user);
  }

  async updateUserPassword(id: number, password: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.password = password;
      await this.userRepo.save(user);
    }
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      await this.userRepo.remove(user);
    }
  }
}
