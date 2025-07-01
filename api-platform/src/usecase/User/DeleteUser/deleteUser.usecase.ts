import z from "zod";
import { UserRepository } from "../../../repository/User/user.repository";
import { IDeleteUserUseCase } from "./deleteUser.usecase.interface";

const schema = z.object({
    id: z.number(),
})

type deleteUserArgs = z.infer<typeof schema>;

export class DeleteUserUseCase implements IDeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(args : deleteUserArgs ): Promise<void> {
        const validatedData = schema.parse(args);
        try {
            const user = await this.userRepository.findById(validatedData.id);
            if (!user) {
                throw new Error("User not found");
            }     
            await this.userRepository.deleteUser(validatedData.id);
        } catch (error) {
            throw new Error("Failed to delete user");
        }
    }
}