export interface IFindUserByIdUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> {
  execute(
    args: findUserArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  >;
}

export type findUserArgs = {
  id: string;
};
