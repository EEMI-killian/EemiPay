
export interface IFindAllTransactionByMerchantIdUseCase<SuccessType, FunctionalErrorType> {
  execute(merchantId: string): Promise<SuccessType | FunctionalErrorType>;
}