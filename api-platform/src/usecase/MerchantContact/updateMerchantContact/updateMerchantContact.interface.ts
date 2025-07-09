export interface IAddMerchantContactUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> {
  execute(
    args: IUpdateMerchantContactUseCaseArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  >;
}

export type IUpdateMerchantContactUseCaseArgs = {
  merchantId: number;
  merchantContactId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};
