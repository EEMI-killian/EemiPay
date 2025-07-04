import z from "zod";
import { UserRepository } from "../../../repository/User/user.repository";
import { IDeleteUserUseCase } from "./deleteUser.usecase.interface";

const schema = z.object({
  id: z.number(),
});

type deleteUserArgs = z.infer<typeof schema>;

export type IDeleteUserUseCasePresenter<
  SuccessType,
  FunctionnalErrorType,
  NotFoundType,
> = {
  success: () => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionnalErrorType>;
  notFound: () => Promise<NotFoundType>;
};

export class DeleteUserUseCase<SuccessType, FunctionnalErrorType, NotFoundType>
  implements IDeleteUserUseCase<SuccessType, FunctionnalErrorType, NotFoundType>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly presenter: IDeleteUserUseCasePresenter<
      SuccessType,
      FunctionnalErrorType,
      NotFoundType
    >,
  ) {}

  async execute(
    args: deleteUserArgs,
  ): Promise<SuccessType | FunctionnalErrorType | NotFoundType> {
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
