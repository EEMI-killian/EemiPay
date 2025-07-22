import { Repository } from "typeorm";
import { User, UserRole } from "../../entity/User";
import {
  CreateUserRepositoryArgs,
  IUserRepository,
} from "./user.repository.interface";
import mongoose from "mongoose";
import { ModelDocument } from "../../mongoSchema";

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
    const user = this.userRepository.create({
      id: args.id,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: args.password,
      isActive: false,
      roles: UserRole.ROLE_USER,
    });
    await this.userRepository.save(user);
    await mongoose.connect(
      "mongodb://mongo:mongo@mongodb:27017/eemi-pay?authSource=admin",
    );
    await new ModelDocument({
      userId: args.id,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: args.password,
      createdAt: new Date(),
      isActive: false,
    }).save();
    await mongoose.disconnect();
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
