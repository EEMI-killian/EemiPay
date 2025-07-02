export interface ICreateUserUseCase<SuccessType, FunctionnalErrorType, AlreadyExistsType> {
    execute(args: ICreateUserArgs ): Promise<SuccessType | FunctionnalErrorType | AlreadyExistsType>;
}

export type ICreateUserArgs = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export type ICreateUserPresenter<SuccessType, FunctionnalErrorType, AlreadyExistsType> = {
    success: (id: number) => Promise<SuccessType>;
    error: (error: string) => Promise<FunctionnalErrorType>;
    alreadyExists: () => Promise<AlreadyExistsType>;
  }