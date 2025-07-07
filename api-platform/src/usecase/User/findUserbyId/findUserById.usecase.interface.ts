export interface IFindUserByIdUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> {
  execute(
    args: findUserArgs,
  ): Promise<SuccessType | FunctionalErrorType | NotFoundType>;
}

export type findUserArgs = {
  id: number;
};
