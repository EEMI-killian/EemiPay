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
> = {
  success: (user: User) => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
};

export class FindUserByIdUseCase<SuccessType, FunctionalErrorType, NotFoundType>
  implements
    IFindUserByIdUseCase<SuccessType, FunctionalErrorType, NotFoundType>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly presenter: IFindUserByIdUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType
    >,
  ) {}

  async execute(
    args: findUserArgs,
  ): Promise<SuccessType | FunctionalErrorType | NotFoundType> {
    let validatedData;
    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.error(error.message);
    }
    const user = await this.userRepository.findById(validatedData.id);
    if (!user) {
      return await this.presenter.notFound();
    }
    return await this.presenter.success(user);
  }
}
