import z from "zod";
import { User } from "../../../entity/User";
import { UserRepository } from "../../../repository/User/user.repository";
import { IFindUserUseCase } from "./findUser.usecase.interface";

const schema = z.object({
  id: z.number(),
});

type findUserArgs = z.infer<typeof schema>;

type IFindUserUseCasePresenter<
  SuccessType,
  FunctionnalErrorType,
  NotFoundType,
> = {
  success: (user: User) => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionnalErrorType>;
  notFound: () => Promise<NotFoundType>;
};

export class FindUserUseCase<SuccessType, FunctionnalErrorType, NotFoundType>
  implements IFindUserUseCase<SuccessType, FunctionnalErrorType, NotFoundType>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly presenter: IFindUserUseCasePresenter<
      SuccessType,
      FunctionnalErrorType,
      NotFoundType
    >,
  ) {}

  async execute(
    args: findUserArgs,
  ): Promise<SuccessType | FunctionnalErrorType | NotFoundType> {
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
