export interface ICreateUserUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
> {
  execute(
    args: ICreateUserArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | AlreadyExistsType | InvalidArgumentsType
  >;
}

type ICreateUserArgs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
