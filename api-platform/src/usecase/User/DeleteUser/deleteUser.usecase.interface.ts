export interface IDeleteUserUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> {
  execute(
    args: deleteUserArgs,
  ): Promise<SuccessType | FunctionalErrorType | NotFoundType>;
}

export type deleteUserArgs = {
  id: string;
};
