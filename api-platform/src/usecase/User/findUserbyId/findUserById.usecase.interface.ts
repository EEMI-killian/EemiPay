export interface IFindUserByIdUseCase<
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
