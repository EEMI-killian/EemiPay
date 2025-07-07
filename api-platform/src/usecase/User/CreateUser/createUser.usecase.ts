import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { ICreateUserUseCase } from "./createUser.usecase.interface";
import * as z from "zod";
import { User } from "../../../entity/User";
import { IPasswordGateway } from "../../../gateway/password/password.gateway.interface";

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
  success: (id: number) => Promise<SuccessType>;
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
    private readonly passwordGateway: IPasswordGateway,
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
      const hashedPassword = await this.passwordGateway.hash(args.password);
      await this.userRepository.createUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      });
      user = await this.userRepository.findByEmail(validatedData.email);
      return await this.presenter.success(user.id);
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
