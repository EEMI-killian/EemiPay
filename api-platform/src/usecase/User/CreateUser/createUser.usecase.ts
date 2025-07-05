import { createHash } from "crypto";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { ICreateUserUseCase } from "./createUser.usecase.interface";
import * as z from "zod";
import { User } from "../../../entity/User";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

type createUserArgs = z.infer<typeof schema>;

export type ICreateUserUseCasePresenter<
  SuccessType,
  FunctionnalErrorType,
  AlreadyExistsType,
> = {
  success: (id: number) => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionnalErrorType>;
  alreadyExists: () => Promise<AlreadyExistsType>;
};

export class CreateUserUseCase<
  SuccessType,
  FunctionnalErrorType,
  AlreadyExistsType,
> implements
    ICreateUserUseCase<SuccessType, FunctionnalErrorType, AlreadyExistsType>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: ICreateUserUseCasePresenter<
      SuccessType,
      FunctionnalErrorType,
      AlreadyExistsType
    >,
  ) {}

  async execute(
    args: createUserArgs,
  ): Promise<SuccessType | FunctionnalErrorType | AlreadyExistsType> {
    let validatedData: createUserArgs;
    let existingUser: User | null = null;
    let user: User | null = null;

    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.error(error.message);
    }

    try {
      existingUser = await this.userRepository.findByEmail(validatedData.email);
      if (existingUser) {
        return await this.presenter.alreadyExists();
      }
      const hashedPassword = createHash("sha256")
        .update(validatedData.password)
        .digest("hex");
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
