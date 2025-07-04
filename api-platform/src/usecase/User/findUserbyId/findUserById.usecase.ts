import z from "zod";
import { User } from "../../../entity/User";
import { UserRepository } from "../../../repository/User/user.repository";
import { IFindUserByIdUseCase } from "./findUserById.usecase.interface";

const schema = z.object({
  id: z.number(),
});

type findUserArgs = z.infer<typeof schema>;

type IFindUserByIdUseCasePresenter<
  SuccessType,
  FunctionnalErrorType,
  NotFoundType,
> = {
  success: (user: User) => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionnalErrorType>;
  notFound: () => Promise<NotFoundType>;
};

export class FindUserByIdUseCase<SuccessType, FunctionnalErrorType, NotFoundType>
  implements IFindUserByIdUseCase<SuccessType, FunctionnalErrorType, NotFoundType>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly presenter: IFindUserByIdUseCasePresenter<
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
