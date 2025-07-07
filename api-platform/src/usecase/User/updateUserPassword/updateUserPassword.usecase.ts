import z from "zod";
import { IUpdateUserPasswordUseCase } from "./updateUserPassword.usecase.interface";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";

const schema = z.object({
  id: z.string().uuid(),
  inputOldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

type updateUserPasswordArgs = z.infer<typeof schema>;

export type IUpdateUserPasswordUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidPasswordType,
> = {
  success: () => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
  invalidPassword: () => Promise<InvalidPasswordType>;
};

export class UpdateUserPasswordUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidPasswordType,
> implements
    IUpdateUserPasswordUseCase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidPasswordType
    >
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: IUpdateUserPasswordUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidPasswordType
    >,
    private readonly hashGateway: IHashGateway,
  ) {}

  async execute(
    args: updateUserPasswordArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidPasswordType
  > {
    let validatedData: updateUserPasswordArgs;
    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.error(error.message);
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
      return await this.presenter.error(error.message);
    }
  }
}
