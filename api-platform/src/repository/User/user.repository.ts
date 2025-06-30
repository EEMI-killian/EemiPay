import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { IUserRepository } from "./user.repository.interface";



export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;

}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}


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

//   //todo check if partial is dangerous and check if need to do a own type 
  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(userData);
    return await this.userRepo.save(user);
  }

//   todo update is can be particular in function of case

  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      await this.userRepo.remove(user);
    }
  }
 }
