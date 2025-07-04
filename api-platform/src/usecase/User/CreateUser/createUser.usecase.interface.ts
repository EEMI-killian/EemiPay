export interface ICreateUserUseCase<
  SuccessType,
  FunctionnalErrorType,
  AlreadyExistsType,
> {
  execute(
    args: ICreateUserArgs,
  ): Promise<SuccessType | FunctionnalErrorType | AlreadyExistsType>;
}

export type ICreateUserArgs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
