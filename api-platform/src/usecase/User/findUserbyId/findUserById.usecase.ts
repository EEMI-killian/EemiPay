import z from "zod";
import { User } from "../../../entity/User";
import { IFindUserByIdUseCase } from "./findUserById.usecase.interface";
import { IUserRepository } from "../../../repository/User/user.repository.interface";

const schema = z.object({
  id: z.string(),
});

type findUserArgs = z.infer<typeof schema>;

export type IFindUserByIdUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> = {
  success: (user: User) => Promise<SuccessType>;
  notFound: () => Promise<NotFoundType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};

export class FindUserByIdUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> implements
    IFindUserByIdUseCase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: IFindUserByIdUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >,
  ) {}

  async execute(
    args: findUserArgs,
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
      return await this.presenter.success(user);
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
  }
}
