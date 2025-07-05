export interface ICreateUserUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType
> {
  execute(
    args: ICreateUserArgs,
  ): Promise<SuccessType | FunctionalErrorType | AlreadyExistsType | InvalidArgumentsType>;
}

export type ICreateUserArgs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
