export interface IAddMerchantContactUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
  NotFoundType,
> {
  execute(
    args: IAddMerchantContactUseCaseArgs,
  ): Promise<
    | SuccessType
    | FunctionalErrorType
    | AlreadyExistsType
    | InvalidArgumentsType
    | NotFoundType
  >;
}

export type IAddMerchantContactUseCaseArgs = {
  merchantId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};
