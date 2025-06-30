import { createHash  } from "crypto";
import { UserRepository } from "../../../repository/User/user.repository";
import { ICreateUserUseCase } from "./createUser.usecase.interface";
import * as z from "zod/v4";
 
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

type createUserArgs = z.infer<typeof schema>;



export class CreateUserUseCase implements ICreateUserUseCase{
  constructor(private readonly userRepository: UserRepository) {}


  async execute(args : createUserArgs ): Promise<void> {


    const validatedData = schema.parse(args);
      

    const existingUser = await this.userRepository.findByEmail(validatedData.email);
    
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    const hashedPassword = createHash('sha256').update(args.password).digest('hex');

    await this.userRepository.createUser({
        email: args.email,
        password: hashedPassword,
        firstName: args.firstName,
        lastName: args.lastName
    })
  }
}