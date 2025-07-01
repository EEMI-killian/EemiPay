import z from "zod";
import { UserRepository } from "../../../repository/User/user.repository";
import { IUpdateUserPasswordUseCase } from "./updateUserPassword.usecase.interface";
import { createHash } from "crypto";


const schema = z.object({
    id: z.number(),
    password: z.string().min(8),
})

type updateUserPasswordArgs = z.infer<typeof schema>;


export class UpdateUserPasswordUseCase implements IUpdateUserPasswordUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(args: updateUserPasswordArgs): Promise<void> {
        const validatedData = schema.parse(args);
        try {
            const user = await this.userRepository.findById(validatedData.id);
            if (!user) {
                throw new Error("User not found");
            }
            const hashedPassword = createHash('sha256').update(validatedData.password).digest('hex');
            await this.userRepository.updateUserPassword(validatedData.id, hashedPassword);
        } catch (error) {
            throw new Error("Failed to update user password");
        }
    }
}