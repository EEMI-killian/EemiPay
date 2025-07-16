import z from "zod";
import { IUpdateUserPasswordUseCase } from "./updateUserPassword.usecase.interface";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";

const schema = z.object({
  id: z.string(),
  inputOldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

type updateUserPasswordArgs = z.infer<typeof schema>;

export type IUpdateUserPasswordUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidPasswordType,
  InvalidArgumentsType,
> = {
  success: () => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
  notFound: () => Promise<NotFoundType>;
  invalidPassword: () => Promise<InvalidPasswordType>;
};

export class UpdateUserPasswordUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidPasswordType,
  InvalidArgumentsType,
> implements
    IUpdateUserPasswordUseCase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidPasswordType,
      InvalidArgumentsType
    >
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: IUpdateUserPasswordUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidPasswordType,
      InvalidArgumentsType
    >,
    private readonly hashGateway: IHashGateway,
  ) {}

  async execute(
    args: updateUserPasswordArgs,
  ): Promise<
    | SuccessType
    | FunctionalErrorType
    | NotFoundType
    | InvalidPasswordType
    | InvalidArgumentsType
  > {
    let validatedData: updateUserPasswordArgs;
    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.invalidArguments(error);
    }
    try {
      const user = await this.userRepository.findById(validatedData.id);
      if (!user) {
        return await this.presenter.notFound();
      }

      const match = await this.hashGateway.compare({
        stringAlreadyHashed: user.password,
        input: validatedData.inputOldPassword,
      });
      if (!match) {
        return await this.presenter.invalidPassword();
      }
      const newPasswordHashed = await this.hashGateway.hash(
        validatedData.newPassword,
      );
      await this.userRepository.updatePassword(
        validatedData.id,
        newPasswordHashed,
      );
      return await this.presenter.success();
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
  }
}
