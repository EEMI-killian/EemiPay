import { DataSource, Repository } from "typeorm";
import { User } from "../../entity/User";

interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  createUser(userData: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
export class UserRepository implements IUserRepository {
  private userRepo: Repository<User> ;

  constructor(dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

//   //todo check if partial is dangerous and check if need to do a own type 
  async createUser(userData: Partial<User>): Promise<User> {
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
