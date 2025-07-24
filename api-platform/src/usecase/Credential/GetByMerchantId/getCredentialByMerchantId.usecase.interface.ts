export interface IGetCredentialByMerchantIdUseCase<SuccessType, ErrorType, NotFoundType> {
    execute(merchantId: string): Promise<SuccessType | ErrorType | NotFoundType>;
}