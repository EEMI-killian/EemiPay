import { Repository } from "typeorm";
import { User } from "../../entity/User";
import {
  CreateUserRepositoryArgs,
  IUserRepository,
} from "./user.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async create(args: CreateUserRepositoryArgs): Promise<void> {
    const user = this.userRepository.create(args);
    await this.userRepository.save(user);
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.password = password;
      await this.userRepository.save(user);
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      await this.userRepository.remove(user);
    }
  }
}
