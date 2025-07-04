import z from "zod";
import { UserRepository } from "../../../repository/User/user.repository";
import { IUpdateUserPasswordUseCase } from "./updateUserPassword.usecase.interface";
import { createHash } from "crypto";

const schema = z.object({
  id: z.number(),
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

type updateUserPasswordArgs = z.infer<typeof schema>;

type IUpdateUserPasswordUseCasePresenter<
  SuccessType,
  FunctionnalErrorType,
  NotFoundType,
  InvalidPasswordType,
> = {
  success: () => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionnalErrorType>;
  notFound: () => Promise<NotFoundType>;
  invalidPassword: () => Promise<InvalidPasswordType>;
};

export class UpdateUserPasswordUseCase<
  SuccessType,
  FunctionnalErrorType,
  NotFoundType,
  InvalidPasswordType,
> implements
    IUpdateUserPasswordUseCase<
      SuccessType,
      FunctionnalErrorType,
      NotFoundType,
      InvalidPasswordType
    >
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly presenter: IUpdateUserPasswordUseCasePresenter<
      SuccessType,
      FunctionnalErrorType,
      NotFoundType,
      InvalidPasswordType
    >,
  ) {}

  async execute(
    args: updateUserPasswordArgs,
  ): Promise<
    SuccessType | FunctionnalErrorType | NotFoundType | InvalidPasswordType
  > {
    let validatedData;
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
      const hashedOldPassword = createHash("sha256")
        .update(validatedData.oldPassword)
        .digest("hex");
      if (hashedOldPassword !== user.password) {
        return await this.presenter.invalidPassword();
      }
      const hashedNewPassword = createHash("sha256")
        .update(validatedData.newPassword)
        .digest("hex");
      await this.userRepository.updateUserPassword(
        validatedData.id,
        hashedNewPassword,
      );
      return await this.presenter.success();
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
