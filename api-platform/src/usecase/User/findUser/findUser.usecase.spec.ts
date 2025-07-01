import z from "zod";
import { User } from "../../../entity/User";
import { UserRepository } from "../../../repository/User/user.repository";
import { IFindUserUseCase } from "./findUser.usecase.interface";


const schema = z.object({
    id: z.number(),
})

type findUserArgs = z.infer<typeof schema>;


export class FindUserUseCase implements IFindUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(args: findUserArgs): Promise<User | null> {
        const validatedData = schema.parse(args);
        return await this.userRepository.findById(args.id);
    }
}