import { User } from "../../../entity/User";

export interface IFindUserUseCase<
  SuccessType,
  FunctionnalErrorType,
  NotFoundType,
> {
  execute(
    args: findUserArgs,
  ): Promise<SuccessType | FunctionnalErrorType | NotFoundType>;
}

export type findUserArgs = {
  id: number;
};
