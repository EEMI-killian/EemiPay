import { IUserRepository } from "../../../repository/User/user.repository.interface";

import * as z from "zod";
import { User } from "../../../entity/User";
import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";
import { ICreateUserUseCase } from "./createUser.usecase.interface";
import { IUuidGateway } from "../../../gateway/uuid/uuid.gateway.interface";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

type createUserArgs = z.infer<typeof schema>;

export type ICreateUserUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
> = {
  success: (id: string) => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  alreadyExists: () => Promise<AlreadyExistsType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};

export class CreateUserUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
> implements
    ICreateUserUseCase<
      SuccessType,
      FunctionalErrorType,
      AlreadyExistsType,
      InvalidArgumentsType
    >
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: ICreateUserUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      AlreadyExistsType,
      InvalidArgumentsType
    >,
    private readonly hashGateway: IHashGateway,
    private readonly uuidGateway: IUuidGateway,
  ) {}

  async execute(
    args: createUserArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | AlreadyExistsType | InvalidArgumentsType
  > {
    let validatedData: createUserArgs;
    let existingUser: User | null = null;
    let user: User | null = null;

    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.invalidArguments(error.message);
    }

    try {
      existingUser = await this.userRepository.findByEmail(validatedData.email);
      if (existingUser) {
        return await this.presenter.alreadyExists();
      }
<<<<<<< HEAD
      const hashedPassword = await this.passwordGateway.hash(args.password);
      await this.userRepository.create({
=======
      const hashedPassword = await this.hashGateway.hash(args.password);
      const userId = await this.uuidGateway.generate("user");
      await this.userRepository.create({
        id: userId,
>>>>>>> 1e4d672 (merchant repo)
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      });
      return await this.presenter.success(userId);
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
