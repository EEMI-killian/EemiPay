import z from "zod";
import { IDeleteUserUseCase } from "./deleteUser.usecase.interface.js";
import { IUserRepository } from "../../../repository/User/user.repository.interface.js";

const schema = z.object({
  id: z.string(),
});

type deleteUserArgs = z.infer<typeof schema>;

export type IDeleteUserUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> = {
  success: () => Promise<SuccessType>;
  notFound: () => Promise<NotFoundType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};

export class DeleteUserUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> implements
    IDeleteUserUseCase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: IDeleteUserUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >,
  ) {}

  async execute(
    args: deleteUserArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  > {
    let validatedData;
    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.invalidArguments(error.message);
    }
    try {
      const user = await this.userRepository.findById(validatedData.id);
      if (!user) {
        return await this.presenter.notFound();
      }
      await this.userRepository.delete(validatedData.id);
      return await this.presenter.success();
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
  }
}
