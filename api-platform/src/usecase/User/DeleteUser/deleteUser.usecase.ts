import z from "zod";
import { IDeleteUserUseCase } from "./deleteUser.usecase.interface";
import { IUserRepository } from "../../../repository/User/user.repository.interface";

const schema = z.object({
  id: z.number(),
});

type deleteUserArgs = z.infer<typeof schema>;

export type IDeleteUserUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> = {
  success: () => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
};

export class DeleteUserUseCase<SuccessType, FunctionalErrorType, NotFoundType>
  implements IDeleteUserUseCase<SuccessType, FunctionalErrorType, NotFoundType>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: IDeleteUserUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType
    >,
  ) {}

  async execute(
    args: deleteUserArgs,
  ): Promise<SuccessType | FunctionalErrorType | NotFoundType> {
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
      await this.userRepository.deleteUser(validatedData.id);
      return await this.presenter.success();
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
